import sqlite3
from datetime import datetime
from contextlib import contextmanager
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class PredictionDatabase:
    def __init__(self, db_path: str = "predictions.db"):
        self.db_path = db_path
        self._initialize_database()

    def _initialize_database(self):
        """Initialize the database and create tables if they don't exist"""
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS predictions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        input_text TEXT NOT NULL,
                        prediction TEXT NOT NULL,
                        confidence_score REAL NOT NULL,
                        credibility_score REAL NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                conn.commit()
                logger.info(f"Database initialized at {self.db_path}")
        except Exception as e:
            logger.error(f"Error initializing database: {str(e)}")
            raise

    @contextmanager
    def _get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()

    def save_prediction(self, input_text: str, prediction: str, 
                       confidence_score: float, credibility_score: float):
        """
        Save a prediction to the database
        
        Args:
            input_text: The input news article text
            prediction: The prediction result ('Fake News' or 'Real News')
            confidence_score: Model confidence score
            credibility_score: Credibility score (0-100)
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO predictions 
                    (input_text, prediction, confidence_score, credibility_score)
                    VALUES (?, ?, ?, ?)
                """, (input_text, prediction, confidence_score, credibility_score))
                conn.commit()
                logger.info(f"Saved prediction: {prediction}")
        except Exception as e:
            logger.error(f"Error saving prediction: {str(e)}")
            raise

    def get_analytics(self) -> dict:
        """
        Get analytics about all predictions
        
        Returns:
            dict with total_predictions, fake_news_count, real_news_count, 
            fake_news_percentage, real_news_percentage
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                # Get total count
                cursor.execute("SELECT COUNT(*) as total FROM predictions")
                total = cursor.fetchone()['total']
                
                # Get fake news count
                cursor.execute("""
                    SELECT COUNT(*) as count 
                    FROM predictions 
                    WHERE prediction = 'Fake News'
                """)
                fake_count = cursor.fetchone()['count']
                
                # Get real news count
                cursor.execute("""
                    SELECT COUNT(*) as count 
                    FROM predictions 
                    WHERE prediction = 'Real News'
                """)
                real_count = cursor.fetchone()['count']
                
                # Calculate percentages
                fake_percentage = round((fake_count / total * 100), 2) if total > 0 else 0.0
                real_percentage = round((real_count / total * 100), 2) if total > 0 else 0.0
                
                return {
                    "total_predictions": total,
                    "fake_news_count": fake_count,
                    "real_news_count": real_count,
                    "fake_news_percentage": fake_percentage,
                    "real_news_percentage": real_percentage
                }
                
        except Exception as e:
            logger.error(f"Error getting analytics: {str(e)}")
            raise

    def get_recent_predictions(self, limit: int = 10) -> list:
        """
        Get recent predictions
        
        Args:
            limit: Number of recent predictions to retrieve
            
        Returns:
            List of recent predictions
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, input_text, prediction, confidence_score, 
                           credibility_score, timestamp
                    FROM predictions
                    ORDER BY timestamp DESC
                    LIMIT ?
                """, (limit,))
                
                rows = cursor.fetchall()
                return [dict(row) for row in rows]
                
        except Exception as e:
            logger.error(f"Error getting recent predictions: {str(e)}")
            raise
