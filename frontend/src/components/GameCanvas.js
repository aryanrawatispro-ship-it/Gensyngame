import React, { useRef, useEffect, useState } from 'react';
import './GameCanvas.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TILE_SIZE = 16;
const SPRITE_SIZE = 16;
const MOVE_SPEED = 2;
const INTERACTION_DISTANCE = 40;

const GameCanvas = ({ gameState, updatePlayer, showDialog, closeDialog, completeQuest }) => {
  const canvasRef = useRef(null);
  const [keys, setKeys] = useState({});
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [playerDirection, setPlayerDirection] = useState('down');
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationRef = useRef();
  const frameCounter = useRef(0);

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

  // Draw pixel art terrain
  const drawTerrain = (ctx) => {
    // Disable image smoothing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;

    const tilesX = Math.ceil(CANVAS_WIDTH / TILE_SIZE);
    const tilesY = Math.ceil(CANVAS_HEIGHT / TILE_SIZE);

    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // Create varied grass tiles
        const variation = (x * 3 + y * 7) % 4;

        // Base grass color
        ctx.fillStyle = '#5a9c4f';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Add texture
        if (variation === 0) {
          ctx.fillStyle = '#6baa5e';
          ctx.fillRect(px + 2, py + 2, 2, 2);
          ctx.fillRect(px + 10, py + 8, 2, 2);
        } else if (variation === 1) {
          ctx.fillStyle = '#4d8a43';
          ctx.fillRect(px + 6, py + 4, 2, 2);
          ctx.fillRect(px + 3, py + 10, 2, 2);
        } else if (variation === 2) {
          ctx.fillStyle = '#6baa5e';
          ctx.fillRect(px + 8, py + 2, 2, 2);
          ctx.fillRect(px + 4, py + 12, 2, 2);
        }

        // Random darker grass spots
        if ((x * y) % 17 === 0) {
          ctx.fillStyle = '#4d8a43';
          ctx.fillRect(px + 7, py + 6, 3, 3);
        }
      }
    }

    // Draw path
    const pathY = Math.floor(CANVAS_HEIGHT / 2) - 24;
    for (let x = 0; x < tilesX; x++) {
      for (let py = 0; py < 3; py++) {
        const px = x * TILE_SIZE;
        const y = pathY + py * TILE_SIZE;

        // Path base
        ctx.fillStyle = '#c4a06c';
        ctx.fillRect(px, y, TILE_SIZE, TILE_SIZE);

        // Path texture
        ctx.fillStyle = '#b39060';
        ctx.fillRect(px + 1, y + 1, 2, 2);
        ctx.fillRect(px + 8, y + 8, 2, 2);
        ctx.fillRect(px + 12, y + 4, 2, 2);

        // Stones on path
        if ((x + py) % 5 === 0) {
          ctx.fillStyle = '#9a7d56';
          ctx.fillRect(px + 6, y + 6, 3, 3);
        }
      }
    }
  };

  // Draw environmental decorations
  const drawEnvironment = (ctx) => {
    // Trees
    const trees = [
      { x: 100, y: 100 },
      { x: 700, y: 120 },
      { x: 150, y: 450 },
      { x: 650, y: 480 },
    ];

    trees.forEach(tree => {
      // Tree shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(tree.x + 4, tree.y + 28, 16, 4);

      // Tree trunk
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(tree.x + 8, tree.y + 16, 8, 16);
      ctx.fillStyle = '#5d3c31';
      ctx.fillRect(tree.x + 10, tree.y + 16, 2, 16);

      // Tree foliage (3 layers)
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(tree.x, tree.y + 8, 24, 12);
      ctx.fillStyle = '#388e3c';
      ctx.fillRect(tree.x + 4, tree.y, 16, 16);
      ctx.fillStyle = '#43a047';
      ctx.fillRect(tree.x + 6, tree.y + 2, 12, 10);

      // Highlights
      ctx.fillStyle = '#66bb6a';
      ctx.fillRect(tree.x + 8, tree.y + 4, 4, 4);
    });

    // Flowers
    const flowers = [
      { x: 200, y: 180, color: '#ff5252' },
      { x: 450, y: 200, color: '#ffeb3b' },
      { x: 580, y: 150, color: '#e91e63' },
      { x: 300, y: 400, color: '#ff5252' },
      { x: 500, y: 450, color: '#ffeb3b' },
    ];

    flowers.forEach(flower => {
      // Stem
      ctx.fillStyle = '#4d8a43';
      ctx.fillRect(flower.x + 3, flower.y + 4, 2, 4);

      // Flower petals (pixel art style)
      ctx.fillStyle = flower.color;
      ctx.fillRect(flower.x + 2, flower.y, 2, 2);
      ctx.fillRect(flower.x + 6, flower.y, 2, 2);
      ctx.fillRect(flower.x, flower.y + 2, 2, 2);
      ctx.fillRect(flower.x + 8, flower.y + 2, 2, 2);
      ctx.fillRect(flower.x + 2, flower.y + 4, 2, 2);
      ctx.fillRect(flower.x + 6, flower.y + 4, 2, 2);

      // Center
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(flower.x + 3, flower.y + 2, 4, 3);
    });

    // Rocks
    const rocks = [
      { x: 250, y: 250 },
      { x: 600, y: 380 },
    ];

    rocks.forEach(rock => {
      ctx.fillStyle = '#78909c';
      ctx.fillRect(rock.x, rock.y + 4, 12, 8);
      ctx.fillRect(rock.x + 2, rock.y, 10, 12);
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(rock.x + 4, rock.y + 2, 4, 4);
      ctx.fillStyle = '#546e7a';
      ctx.fillRect(rock.x + 8, rock.y + 6, 3, 4);
    });
  };

  // Draw pixel art player
  const drawPlayer = (ctx, x, y, direction, frame) => {
    const px = Math.floor(x) - 8;
    const py = Math.floor(y) - 12;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(px + 2, py + 15, 12, 3);

    // Determine animation offset
    const walkOffset = frame % 2 === 0 ? 0 : 1;

    // Player body (16x16 sprite)
    // Skin color
    ctx.fillStyle = '#ffcb9a';

    if (direction === 'down') {
      // Head
      ctx.fillRect(px + 5, py + 2, 6, 6);
      // Body
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 4, py + 8, 8, 6);
      // Arms
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 2, py + 8, 2, 4);
      ctx.fillRect(px + 12, py + 8, 2, 4);
      // Legs
      ctx.fillStyle = '#3d6e8f';
      ctx.fillRect(px + 5, py + 14, 2, 4);
      ctx.fillRect(px + 9, py + 14, 2, 4);

      if (walkOffset === 1) {
        ctx.fillRect(px + 5, py + 14, 2, 5);
        ctx.fillRect(px + 9, py + 13, 2, 4);
      }

      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 6, py + 4, 1, 1);
      ctx.fillRect(px + 9, py + 4, 1, 1);

    } else if (direction === 'up') {
      // Head (back view)
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 5, py + 2, 6, 6);
      // Body
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 4, py + 8, 8, 6);
      // Arms
      ctx.fillRect(px + 2, py + 8, 2, 4);
      ctx.fillRect(px + 12, py + 8, 2, 4);
      // Legs
      ctx.fillStyle = '#3d6e8f';
      ctx.fillRect(px + 5, py + 14, 2, 4);
      ctx.fillRect(px + 9, py + 14, 2, 4);

      if (walkOffset === 1) {
        ctx.fillRect(px + 5, py + 13, 2, 4);
        ctx.fillRect(px + 9, py + 14, 2, 5);
      }

    } else if (direction === 'left') {
      // Head (side view)
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 6, py + 2, 5, 6);
      // Hair
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 6, py + 2, 4, 3);
      // Body
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 5, py + 8, 6, 6);
      // Arm
      ctx.fillRect(px + 4, py + 9, 2, 3);
      // Legs
      ctx.fillStyle = '#3d6e8f';
      ctx.fillRect(px + 6, py + 14, 2, 4);
      ctx.fillRect(px + 8, py + 14, 2, 4);

      if (walkOffset === 1) {
        ctx.fillRect(px + 6, py + 14, 2, 5);
        ctx.fillRect(px + 8, py + 13, 2, 4);
      }

      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 8, py + 4, 1, 1);

    } else if (direction === 'right') {
      // Head (side view)
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 5, py + 2, 5, 6);
      // Hair
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 6, py + 2, 4, 3);
      // Body
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 5, py + 8, 6, 6);
      // Arm
      ctx.fillRect(px + 10, py + 9, 2, 3);
      // Legs
      ctx.fillStyle = '#3d6e8f';
      ctx.fillRect(px + 6, py + 14, 2, 4);
      ctx.fillRect(px + 8, py + 14, 2, 4);

      if (walkOffset === 1) {
        ctx.fillRect(px + 6, py + 13, 2, 4);
        ctx.fillRect(px + 8, py + 14, 2, 5);
      }

      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 7, py + 4, 1, 1);
    }

    // Add pixel art outline effect
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
  };

  // Draw pixel art NPCs
  const drawNPC = (ctx, npc) => {
    const px = Math.floor(npc.x) - 8;
    const py = Math.floor(npc.y) - 12;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(px + 2, py + 15, 12, 3);

    if (npc.id === 'verde') {
      // Verde the Validator (Green themed character)
      // Head
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 5, py + 2, 6, 6);
      // Green robe
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(px + 4, py + 8, 8, 8);
      ctx.fillStyle = '#00cc00';
      ctx.fillRect(px + 5, py + 9, 6, 6);
      // Arms
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(px + 2, py + 9, 2, 5);
      ctx.fillRect(px + 12, py + 9, 2, 5);
      // Hat (validator badge)
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(px + 5, py, 6, 2);
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(px + 7, py + 1, 2, 1);
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 6, py + 4, 1, 1);
      ctx.fillRect(px + 9, py + 4, 1, 1);
      // Smile
      ctx.fillRect(px + 6, py + 6, 4, 1);

    } else if (npc.id === 'skip') {
      // Skip-Pipe Courier (Orange themed character)
      // Head
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 5, py + 2, 6, 6);
      // Orange outfit
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(px + 4, py + 8, 8, 8);
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(px + 5, py + 9, 6, 6);
      // Arms
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(px + 2, py + 9, 2, 5);
      ctx.fillRect(px + 12, py + 9, 2, 5);
      // Goggles
      ctx.fillStyle = '#555';
      ctx.fillRect(px + 5, py + 3, 2, 2);
      ctx.fillRect(px + 9, py + 3, 2, 2);
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(px + 6, py + 4, 1, 1);
      ctx.fillRect(px + 10, py + 4, 1, 1);
      // Headband
      ctx.fillStyle = '#ff5555';
      ctx.fillRect(px + 5, py + 1, 6, 1);
    }

    // Name tag
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.strokeText(npc.name.split(' ')[0], npc.x, py - 2);
    ctx.fillText(npc.name.split(' ')[0], npc.x, py - 2);

    // Interaction prompt
    const distance = Math.sqrt(
      Math.pow(gameState.player.x - npc.x, 2) + Math.pow(gameState.player.y - npc.y, 2)
    );
    if (distance < INTERACTION_DISTANCE) {
      // Pixel art exclamation mark
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(npc.x - 2, py - 16, 4, 8);
      ctx.fillRect(npc.x - 2, py - 6, 4, 3);

      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.font = 'bold 12px monospace';
      ctx.strokeText('[E]', npc.x, py + 32);
      ctx.fillText('[E]', npc.x, py + 32);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let player = { ...gameState.player };
    let isMoving = false;

    const gameLoop = () => {
      // Handle movement
      let moved = false;
      let newDirection = playerDirection;

      if (keys['ArrowUp'] || keys['w']) {
        player.y = Math.max(SPRITE_SIZE, player.y - MOVE_SPEED);
        newDirection = 'up';
        moved = true;
      }
      if (keys['ArrowDown'] || keys['s']) {
        player.y = Math.min(CANVAS_HEIGHT - SPRITE_SIZE, player.y + MOVE_SPEED);
        newDirection = 'down';
        moved = true;
      }
      if (keys['ArrowLeft'] || keys['a']) {
        player.x = Math.max(SPRITE_SIZE, player.x - MOVE_SPEED);
        newDirection = 'left';
        moved = true;
      }
      if (keys['ArrowRight'] || keys['d']) {
        player.x = Math.min(CANVAS_WIDTH - SPRITE_SIZE, player.x + MOVE_SPEED);
        newDirection = 'right';
        moved = true;
      }

      if (moved) {
        updatePlayer({ x: player.x, y: player.y });
        setPlayerDirection(newDirection);
        isMoving = true;

        // Update animation frame
        frameCounter.current++;
        if (frameCounter.current % 8 === 0) {
          setAnimationFrame(prev => (prev + 1) % 2);
        }
      } else {
        isMoving = false;
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

      // Clear and draw
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw terrain
      drawTerrain(ctx);

      // Draw environment
      drawEnvironment(ctx);

      // Collect and sort all entities by Y position for proper layering
      const entities = [
        { type: 'player', y: player.y, draw: () => drawPlayer(ctx, player.x, player.y, playerDirection, isMoving ? animationFrame : 0) },
        ...gameState.npcs.map(npc => ({
          type: 'npc',
          y: npc.y,
          draw: () => drawNPC(ctx, npc)
        }))
      ];

      entities.sort((a, b) => a.y - b.y);
      entities.forEach(entity => entity.draw());

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [keys, gameState, updatePlayer, showDialog, playerDirection, animationFrame]);

  const handleDialogNext = () => {
    if (gameState.activeDialog && currentDialogIndex < gameState.activeDialog.length - 1) {
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
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
        className="game-canvas pixel-art"
      />

      {gameState.activeDialog && (
        <div className="dialog-box pixel-border" onClick={handleDialogNext}>
          <div className="dialog-speaker pixel-text">
            {gameState.activeDialog[currentDialogIndex].speaker}
          </div>
          <div className="dialog-text pixel-text">
            {gameState.activeDialog[currentDialogIndex].text}
          </div>
          <div className="dialog-prompt pixel-text">
            {currentDialogIndex < gameState.activeDialog.length - 1
              ? '▼ Click to continue...'
              : '✕ Click to close'}
          </div>
        </div>
      )}

      <div className="controls-hint pixel-border">
        <div className="pixel-text">WASD / ↑↓←→ - Move</div>
        <div className="pixel-text">E - Interact</div>
      </div>
    </div>
  );
};

export default GameCanvas;
