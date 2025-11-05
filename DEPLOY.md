# Deploying Gensyn Valley to Render

This guide will walk you through deploying Gensyn Valley to Render's free tier.

## Prerequisites

- A GitHub account with this repository
- A Render account (sign up at https://render.com - it's free!)
- Your code pushed to GitHub

## Deployment Overview

We'll deploy two services:
1. **Backend API** (Python/FastAPI) - Web Service
2. **Frontend** (React) - Static Site

## Step-by-Step Deployment

### Option 1: Using render.yaml (Recommended - One-Click Deploy)

This is the easiest method as the `render.yaml` file is already configured.

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Go to Render Dashboard**:
   - Visit https://dashboard.render.com
   - Click "New +" → "Blueprint"

3. **Connect Your Repository**:
   - Select "Connect a repository"
   - Choose this GitHub repository
   - Render will automatically detect the `render.yaml` file

4. **Configure Environment Variables**:

   **For the Backend Service (gensyn-valley-api)**:
   - `FRONTEND_URL`: Will be set after frontend deploys (see step 6)

   **For the Frontend Service (gensyn-valley-frontend)**:
   - `REACT_APP_API_URL`: Will be set after backend deploys (see step 5)

5. **Click "Apply"** - Render will create both services

6. **Get Your Service URLs**:
   After deployment completes, you'll get two URLs:
   - Backend: `https://gensyn-valley-api.onrender.com`
   - Frontend: `https://gensyn-valley-frontend.onrender.com`

7. **Update Environment Variables**:

   **Backend Service**:
   - Go to the backend service settings
   - Add environment variable:
     - `FRONTEND_URL` = `https://gensyn-valley-frontend.onrender.com`

   **Frontend Service**:
   - Go to the frontend service settings
   - Add environment variable:
     - `REACT_APP_API_URL` = `https://gensyn-valley-api.onrender.com`

8. **Redeploy Both Services**:
   - After adding environment variables, manually redeploy both services
   - Go to each service → "Manual Deploy" → "Deploy latest commit"

9. **Done!** Visit your frontend URL to play the game!

### Option 2: Manual Deployment

If you prefer to set up services manually:

#### Deploy Backend First

1. **Create Web Service**:
   - Dashboard → "New +" → "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Name**: `gensyn-valley-api`
     - **Region**: Choose closest to you
     - **Branch**: `main` (or your branch)
     - **Root Directory**: Leave empty
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r backend/requirements.txt`
     - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free

2. **Add Environment Variables**:
   - `PYTHON_VERSION` = `3.11.0`
   - `FRONTEND_URL` = (leave blank for now, will add after frontend deploys)

3. **Create Service** and wait for deployment

4. **Note the URL**: e.g., `https://gensyn-valley-api.onrender.com`

#### Deploy Frontend Second

1. **Create Static Site**:
   - Dashboard → "New +" → "Static Site"
   - Connect your GitHub repo
   - Configure:
     - **Name**: `gensyn-valley-frontend`
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/build`

2. **Add Environment Variable**:
   - `REACT_APP_API_URL` = `https://gensyn-valley-api.onrender.com` (use your actual backend URL)

3. **Create Static Site**

4. **Note the URL**: e.g., `https://gensyn-valley-frontend.onrender.com`

#### Update Backend CORS

1. Go back to your backend service settings
2. Add environment variable:
   - `FRONTEND_URL` = `https://gensyn-valley-frontend.onrender.com` (your actual frontend URL)
3. Redeploy the backend service

## Important Notes

### Free Tier Limitations

- **Spin Down**: Free tier services spin down after 15 minutes of inactivity
- **First Load**: When accessing after spin-down, it takes ~30-60 seconds to wake up
- **No Persistence**: In-memory game state will reset when services restart
- **Monthly Hours**: 750 hours/month per service (enough for one service 24/7)

### Testing Your Deployment

1. Visit your frontend URL: `https://gensyn-valley-frontend.onrender.com`
2. Open browser console (F12) to check for errors
3. Try moving around and talking to NPCs
4. If there are CORS errors:
   - Verify `FRONTEND_URL` is set correctly in backend
   - Verify `REACT_APP_API_URL` is set correctly in frontend
   - Redeploy both services

### Troubleshooting

#### Backend won't start
- Check logs in Render dashboard
- Verify `backend/requirements.txt` exists
- Ensure start command is correct: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Frontend shows blank page
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Make sure it points to the backend URL (with https://)
- Redeploy frontend after changing env vars

#### CORS Errors
```
Access to fetch at 'https://...' has been blocked by CORS policy
```
**Solution**:
- Make sure `FRONTEND_URL` environment variable in backend matches your actual frontend URL
- Include the protocol (`https://`)
- Redeploy backend after changing

#### 502 Bad Gateway
- Service is likely starting up (wait 30-60 seconds)
- Or check logs for startup errors

#### Game loads but NPCs don't appear
- Backend might not be running
- Check browser console for fetch errors
- Verify backend URL is correct

### Monitoring Your Services

- **Logs**: Each service has a "Logs" tab - check for errors
- **Metrics**: View CPU, memory usage in dashboard
- **Events**: See deployment history

### Updating Your Deployment

When you push changes to GitHub:
1. Render automatically detects the push
2. Rebuilds and redeploys your services
3. Usually takes 2-5 minutes

You can also manually trigger deployment:
- Go to service → "Manual Deploy" → "Deploy latest commit"

### Custom Domain (Optional)

Free tier includes:
- Custom domain support
- Automatic SSL certificates

To add:
1. Go to service settings → "Custom Domain"
2. Add your domain
3. Update DNS records as instructed

## Cost Optimization

To stay within free tier:
- Use only 1 backend service and 1 frontend service
- Services auto-sleep after 15 min (this is fine for prototype)
- No credit card required for free tier

## Production Considerations

For a production deployment, consider:
- Upgrading to paid tier ($7/month) for always-on services
- Adding a database (PostgreSQL on Render)
- Implementing proper state persistence
- Adding authentication
- Setting up monitoring and alerts
- Using Redis for session storage

## Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check service logs in Render dashboard
- Review browser console for frontend errors

---

**Your game should now be live and playable on the internet!** 🎮

Share your frontend URL with others to let them play Gensyn Valley!
