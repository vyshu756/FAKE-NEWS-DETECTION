from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from model_loader import FakeNewsDetector
from database import PredictionDatabase
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Fake News Detection API",
    description="AI-powered fake news detection using fine-tuned BERT model",
    version="1.0.0"
)

# Configure CORS for production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize model and database
detector = None
db = None


class NewsInput(BaseModel):
    text: str = Field(..., min_length=1, description="News article content to analyze")


class PredictionOutput(BaseModel):
    prediction: str = Field(..., description="Classification result: 'Fake News' or 'Real News'")
    confidence_score: float = Field(..., description="Model confidence probability (0-1)")
    credibility_score: float = Field(..., description="Credibility score on 0-100 scale")
    important_keywords: list[str] = Field(..., description="Top 5 words that influenced the prediction")


@app.on_event("startup")
async def startup_event():
    """Load model and initialize database on startup"""
    global detector, db
    try:
        logger.info("Starting up application...")
        detector = FakeNewsDetector(model_path="fake_news_model")
        logger.info("Model loaded successfully")
        
        db = PredictionDatabase(db_path="predictions.db")
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize application: {str(e)}")
        raise


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Fake News Detection API is running",
        "version": "1.0.0"
    }


@app.post("/predict", response_model=PredictionOutput)
async def predict(news: NewsInput):
    """
    Predict if a news article is fake or real with explainability
    
    Args:
        news: NewsInput object containing the text to analyze
        
    Returns:
        PredictionOutput with prediction, confidence_score, credibility_score, and important_keywords
    """
    try:
        if detector is None:
            raise HTTPException(
                status_code=503,
                detail="Model not loaded. Please try again later."
            )

        result = detector.predict(news.text)
        
        # Save prediction to database
        if db is not None:
            try:
                db.save_prediction(
                    input_text=news.text,
                    prediction=result["prediction"],
                    confidence_score=result["confidence_score"],
                    credibility_score=result["credibility_score"]
                )
            except Exception as db_error:
                logger.error(f"Failed to save prediction to database: {str(db_error)}")
                # Continue even if database save fails
        
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during prediction: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": detector is not None,
        "database_initialized": db is not None,
        "device": str(detector.device) if detector else "N/A"
    }


class AnalyticsOutput(BaseModel):
    total_predictions: int = Field(..., description="Total number of predictions made")
    fake_news_count: int = Field(..., description="Number of fake news predictions")
    real_news_count: int = Field(..., description="Number of real news predictions")
    fake_news_percentage: float = Field(..., description="Percentage of fake news predictions")
    real_news_percentage: float = Field(..., description="Percentage of real news predictions")


@app.get("/analytics", response_model=AnalyticsOutput)
async def get_analytics():
    """
    Get analytics about prediction history
    
    Returns:
        AnalyticsOutput with statistics about all predictions
    """
    try:
        if db is None:
            raise HTTPException(
                status_code=503,
                detail="Database not initialized. Please try again later."
            )
        
        analytics = db.get_analytics()
        return analytics
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching analytics: {str(e)}"
        )


@app.get("/history")
async def get_history(limit: int = 10):
    """
    Get recent prediction history
    
    Args:
        limit: Number of recent predictions to retrieve (default: 10)
        
    Returns:
        List of recent predictions
    """
    try:
        if db is None:
            raise HTTPException(
                status_code=503,
                detail="Database not initialized. Please try again later."
            )
        
        history = db.get_recent_predictions(limit=limit)
        return {"history": history, "count": len(history)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"History error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching history: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
