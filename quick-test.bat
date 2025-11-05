@echo off
REM Quick Test Script for Windows

echo 🎮 Gensyn Valley - Quick Test Setup
echo ====================================
echo.

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python is not installed. Please install Python first.
    pause
    exit /b 1
)

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Python found
echo ✅ Node.js found
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -q -r requirements.txt
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
if not exist node_modules (
    npm install --silent
)
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting servers...
echo.
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend
cd backend
call venv\Scripts\activate
start /B python main.py
cd ..

REM Wait a bit
timeout /t 2 /nobreak >nul

REM Start frontend
cd frontend
start /B npm start
cd ..

REM Keep window open
pause
