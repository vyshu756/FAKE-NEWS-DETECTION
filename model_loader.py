import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FakeNewsDetector:
    def __init__(self, model_path: str = "fake_news_model"):
        self.model_path = Path(model_path)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.tokenizer = None
        self._load_model()

    def _load_model(self):
        """Load the fine-tuned BERT model and tokenizer"""
        try:
            logger.info(f"Loading model from {self.model_path}")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.model_path)
            self.model.to(self.device)
            self.model.eval()
            logger.info(f"Model loaded successfully on {self.device}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise

    def _get_token_importance(self, text: str, inputs: dict, predicted_class: int) -> list:
        """
        Calculate token importance using gradient-based method
        
        Args:
            text: Original text
            inputs: Tokenized inputs
            predicted_class: Predicted class index
            
        Returns:
            List of top 5 important words
        """
        try:
            # Enable gradients for input embeddings
            embeddings = self.model.get_input_embeddings()
            input_ids = inputs['input_ids']
            
            # Get embeddings and enable gradient tracking
            input_embeds = embeddings(input_ids)
            input_embeds.requires_grad = True
            
            # Forward pass with embeddings
            outputs = self.model(inputs_embeds=input_embeds, attention_mask=inputs['attention_mask'])
            logits = outputs.logits
            
            # Get score for predicted class
            score = logits[0, predicted_class]
            
            # Backward pass to get gradients
            score.backward()
            
            # Calculate importance as gradient magnitude
            gradients = input_embeds.grad
            importance = torch.norm(gradients, dim=-1).squeeze()
            
            # Get tokens
            tokens = self.tokenizer.convert_ids_to_tokens(input_ids[0])
            
            # Filter out special tokens and get importance scores
            token_importance = []
            for idx, (token, score) in enumerate(zip(tokens, importance)):
                if token not in ['[CLS]', '[SEP]', '[PAD]', '<s>', '</s>', '<pad>']:
                    # Clean token (remove ## for subwords)
                    clean_token = token.replace('##', '')
                    if clean_token.strip():
                        token_importance.append((clean_token, score.item()))
            
            # Sort by importance and get top 5
            token_importance.sort(key=lambda x: x[1], reverse=True)
            top_keywords = [token for token, _ in token_importance[:5]]
            
            return top_keywords
            
        except Exception as e:
            logger.warning(f"Error calculating token importance: {str(e)}")
            # Fallback: return simple word frequency
            return self._fallback_keywords(text)
    
    def _fallback_keywords(self, text: str) -> list:
        """
        Fallback method: extract keywords based on word length and uniqueness
        
        Args:
            text: Original text
            
        Returns:
            List of top 5 keywords
        """
        words = text.split()
        # Filter out short words and common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are', 'was', 'were'}
        filtered_words = [w.strip('.,!?;:') for w in words if len(w) > 4 and w.lower() not in stop_words]
        # Return first 5 unique words
        unique_words = []
        for word in filtered_words:
            if word not in unique_words:
                unique_words.append(word)
            if len(unique_words) == 5:
                break
        return unique_words[:5]

    def predict(self, text: str) -> dict:
        """
        Predict if the news article is fake or real with explainability
        
        Args:
            text: News article content
            
        Returns:
            dict with prediction, confidence_score, credibility_score, and important_keywords
        """
        try:
            # Tokenize input
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}

            # Get prediction
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits

            # Apply softmax to get probabilities
            probabilities = torch.nn.functional.softmax(logits, dim=-1)
            confidence_score = torch.max(probabilities).item()
            predicted_class = torch.argmax(probabilities, dim=-1).item()

            # Map class to label (0: Real News, 1: Fake News)
            prediction = "Fake News" if predicted_class == 1 else "Real News"
            
            # Calculate credibility score (0-100 scale)
            credibility_score = round(confidence_score * 100, 2)
            
            # Get important keywords using gradient-based method
            important_keywords = self._get_token_importance(text, inputs, predicted_class)

            return {
                "prediction": prediction,
                "confidence_score": round(confidence_score, 4),
                "credibility_score": credibility_score,
                "important_keywords": important_keywords
            }

        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            raise
