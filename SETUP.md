# Gensyn Valley - Setup Guide

A playable prototype of the Gensyn Valley educational game! This guide will help you get the game running on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/)
- **pip** - Python package manager (usually comes with Python)

## Project Structure

```
Gensyngame/
├── backend/          # FastAPI backend server
│   ├── main.py       # Main API application
│   └── requirements.txt
├── frontend/         # React frontend game
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameCanvas.js    # Main game rendering
│   │   │   └── QuestLog.js      # Quest tracking UI
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## Installation Steps

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory (open a new terminal)
cd frontend

# Install dependencies
npm install
```

## Running the Game

You'll need to run both the backend and frontend simultaneously.

### Terminal 1 - Start the Backend Server

```bash
cd backend

# Activate virtual environment if not already active
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Run the server
python main.py
```

The API will start at `http://localhost:8000`

You can test it by visiting: `http://localhost:8000/docs` for the API documentation

### Terminal 2 - Start the Frontend

```bash
cd frontend

# Start the development server
npm start
```

The game will open automatically in your browser at `http://localhost:3000`

If it doesn't open automatically, manually navigate to `http://localhost:3000`

## How to Play

### Controls
- **Movement**: Use `WASD` or `Arrow Keys` to move your character
- **Interaction**: Press `E` when near an NPC to talk to them

### Game Features

1. **Explore the Valley**: Move around the grassy landscape
2. **Meet NPCs**:
   - **Verde the Validator** (Green) - Teaches about Gensyn's verification system
   - **Skip-Pipe Courier** (Orange) - Explains the Skip-Pipe protocol
3. **Complete Quests**: Talk to NPCs to start educational quests
4. **Quest Log**: Track your progress in the quest log on the right side

### Current NPCs and Dialog

- **Verde the Validator** (Green circle):
  - Located at position (400, 300)
  - Explains Gensyn's verification protocol
  - Introduces the concept of decentralized AI training

- **Skip-Pipe Courier** (Orange circle):
  - Located at position (600, 250)
  - Teaches about network optimization
  - Explains the Skip-Pipe protocol

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Make sure you've activated the virtual environment and run `pip install -r requirements.txt`

**Problem**: Port 8000 already in use
- **Solution**: Either close the application using that port, or modify `main.py` to use a different port

### Frontend Issues

**Problem**: `npm install` fails
- **Solution**: Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

**Problem**: Cannot connect to backend
- **Solution**: Make sure the backend is running at `http://localhost:8000`

**Problem**: CORS errors
- **Solution**: The backend is configured to allow requests from `http://localhost:3000`. If you're running on a different port, update the CORS settings in `backend/main.py`

## Development Mode

The prototype is set up for easy development:

- **Frontend**: Hot-reload is enabled - changes to React components will automatically refresh
- **Backend**: Restart the server after making changes to `main.py`

## Next Steps

This is a minimal prototype. Future enhancements could include:

- More NPCs (Judge, RL Agent, etc.)
- Interactive farming system
- More complex quest chains
- Save/load game state
- Animations and sound effects
- Multiplayer features
- Real integration with Gensyn documentation

## Support

If you encounter any issues:

1. Check that both servers are running
2. Check the browser console for errors (F12)
3. Check the backend terminal for API errors
4. Ensure you're using compatible versions of Node.js and Python

## License

MIT License - See LICENSE file for details

---

**Have fun exploring Gensyn Valley and learning about decentralized AI!**
