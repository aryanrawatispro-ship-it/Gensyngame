import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import QuestLog from './components/QuestLog';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [gameState, setGameState] = useState({
    player: { x: 100, y: 100, name: 'Player' },
    npcs: [],
    quests: [],
    activeDialog: null,
  });

  useEffect(() => {
    // Load initial game data
    fetchNPCs();
    fetchQuests();
  }, []);

  const fetchNPCs = async () => {
    try {
      const response = await fetch(`${API_URL}/npcs`);
      const npcs = await response.json();
      setGameState(prev => ({ ...prev, npcs }));
    } catch (error) {
      console.error('Failed to fetch NPCs:', error);
    }
  };

  const fetchQuests = async () => {
    try {
      const response = await fetch(`${API_URL}/quests`);
      const quests = await response.json();
      setGameState(prev => ({ ...prev, quests }));
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    }
  };

  const updatePlayer = (newPosition) => {
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, ...newPosition }
    }));
  };

  const showDialog = async (npcId) => {
    try {
      const response = await fetch(`${API_URL}/dialog/${npcId}`);
      const dialog = await response.json();
      setGameState(prev => ({ ...prev, activeDialog: dialog }));
    } catch (error) {
      console.error('Failed to fetch dialog:', error);
    }
  };

  const closeDialog = () => {
    setGameState(prev => ({ ...prev, activeDialog: null }));
  };

  const completeQuest = async (questId) => {
    try {
      await fetch(`${API_URL}/quests/${questId}/complete`, { method: 'POST' });
      fetchQuests();
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  return (
    <div className="App">
      <div className="game-wrapper">
        <GameCanvas
          gameState={gameState}
          updatePlayer={updatePlayer}
          showDialog={showDialog}
          closeDialog={closeDialog}
          completeQuest={completeQuest}
        />
        <QuestLog quests={gameState.quests} />
      </div>
    </div>
  );
}

export default App;
