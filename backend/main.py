from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Gensyn Valley API")

# CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class PlayerState(BaseModel):
    x: float
    y: float
    name: str
    quest_progress: Dict[str, int] = {}

class QuestInfo(BaseModel):
    id: str
    title: str
    description: str
    npc: str
    completed: bool = False

class DialogLine(BaseModel):
    speaker: str
    text: str

# In-memory storage (for prototype)
game_state = {
    "player": None,
    "quests": [
        {
            "id": "verde_intro",
            "title": "Meet Verde the Validator",
            "description": "Learn about Gensyn's verification system from Verde",
            "npc": "Verde",
            "completed": False
        },
        {
            "id": "first_training",
            "title": "Your First RL Training",
            "description": "Plant your first RL agent seed and start training",
            "npc": "Verde",
            "completed": False
        }
    ]
}

@app.get("/")
async def root():
    return {"message": "Welcome to Gensyn Valley API"}

@app.get("/npcs")
async def get_npcs():
    """Get all NPC data"""
    return [
        {
            "id": "verde",
            "name": "Verde the Validator",
            "x": 400,
            "y": 300,
            "description": "A wise validator who ensures AI models are trained correctly",
            "color": "#00ff00"
        },
        {
            "id": "skip",
            "name": "Skip-Pipe Courier",
            "x": 600,
            "y": 250,
            "description": "Speedy courier optimizing communication in the network",
            "color": "#ffaa00"
        }
    ]

@app.get("/quests")
async def get_quests():
    """Get all available quests"""
    return game_state["quests"]

@app.post("/quests/{quest_id}/complete")
async def complete_quest(quest_id: str):
    """Mark a quest as completed"""
    for quest in game_state["quests"]:
        if quest["id"] == quest_id:
            quest["completed"] = True
            return {"success": True, "quest": quest}
    return {"success": False, "error": "Quest not found"}

@app.get("/dialog/{npc_id}")
async def get_dialog(npc_id: str):
    """Get dialog for an NPC"""
    dialogs = {
        "verde": [
            {
                "speaker": "Verde",
                "text": "Welcome to Gensyn Valley, young trainer! I'm Verde, the Validator."
            },
            {
                "speaker": "Verde",
                "text": "Here, we train AI models using decentralized compute. Each model must be verified to ensure quality!"
            },
            {
                "speaker": "Verde",
                "text": "I use Gensyn's verification protocol to check that AI training is done correctly. Want to learn more?"
            }
        ],
        "skip": [
            {
                "speaker": "Skip-Pipe",
                "text": "Hey there! I'm Skip-Pipe, the fastest courier in the network!"
            },
            {
                "speaker": "Skip-Pipe",
                "text": "I optimize communication between nodes using the Skip-Pipe protocol. Speed is everything!"
            }
        ]
    }
    return dialogs.get(npc_id, [{"speaker": "Unknown", "text": "..."}])

@app.post("/player/save")
async def save_player(player: PlayerState):
    """Save player state"""
    game_state["player"] = player.dict()
    return {"success": True, "player": game_state["player"]}

@app.get("/player")
async def get_player():
    """Get player state"""
    return game_state["player"] or {"x": 100, "y": 100, "name": "Player", "quest_progress": {}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
