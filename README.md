# 📰 Fake News Detection System

AI-powered full-stack web application for detecting fake news using a fine-tuned BERT model.
Built with FastAPI (backend) and React (frontend).

---

## 🚀 Features

- AI-powered fake news classification (Fine-tuned BERT)
- Real-time analytics dashboard
- Explainable AI (keyword importance)
- Prediction history tracking
- Docker support
- Swagger API documentation

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- PyTorch
- Transformers (BERT)
- SQLite
- Uvicorn

### Frontend
- React
- Axios
- Tailwind CSS

---

## 📂 Project Structure

fake-news-detection/
│
├── backend/
│   ├── main.py
│   ├── model_loader.py
│   ├── database.py
│   ├── requirements.txt
│   └── fake_news_model/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── public/
│
├── Dockerfile
└── README.md

---

## ⚙️ Setup Instructions

### Backend Setup

1. Clone repository  
   git clone <your-repo-url>  
   cd fake-news-detection  

2. Create virtual environment  
   python -m venv venv  
   venv\Scripts\activate   (Windows)  

3. Install dependencies  
   pip install -r requirements.txt  

4. Run backend  
   python main.py  

Backend will run at:  
http://localhost:8000  

Swagger Docs:  
http://localhost:8000/docs  

---

### Frontend Setup

1. Navigate to frontend  
   cd frontend  

2. Install dependencies  
   npm install  

3. Start frontend  
   npm start  

Frontend runs at:  
http://localhost:3000  

---

## 🐳 Docker Deployment

Build Image  
docker build -t fake-news-detector .

Run Container  
docker run -p 8000:8000 fake-news-detector

---

## 📌 API Endpoints

GET    /           → Root endpoint  
GET    /health     → Health check  
POST   /predict    → Analyze news article  
GET    /analytics  → Get prediction statistics  
GET    /history    → Get recent predictions  
GET    /docs       → API documentation (Swagger UI)

---

## 🤖 Model Information

- Architecture: BERT (Bidirectional Encoder Representations from Transformers)
- Task: Binary classification (Fake vs Real News)
- Explainability: Gradient-based token importance
- GPU Support: Automatic CUDA detection

---

## 🔒 Security Considerations

- Input validation on all endpoints
- CORS configuration
- HTTPS recommended for production
- Regular dependency updates

---

## 📦 Environment Variables

Backend:
- PORT (default: 8000)
- ALLOWED_ORIGINS (frontend URL)

Frontend:
- REACT_APP_API_URL (backend URL)

---

## 📜 License

MIT License

---

## 🙌 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📧 Support

For issues or questions, please open an issue on GitHub.

⭐ If you like this project, give it a star!