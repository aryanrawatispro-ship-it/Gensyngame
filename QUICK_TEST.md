# Quick Test Guide - 3 Easy Options

## 🚀 **OPTION 1: One-Command Local Test (EASIEST)**

### Mac/Linux:
```bash
./quick-test.sh
```

### Windows:
```bash
quick-test.bat
```

**What it does:**
- Installs everything automatically
- Starts both backend and frontend
- Opens browser at http://localhost:3000
- Press Ctrl+C to stop

**Time:** 2-3 minutes (first time only)

---

## ⚡ **OPTION 2: Online Test (NO INSTALLATION NEEDED!)**

### Using CodeSandbox (Zero Setup):

1. **Go to**: https://codesandbox.io
2. **Click**: "Create Sandbox" → "Import from GitHub"
3. **Paste your repo URL**
4. **Wait** for it to load (1-2 minutes)
5. **Play!** The game runs in browser

**Time:** 2 minutes
**Cost:** Free
**Setup:** None!

---

## 🎯 **OPTION 3: Manual Quick Test (Minimal)**

### Just Backend (Test API Only):

```bash
# 1. Install backend
cd backend
pip install -r requirements.txt

# 2. Run backend
python main.py

# 3. Test it
# Visit: http://localhost:8000/docs
```

### Just Frontend (Test Graphics):

```bash
# 1. Install frontend
cd frontend
npm install

# 2. Run frontend
npm start

# 3. Play!
# Opens automatically at http://localhost:3000
```

**Note:** Frontend won't fetch data without backend running

---

## 🌐 **OPTION 4: Deploy to Render First (Test in Production)**

If you don't want to install anything locally:

1. **Push to GitHub** (already done ✅)
2. **Go to**: https://dashboard.render.com
3. **Deploy using render.yaml** (see DEPLOY.md)
4. **Test the live URL**

**Pros:**
- No local setup needed
- Test in real production environment
- Share with others

**Cons:**
- Takes 5-10 minutes to deploy
- Free tier spins down after 15 min

---

## 💻 **What You Need (Minimum)**

### For Local Testing:
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)

### For Online Testing:
- Just a browser! 🎉

---

## 🎮 **Testing Checklist**

Once running, test these:

- [ ] **Move with WASD or Arrow Keys**
- [ ] **Walk to Verde (green character)**
- [ ] **Press E to talk**
- [ ] **Click through dialog**
- [ ] **Check quest log on right side**
- [ ] **Walk in all 4 directions**
- [ ] **Verify pixel art graphics**
- [ ] **Test with Skip-Pipe (orange character)**

---

## 🐛 **Troubleshooting**

### Backend won't start:
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
python main.py
```

### Frontend won't start:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port already in use:
```bash
# Find and kill process on port 8000 (backend)
# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## 🚀 **Recommended: Use CodeSandbox**

**Literally zero setup:**
1. Go to codesandbox.io
2. Import your GitHub repo
3. Play in 2 minutes

**That's it!** No Python, no Node, no terminal commands needed.

---

## ⏱️ **Time Comparison**

| Method | Setup Time | Complexity |
|--------|-----------|------------|
| **CodeSandbox** | 2 min | ⭐ Easy |
| **quick-test.sh** | 3 min | ⭐⭐ Easy |
| **Manual Local** | 5 min | ⭐⭐⭐ Medium |
| **Render Deploy** | 10 min | ⭐⭐⭐⭐ Advanced |

---

**My Recommendation:** Use **CodeSandbox** for instant testing, then deploy to **Render** for production! 🎮
