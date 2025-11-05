import React, { useRef, useEffect, useState } from 'react';
import './GameCanvas.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 20;
const NPC_SIZE = 25;
const MOVE_SPEED = 3;
const INTERACTION_DISTANCE = 50;

const GameCanvas = ({ gameState, updatePlayer, showDialog, closeDialog, completeQuest }) => {
  const canvasRef = useRef(null);
  const [keys, setKeys] = useState({});
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let player = { ...gameState.player };

    const gameLoop = () => {
      // Handle movement
      let moved = false;
      if (keys['ArrowUp'] || keys['w']) {
        player.y = Math.max(PLAYER_SIZE, player.y - MOVE_SPEED);
        moved = true;
      }
      if (keys['ArrowDown'] || keys['s']) {
        player.y = Math.min(CANVAS_HEIGHT - PLAYER_SIZE, player.y + MOVE_SPEED);
        moved = true;
      }
      if (keys['ArrowLeft'] || keys['a']) {
        player.x = Math.max(PLAYER_SIZE, player.x - MOVE_SPEED);
        moved = true;
      }
      if (keys['ArrowRight'] || keys['d']) {
        player.x = Math.min(CANVAS_WIDTH - PLAYER_SIZE, player.x + MOVE_SPEED);
        moved = true;
      }

      if (moved) {
        updatePlayer({ x: player.x, y: player.y });
      }

      // Check for NPC interactions
      if (keys['e'] || keys['E']) {
        gameState.npcs.forEach(npc => {
          const distance = Math.sqrt(
            Math.pow(player.x - npc.x, 2) + Math.pow(player.y - npc.y, 2)
          );
          if (distance < INTERACTION_DISTANCE && !gameState.activeDialog) {
            showDialog(npc.id);
          }
        });
      }

      // Clear canvas
      ctx.fillStyle = '#2d5016';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw grass pattern
      ctx.fillStyle = '#3d6e1f';
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
          ctx.fillRect(x, y, 20, 20);
        }
      }

      // Draw NPCs
      gameState.npcs.forEach(npc => {
        // NPC shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(npc.x, npc.y + NPC_SIZE + 5, NPC_SIZE * 0.8, NPC_SIZE * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // NPC body
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.arc(npc.x, npc.y, NPC_SIZE, 0, Math.PI * 2);
        ctx.fill();

        // NPC outline
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // NPC name
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(npc.name.split(' ')[0], npc.x, npc.y - NPC_SIZE - 5);

        // Interaction prompt
        const distance = Math.sqrt(
          Math.pow(player.x - npc.x, 2) + Math.pow(player.y - npc.y, 2)
        );
        if (distance < INTERACTION_DISTANCE) {
          ctx.fillStyle = '#ffeb3b';
          ctx.font = 'bold 14px monospace';
          ctx.fillText('[E] Talk', npc.x, npc.y + NPC_SIZE + 20);
        }
      });

      // Draw player shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(player.x, player.y + PLAYER_SIZE + 3, PLAYER_SIZE * 0.8, PLAYER_SIZE * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw player
      ctx.fillStyle = '#4da6ff';
      ctx.beginPath();
      ctx.arc(player.x, player.y, PLAYER_SIZE, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Player eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(player.x - 7, player.y - 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(player.x + 7, player.y - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(player.x - 7, player.y - 5, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(player.x + 7, player.y - 5, 2, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [keys, gameState, updatePlayer, showDialog]);

  const handleDialogNext = () => {
    if (gameState.activeDialog && currentDialogIndex < gameState.activeDialog.length - 1) {
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
      // Dialog finished, complete the first quest if it exists
      if (gameState.quests.length > 0 && !gameState.quests[0].completed) {
        completeQuest(gameState.quests[0].id);
      }
      setCurrentDialogIndex(0);
      closeDialog();
    }
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />

      {gameState.activeDialog && (
        <div className="dialog-box" onClick={handleDialogNext}>
          <div className="dialog-speaker">
            {gameState.activeDialog[currentDialogIndex].speaker}
          </div>
          <div className="dialog-text">
            {gameState.activeDialog[currentDialogIndex].text}
          </div>
          <div className="dialog-prompt">
            {currentDialogIndex < gameState.activeDialog.length - 1
              ? 'Click to continue...'
              : 'Click to close'}
          </div>
        </div>
      )}

      <div className="controls-hint">
        <div>Use WASD or Arrow Keys to move</div>
        <div>Press E near NPCs to talk</div>
      </div>
    </div>
  );
};

export default GameCanvas;
