# Fake News Detector Frontend

Modern React frontend for AI-powered fake news detection system.

## Features

- Dark theme UI with Tailwind CSS
- Real-time news article analysis
- Confidence and credibility scoring
- Important keywords highlighting
- Analytics dashboard
- Responsive design

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update API URL in `.env` if needed:
```
REACT_APP_API_URL=http://localhost:8000
```

4. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Detector.js       # Main detection interface
│   │   ├── Dashboard.js      # Analytics dashboard
│   │   ├── ResultCard.js     # Result display component
│   │   └── LoadingSpinner.js # Loading indicator
│   ├── App.js                # Main app component
│   ├── index.js              # Entry point
│   └── index.css             # Global styles
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
└── package.json              # Dependencies
```

## API Integration

The frontend connects to the FastAPI backend at the URL specified in `.env`:

- POST `/predict` - Analyze news article
- GET `/analytics` - Fetch prediction statistics

## Technologies

- React 18
- Tailwind CSS
- Axios
- React Router
