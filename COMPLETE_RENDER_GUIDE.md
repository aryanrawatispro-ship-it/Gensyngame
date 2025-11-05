# COMPLETE Render Deployment Guide - Step by Step

**⏱️ Total Time: 15-20 minutes**
**💰 Cost: $0 (Free Tier)**
**🎯 Result: Live, playable game on the internet!**

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

Before starting, make sure you have:

- [ ] GitHub account created
- [ ] Code pushed to GitHub repository
- [ ] Render account created (go to https://render.com and sign up)
- [ ] 15-20 minutes of free time
- [ ] Internet browser open

---

## 🚀 **PART 1: INITIAL SETUP (5 minutes)**

### **Step 1: Sign Up for Render**

1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with:
   - GitHub (RECOMMENDED - makes connection easier)
   - Or Google/Email

**Expected Result:** You're on the Render Dashboard

---

### **Step 2: Connect GitHub Repository**

1. On Render Dashboard, you'll see: **"Connect your account"**
2. Click **"GitHub"** button
3. Authorize Render to access your GitHub
4. Select repositories:
   - **Option A:** "All repositories" (easiest)
   - **Option B:** "Only select repositories" → Choose Gensyngame

5. Click **"Install & Authorize"**

**Expected Result:** Green checkmark showing GitHub is connected

---

## 🎯 **PART 2: BLUEPRINT DEPLOYMENT (5 minutes)**

### **Step 3: Start Blueprint Deployment**

1. On Render Dashboard, click the **blue "New +"** button (top right)
2. From dropdown, select **"Blueprint"**

**What you'll see:**
- A page titled "New Blueprint Instance"
- Option to select a repository

---

### **Step 4: Select Your Repository**

1. Click **"Connect a repository"** dropdown
2. Find and select: **your-username/Gensyngame**
3. Click **"Connect"**

**What happens:**
- Render scans your repo
- Finds `render.yaml` file
- Shows: "Blueprint detected! 🎉"

---

### **Step 5: Configure Blueprint**

You'll see two services listed:
1. **gensyn-valley-api** (Web Service)
2. **gensyn-valley-frontend** (Static Site)

**Configuration shown:**
- ✅ Service names
- ✅ Service types
- ✅ Build commands (auto-detected from render.yaml)
- ✅ Start commands (auto-detected)

**DO THIS:**
1. Review the configuration (should look correct)
2. Scroll down to **"Blueprint Name"**
3. Keep default name or change it
4. Click the big blue **"Apply"** button

**Expected Result:**
- Page shows "Deploying..."
- Two services appear in your dashboard
- Both show "In Progress" status

---

### **Step 6: Wait for Initial Deployment (3-5 minutes)**

**What's happening:**
- Backend is installing Python dependencies
- Frontend is installing Node dependencies and building
- Both services are starting up

**Watch for:**
- **Backend**: Status changes to "Live" (green dot)
- **Frontend**: Status changes to "Live" (green dot)

**This takes 3-5 minutes - BE PATIENT!**

**If you see errors:**
- Click on the service → View Logs
- Most first-time deployments succeed, errors are rare

---

## 🔧 **PART 3: CONFIGURE ENVIRONMENT VARIABLES (3 minutes)**

### **Step 7: Get Your Service URLs**

Once both services show **"Live"** (green):

1. Click on **"gensyn-valley-api"** service
2. At the top, you'll see a URL like: `https://gensyn-valley-api.onrender.com`
3. **COPY THIS URL** (you'll need it in a moment)

4. Go back to Dashboard
5. Click on **"gensyn-valley-frontend"** service
6. At the top, you'll see a URL like: `https://gensyn-valley-frontend.onrender.com`
7. **COPY THIS URL** too

**Write these down:**
```
Backend URL: https://gensyn-valley-api.onrender.com
Frontend URL: https://gensyn-valley-frontend.onrender.com
```

---

### **Step 8: Configure Backend Environment Variables**

1. Click on **"gensyn-valley-api"** service
2. In left sidebar, click **"Environment"**
3. You'll see existing environment variables
4. Click **"Add Environment Variable"**

**Add this variable:**
- **Key**: `FRONTEND_URL`
- **Value**: `https://gensyn-valley-frontend.onrender.com` (YOUR actual frontend URL)

5. Click **"Save Changes"**

**Expected Result:** Variable saved, service will auto-redeploy

---

### **Step 9: Configure Frontend Environment Variables**

1. Go back to Dashboard
2. Click on **"gensyn-valley-frontend"** service
3. In left sidebar, click **"Environment"**
4. Click **"Add Environment Variable"**

**Add this variable:**
- **Key**: `REACT_APP_API_URL`
- **Value**: `https://gensyn-valley-api.onrender.com` (YOUR actual backend URL)

5. Click **"Save Changes"**

**Expected Result:** Variable saved, service will auto-redeploy

---

### **Step 10: Wait for Redeployment (2-3 minutes)**

Both services will now redeploy with the new environment variables.

**Watch for:**
- Both services show "Deploying..."
- Then both return to "Live" (green dot)

**This takes 2-3 minutes**

---

## 🎮 **PART 4: TEST YOUR GAME (2 minutes)**

### **Step 11: Open Your Game**

1. Copy your **frontend URL**: `https://gensyn-valley-frontend.onrender.com`
2. Open it in a **new browser tab**
3. **WAIT 30-60 seconds** on first load (services may be spinning up)

**What you should see:**
- Loading screen briefly
- Then the game loads!
- Pixel art grass field
- Your character (blue)
- Verde (green) and Skip-Pipe (orange)

---

### **Step 12: Test Gameplay**

Test these features:

**Movement:**
- [ ] Press **W** or **↑** - Character moves up
- [ ] Press **S** or **↓** - Character moves down
- [ ] Press **A** or **←** - Character moves left
- [ ] Press **D** or **→** - Character moves right
- [ ] Walking animation plays

**NPCs:**
- [ ] Walk close to Verde (green character)
- [ ] You see **yellow exclamation mark** and **[E] Talk**
- [ ] Press **E** key
- [ ] Dialog box appears at bottom
- [ ] Click to advance through dialog
- [ ] Dialog closes

**Quest Log:**
- [ ] Check right side of screen
- [ ] Quest log shows "Meet Verde the Validator"
- [ ] After talking to Verde, quest completes (green checkmark)

**Graphics:**
- [ ] Pixel art is sharp (not blurry)
- [ ] Trees, flowers, rocks visible
- [ ] Dirt path across middle
- [ ] Character shadows

---

## ✅ **VERIFICATION CHECKLIST**

After deployment, verify:

### **Backend Service**
- [ ] Status shows "Live" (green dot)
- [ ] URL works: `https://your-backend.onrender.com`
- [ ] API docs work: `https://your-backend.onrender.com/docs`
- [ ] Environment variable `FRONTEND_URL` is set

### **Frontend Service**
- [ ] Status shows "Live" (green dot)
- [ ] URL loads the game
- [ ] No errors in browser console (press F12)
- [ ] Environment variable `REACT_APP_API_URL` is set

### **Game Functionality**
- [ ] Player can move
- [ ] Can interact with NPCs
- [ ] Dialog displays correctly
- [ ] Quest log updates
- [ ] Pixel art renders properly

---

## 🐛 **TROUBLESHOOTING GUIDE**

### **Problem: Frontend shows blank white page**

**Check:**
1. Open browser console (F12) → Console tab
2. Look for error messages

**Common Causes:**

**A) "Failed to fetch" or Network errors**
```
Failed to fetch NPCs
```
**Solution:**
- Backend might not be running
- Check backend status in Render dashboard
- If backend is "Live", wait 60 seconds and refresh
- Backend may be spinning up from sleep

**B) Wrong API URL**
```
404 Not Found
```
**Solution:**
- Go to Frontend service → Environment
- Check `REACT_APP_API_URL` is correct
- Should be: `https://gensyn-valley-api.onrender.com`
- Include `https://`
- Click "Save Changes" and wait for redeploy

---

### **Problem: CORS Error**

**Error message:**
```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Solution:**
1. Go to Backend service → Environment
2. Check `FRONTEND_URL` variable
3. Should match your frontend URL EXACTLY
4. Include `https://`
5. No trailing slash
6. Click "Save Changes"
7. Wait for backend to redeploy (2-3 min)
8. Refresh your game page

**Example:**
```
✅ CORRECT: https://gensyn-valley-frontend.onrender.com
❌ WRONG: http://gensyn-valley-frontend.onrender.com (http not https)
❌ WRONG: gensyn-valley-frontend.onrender.com (missing https://)
❌ WRONG: https://gensyn-valley-frontend.onrender.com/ (trailing slash)
```

---

### **Problem: Game loads but NPCs don't appear**

**Symptoms:**
- See grass and trees
- No Verde or Skip-Pipe characters
- Quest log is empty

**Solution:**
1. Open browser console (F12)
2. Look for network errors
3. Go to Network tab
4. Refresh page
5. Check if requests to backend are failing

**If requests are red/failed:**
- Backend is not running or wrong URL
- Check `REACT_APP_API_URL` in frontend environment variables
- Make sure backend service is "Live"

---

### **Problem: 502 Bad Gateway**

**What it means:**
- Service is starting up (if you just deployed)
- Service crashed (if it was working before)

**Solution if just deployed:**
- Wait 60-90 seconds
- Services take time to spin up on free tier
- Refresh the page

**Solution if it was working:**
- Go to service → Logs
- Look for error messages
- Common causes:
  - Out of memory (free tier has 512MB)
  - Code error causing crash
  - Check recent changes

---

### **Problem: Services keep spinning down**

**What's happening:**
- Free tier spins down after 15 minutes of inactivity
- This is NORMAL and expected

**What to expect:**
- First visit after idle: 30-60 seconds to wake up
- Subsequent visits: instant (while awake)
- Game state resets when services restart

**Solutions:**
- **Option A:** Accept it (it's free!)
- **Option B:** Upgrade to paid tier ($7/month) for always-on
- **Option C:** Use a ping service to keep it awake (not recommended)

---

### **Problem: Build failed**

**In Backend:**

**Error:** `ModuleNotFoundError`
**Solution:**
- Check `backend/requirements.txt` exists
- Verify all dependencies are listed
- Check logs for specific missing module

**Error:** `Python version not found`
**Solution:**
- Go to Environment variables
- Set `PYTHON_VERSION` = `3.11.0`
- Redeploy

**In Frontend:**

**Error:** `npm install failed`
**Solution:**
- Check `frontend/package.json` exists
- Verify JSON is valid (no syntax errors)
- Check logs for specific error

**Error:** `Module not found`
**Solution:**
- Missing dependency in package.json
- Check imports in your code
- Verify file paths are correct

---

## 📊 **UNDERSTANDING THE LOGS**

### **How to View Logs:**

1. Click on a service
2. Top tabs show: **Events | Logs | Shell | Metrics**
3. Click **"Logs"**
4. Real-time logs appear

### **Backend Logs - What's Normal:**

```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000
```
✅ This is good! Backend is running.

### **Backend Logs - Errors:**

```
ModuleNotFoundError: No module named 'fastapi'
```
❌ Missing dependency - check requirements.txt

```
Address already in use
```
❌ Restart the service

### **Frontend Logs - What's Normal:**

```
Creating an optimized production build...
Compiled successfully.
```
✅ Build succeeded!

### **Frontend Logs - Errors:**

```
Module not found: Can't resolve './components/GameCanvas'
```
❌ File path issue or missing file

```
npm ERR! code ENOENT
```
❌ Missing package.json or corrupted

---

## 🔄 **UPDATING YOUR DEPLOYED GAME**

### **When you make code changes:**

**Automatic Deployment:**
1. Commit changes: `git commit -m "your message"`
2. Push to GitHub: `git push origin main`
3. Render auto-detects the push
4. Automatically rebuilds and redeploys
5. Takes 2-5 minutes
6. No action needed from you!

**Manual Deployment:**
1. Go to service in Render dashboard
2. Click **"Manual Deploy"** (top right)
3. Select **"Clear build cache & deploy"** (if major changes)
4. Or **"Deploy latest commit"** (for small changes)
5. Wait for deployment to complete

---

## ⚙️ **ADVANCED: SERVICE SETTINGS**

### **Useful Settings to Know:**

**Auto-Deploy:**
- **Location:** Service Settings → "Auto-Deploy"
- **Default:** ON (deploys on every push)
- **Turn OFF if:** You want to manually control deployments

**Branch:**
- **Location:** Service Settings → "Branch"
- **Default:** main
- **Change to:** Your working branch if needed

**Health Check Path:**
- **Backend Only**
- **Location:** Service Settings → "Health Check Path"
- **Default:** `/`
- **Backend responds:** `{"message": "Welcome to Gensyn Valley API"}`

**Restart Policy:**
- Services auto-restart on crashes
- Can't be changed on free tier

---

## 💰 **COST BREAKDOWN**

### **Free Tier (What You're Using):**

**Per Service:**
- 750 hours/month compute time
- 512 MB RAM
- Shared CPU
- Spins down after 15 min inactivity
- 100 GB bandwidth

**For This Project:**
- **Backend:** 1 web service = Free
- **Frontend:** 1 static site = Free
- **Total Cost:** $0/month ✅

### **If You Upgrade (Optional):**

**Starter Plan ($7/month per service):**
- Always on (no spin down)
- 512 MB RAM
- Shared CPU
- Better for production use

---

## 🎯 **COMMON FIRST-TIME ISSUES**

### **Issue 1: "I don't see my repository"**

**Solution:**
- Go to https://github.com/settings/installations
- Find "Render"
- Click "Configure"
- Add your repository to allowed list

---

### **Issue 2: "Environment variables not working"**

**For Frontend variables:**
- Must start with `REACT_APP_`
- Must redeploy after adding
- Built into the code at build time (not runtime)
- Changes require rebuild

**For Backend variables:**
- No prefix needed
- Applied on restart
- No rebuild needed

---

### **Issue 3: "URLs are different than in guide"**

**This is normal!**
- Render generates unique URLs
- May add numbers/letters if name is taken
- Example: `gensyn-valley-api-abc123.onrender.com`
- Use YOUR actual URLs, not examples

---

## 📱 **SHARING YOUR GAME**

Once deployed, you can share your game!

**Your Public URL:**
```
https://gensyn-valley-frontend.onrender.com
```
(Use your actual URL)

**Share it:**
- Post on social media
- Send to friends
- Add to your portfolio
- Include in GitHub README

**Important Notes:**
- Anyone can access it (it's public)
- Free tier = may be slow on first load
- Game state doesn't persist (in-memory only)
- Services sleep after 15 min = slow wake-up

---

## 🔐 **SECURITY NOTES**

**Current Setup:**
- No authentication
- All data is public
- In-memory only (resets on restart)
- CORS configured for your frontend only

**For Production:**
- Add user authentication
- Add database for persistence
- Add rate limiting
- Add input validation
- Use environment secrets for sensitive data

---

## 📈 **MONITORING YOUR APP**

### **Built-in Metrics:**

1. Go to service → **"Metrics"** tab
2. You can see:
   - CPU usage
   - Memory usage
   - Request count
   - Response times
   - Error rates

### **What to Watch:**

**Memory:**
- Free tier = 512 MB
- If near limit, service may crash
- Check logs for "Out of memory"

**CPU:**
- Spikes are normal
- Sustained 100% means optimization needed

---

## ✅ **FINAL CHECKLIST**

After completing this guide, you should have:

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Backend service deployed and "Live"
- [ ] Frontend service deployed and "Live"
- [ ] Environment variables configured
- [ ] Backend URL accessible
- [ ] Frontend loads the game
- [ ] Player movement works
- [ ] NPCs visible and interactive
- [ ] Pixel art renders correctly
- [ ] No CORS errors
- [ ] Quest log visible
- [ ] Game fully functional

---

## 🆘 **STILL HAVING ISSUES?**

### **Where to Get Help:**

1. **Render Discord:** https://render.com/discord
2. **Render Docs:** https://render.com/docs
3. **Render Community:** https://community.render.com
4. **GitHub Issues:** Post in your repo

### **When Asking for Help, Include:**

- Service logs (copy/paste relevant errors)
- Browser console errors (F12 → Console tab)
- Your service URLs (frontend and backend)
- What you've already tried
- Screenshots if possible

---

## 🎉 **CONGRATULATIONS!**

Your game is now **LIVE ON THE INTERNET!** 🌐

**What you've accomplished:**
✅ Deployed a full-stack application
✅ Configured environment variables
✅ Set up CORS correctly
✅ Got a working production deployment
✅ Created something you can share!

**Next steps:**
- Share your game URL!
- Add more features
- Get feedback from players
- Keep building!

---

**Your Frontend URL:** (share this!)
```
https://gensyn-valley-frontend.onrender.com
```

**Have fun and happy gaming!** 🎮✨
