# 🚀 Fake News Detection System - Deployment Guide

## Option 1: Deploy to Cloud (Recommended for Sharing)

### A. Deploy Backend to Render (Free)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/fake-news-detector.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** fake-news-detector-api
     - **Environment:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variable:
     - `ALLOWED_ORIGINS` = `*` (or your frontend URL)
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your API URL (e.g., `https://fake-news-detector-api.onrender.com`)

3. **Your backend is now live!** 🎉
   - API Docs: `https://your-app.onrender.com/docs`
   - Health Check: `https://your-app.onrender.com/health`

### B. Deploy Frontend to Vercel (Free)

1. **Update frontend API URL:**
   - Create `frontend/.env.production`:
     ```
     REACT_APP_API_URL=https://your-render-app.onrender.com
     ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Create React App
     - **Root Directory:** frontend
     - **Build Command:** `npm run build`
     - **Output Directory:** build
   - Add Environment Variable:
     - `REACT_APP_API_URL` = Your Render backend URL
   - Click "Deploy"
   - Wait 2-3 minutes

3. **Your frontend is now live!** 🎉
   - Access at: `https://your-app.vercel.app`

---

## Option 2: Deploy to Railway (Alternative)

### Backend on Railway:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects settings
6. Add environment variable: `ALLOWED_ORIGINS=*`
7. Deploy automatically starts
8. Get your public URL

---

## Option 3: Share via Ngrok (Quick Demo)

If you want to quickly share your local setup:

1. **Install ngrok:**
   - Download from https://ngrok.com/download
   - Extract and add to PATH

2. **Start your backend:**
   ```bash
   python main.py
   ```

3. **Create public tunnel:**
   ```bash
   ngrok http 8000
   ```

4. **Share the URL:**
   - Ngrok will give you a public URL like: `https://abc123.ngrok.io`
   - Share this URL with anyone
   - They can access: `https://abc123.ngrok.io/docs`

5. **For frontend:**
   - Update `frontend/.env`:
     ```
     REACT_APP_API_URL=https://abc123.ngrok.io
     ```
   - Start frontend: `npm start`
   - Create another tunnel:
     ```bash
     ngrok http 3000
     ```
   - Share the frontend URL

**Note:** Ngrok free tier URLs expire when you close the terminal.

---

## Option 4: Docker Deployment

### Build and Run with Docker:

1. **Build the image:**
   ```bash
   docker build -t fake-news-detector .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8000:8000 fake-news-detector
   ```

3. **Deploy to any cloud:**
   - Push to Docker Hub
   - Deploy on AWS ECS, Google Cloud Run, or Azure Container Instances

---

## Option 5: Heroku Deployment

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku app:**
   ```bash
   heroku login
   heroku create fake-news-detector-api
   ```

3. **Add Procfile:**
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **Set environment variables:**
   ```bash
   heroku config:set ALLOWED_ORIGINS=*
   ```

---

## Sharing Your Application

### For Non-Technical Users:

Once deployed, share these links:

1. **Web Application:**
   - `https://your-app.vercel.app`
   - Users can paste news articles and get instant analysis

2. **API Documentation:**
   - `https://your-api.onrender.com/docs`
   - Interactive API testing interface

3. **Demo Video/Screenshots:**
   - Record a quick demo showing how to use it
   - Take screenshots of the interface

### What Users Need:

✅ **Nothing!** Just a web browser  
✅ No installation required  
✅ No coding knowledge needed  
✅ Works on any device (phone, tablet, computer)

---

## Cost Breakdown

### Free Tier Options:

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| **Render** | 750 hours/month | Sleeps after 15 min inactivity |
| **Vercel** | Unlimited | 100GB bandwidth/month |
| **Railway** | $5 credit/month | ~500 hours runtime |
| **Ngrok** | 1 tunnel | URL changes on restart |
| **Heroku** | 550 hours/month | Sleeps after 30 min |

**Recommended:** Render (backend) + Vercel (frontend) = 100% Free!

---

## Monitoring & Maintenance

### Keep Your App Awake (Render):

Create a simple cron job or use UptimeRobot:
- https://uptimerobot.com (free)
- Ping your API every 5 minutes: `https://your-api.onrender.com/health`

### Check Logs:

- **Render:** Dashboard → Logs tab
- **Vercel:** Dashboard → Deployments → View logs
- **Railway:** Dashboard → Deployments → Logs

---

## Troubleshooting

### Backend won't start:
- Check if model files are included in deployment
- Verify `requirements.txt` has all dependencies
- Check environment variables are set

### Frontend can't connect:
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Model loading errors:
- Ensure `fake_news_model/` folder is in repository
- Check file size limits (GitHub: 100MB, consider Git LFS)

---

## Security Considerations

### For Production:

1. **Update CORS:**
   ```python
   ALLOWED_ORIGINS = ["https://your-frontend.vercel.app"]
   ```

2. **Add Rate Limiting:**
   ```bash
   pip install slowapi
   ```

3. **Add API Key Authentication** (optional)

4. **Use HTTPS only**

5. **Monitor usage and costs**

---

## Next Steps

1. ✅ Choose deployment platform
2. ✅ Deploy backend
3. ✅ Deploy frontend
4. ✅ Test the live application
5. ✅ Share the URL with users
6. ✅ Monitor performance

**Your application is now accessible to anyone, anywhere! 🌍**
