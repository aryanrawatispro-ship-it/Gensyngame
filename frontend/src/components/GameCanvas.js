import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  const lastInteractionTime = useRef(0);

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

  // Draw enhanced pixel art terrain
  const drawTerrain = useCallback((ctx) => {
    ctx.imageSmoothingEnabled = false;

    const tilesX = Math.ceil(CANVAS_WIDTH / TILE_SIZE);
    const tilesY = Math.ceil(CANVAS_HEIGHT / TILE_SIZE);

    // Draw grass with more variety
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        const variation = (x * 3 + y * 7) % 8;

        // Base grass - multiple shades
        const grassShades = ['#5a9c4f', '#549446', '#5f9f52', '#5aa050'];
        ctx.fillStyle = grassShades[variation % 4];
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Add detailed grass texture
        ctx.fillStyle = variation % 2 === 0 ? '#6baa5e' : '#4d8a43';

        // Grass blades (more detail)
        if (variation < 3) {
          ctx.fillRect(px + 2, py + 2, 1, 2);
          ctx.fillRect(px + 10, py + 8, 1, 2);
          ctx.fillRect(px + 6, py + 12, 1, 2);
        } else if (variation < 5) {
          ctx.fillRect(px + 4, py + 3, 1, 3);
          ctx.fillRect(px + 11, py + 6, 1, 2);
          ctx.fillRect(px + 8, py + 10, 1, 2);
        } else {
          ctx.fillRect(px + 3, py + 5, 1, 2);
          ctx.fillRect(px + 9, py + 9, 1, 3);
          ctx.fillRect(px + 13, py + 4, 1, 2);
        }

        // Random darker spots and highlights
        if ((x * y) % 17 === 0) {
          ctx.fillStyle = '#4d8a43';
          ctx.fillRect(px + 7, py + 6, 2, 2);
        }
        if ((x + y) % 19 === 0) {
          ctx.fillStyle = '#6baa5e';
          ctx.fillRect(px + 12, py + 3, 2, 2);
        }
      }
    }

    // Enhanced dirt path
    const pathY = Math.floor(CANVAS_HEIGHT / 2) - 24;
    for (let x = 0; x < tilesX; x++) {
      for (let py = 0; py < 3; py++) {
        const px = x * TILE_SIZE;
        const y = pathY + py * TILE_SIZE;

        // Path base with variation
        ctx.fillStyle = py === 1 ? '#c4a06c' : '#b89860';
        ctx.fillRect(px, y, TILE_SIZE, TILE_SIZE);

        // Detailed path texture
        ctx.fillStyle = '#b39060';
        ctx.fillRect(px + 1, y + 1, 2, 1);
        ctx.fillRect(px + 8, y + 8, 2, 2);
        ctx.fillRect(px + 12, y + 4, 2, 1);
        ctx.fillRect(px + 4, y + 11, 3, 1);

        // Pebbles and stones
        if ((x + py) % 5 === 0) {
          ctx.fillStyle = '#9a7d56';
          ctx.fillRect(px + 6, y + 6, 2, 2);
        }
        if ((x + py) % 7 === 0) {
          ctx.fillStyle = '#8a6d46';
          ctx.fillRect(px + 10, y + 9, 1, 1);
        }

        // Path edges (darker)
        if (py === 0 || py === 2) {
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.fillRect(px, y, TILE_SIZE, 1);
        }
      }
    }
  }, []);

  // Draw enhanced environment with more objects
  const drawEnvironment = useCallback((ctx) => {
    // Detailed trees
    const trees = [
      { x: 100, y: 100 },
      { x: 700, y: 120 },
      { x: 150, y: 450 },
      { x: 650, y: 480 },
    ];

    trees.forEach(tree => {
      // Shadow (larger and more realistic)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(tree.x + 3, tree.y + 30, 18, 5);

      // Tree trunk with detail
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(tree.x + 8, tree.y + 18, 8, 16);

      // Trunk shading
      ctx.fillStyle = '#5d3c31';
      ctx.fillRect(tree.x + 10, tree.y + 18, 2, 16);
      ctx.fillStyle = '#7d5c51';
      ctx.fillRect(tree.x + 8, tree.y + 18, 1, 16);

      // Trunk highlights
      ctx.fillStyle = '#8d6c61';
      ctx.fillRect(tree.x + 9, tree.y + 20, 1, 3);

      // Tree foliage - multiple layers for depth
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(tree.x, tree.y + 10, 24, 14);

      ctx.fillStyle = '#388e3c';
      ctx.fillRect(tree.x + 2, tree.y + 4, 20, 16);

      ctx.fillStyle = '#43a047';
      ctx.fillRect(tree.x + 4, tree.y, 16, 14);

      ctx.fillStyle = '#4caf50';
      ctx.fillRect(tree.x + 6, tree.y + 2, 12, 10);

      // Highlights for volume
      ctx.fillStyle = '#66bb6a';
      ctx.fillRect(tree.x + 8, tree.y + 4, 3, 3);
      ctx.fillRect(tree.x + 13, tree.y + 6, 2, 2);

      // Dark spots for depth
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(tree.x + 5, tree.y + 8, 2, 2);
      ctx.fillRect(tree.x + 16, tree.y + 10, 2, 2);
    });

    // Enhanced flowers with more detail
    const flowers = [
      { x: 200, y: 180, color: '#ff5252', type: 'rose' },
      { x: 450, y: 200, color: '#ffeb3b', type: 'daisy' },
      { x: 580, y: 150, color: '#e91e63', type: 'tulip' },
      { x: 300, y: 400, color: '#ff5252', type: 'rose' },
      { x: 500, y: 450, color: '#ffeb3b', type: 'daisy' },
      { x: 220, y: 380, color: '#9c27b0', type: 'tulip' },
      { x: 380, y: 160, color: '#ff6f00', type: 'daisy' },
    ];

    flowers.forEach(flower => {
      // Stem with detail
      ctx.fillStyle = '#4d8a43';
      ctx.fillRect(flower.x + 3, flower.y + 5, 2, 5);
      ctx.fillStyle = '#3d7a33';
      ctx.fillRect(flower.x + 4, flower.y + 5, 1, 5);

      // Flower head based on type
      if (flower.type === 'rose') {
        // Rose petals (layered)
        ctx.fillStyle = flower.color;
        ctx.fillRect(flower.x + 1, flower.y, 2, 2);
        ctx.fillRect(flower.x + 5, flower.y, 2, 2);
        ctx.fillRect(flower.x, flower.y + 1, 2, 2);
        ctx.fillRect(flower.x + 6, flower.y + 1, 2, 2);
        ctx.fillRect(flower.x + 1, flower.y + 4, 2, 2);
        ctx.fillRect(flower.x + 5, flower.y + 4, 2, 2);
        ctx.fillRect(flower.x + 2, flower.y + 1, 4, 4);

        // Center
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(flower.x + 3, flower.y + 2, 2, 2);
      } else {
        // Daisy/tulip petals
        ctx.fillStyle = flower.color;
        ctx.fillRect(flower.x + 2, flower.y, 2, 2);
        ctx.fillRect(flower.x + 4, flower.y, 2, 2);
        ctx.fillRect(flower.x, flower.y + 2, 2, 2);
        ctx.fillRect(flower.x + 6, flower.y + 2, 2, 2);
        ctx.fillRect(flower.x + 2, flower.y + 4, 2, 2);
        ctx.fillRect(flower.x + 4, flower.y + 4, 2, 2);

        // Center
        ctx.fillStyle = flower.type === 'tulip' ? '#000' : '#ffeb3b';
        ctx.fillRect(flower.x + 3, flower.y + 2, 2, 2);
      }
    });

    // Bushes (NEW!)
    const bushes = [
      { x: 180, y: 120 },
      { x: 620, y: 160 },
      { x: 140, y: 520 },
    ];

    bushes.forEach(bush => {
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(bush.x + 2, bush.y + 14, 12, 3);

      // Bush body
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(bush.x, bush.y + 6, 16, 10);
      ctx.fillStyle = '#388e3c';
      ctx.fillRect(bush.x + 2, bush.y + 2, 12, 12);
      ctx.fillStyle = '#43a047';
      ctx.fillRect(bush.x + 4, bush.y + 4, 8, 8);

      // Highlights
      ctx.fillStyle = '#66bb6a';
      ctx.fillRect(bush.x + 6, bush.y + 6, 3, 3);
    });

    // Rocks with better detail
    const rocks = [
      { x: 250, y: 250 },
      { x: 600, y: 380 },
      { x: 340, y: 480 },
    ];

    rocks.forEach(rock => {
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(rock.x + 1, rock.y + 10, 12, 3);

      // Rock body with multiple layers
      ctx.fillStyle = '#78909c';
      ctx.fillRect(rock.x + 1, rock.y + 5, 10, 7);
      ctx.fillRect(rock.x, rock.y + 2, 12, 10);

      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(rock.x + 2, rock.y, 8, 10);
      ctx.fillRect(rock.x + 3, rock.y + 2, 6, 6);

      // Highlights
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(rock.x + 4, rock.y + 3, 3, 2);

      // Dark cracks
      ctx.fillStyle = '#546e7a';
      ctx.fillRect(rock.x + 6, rock.y + 5, 1, 3);
      ctx.fillRect(rock.x + 8, rock.y + 7, 1, 2);
    });

    // Fence posts (NEW!)
    const fences = [
      { x: 90, y: 200 },
      { x: 710, y: 220 },
    ];

    fences.forEach(fence => {
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(fence.x + 1, fence.y + 18, 12, 2);

      // Fence post
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(fence.x + 6, fence.y, 4, 20);
      ctx.fillStyle = '#795548';
      ctx.fillRect(fence.x + 7, fence.y, 2, 20);

      // Horizontal bars
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(fence.x, fence.y + 6, 16, 2);
      ctx.fillRect(fence.x, fence.y + 12, 16, 2);

      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(fence.x, fence.y + 7, 16, 1);
      ctx.fillRect(fence.x, fence.y + 13, 16, 1);
    });
  }, []);

  // Enhanced player with 4-frame animation and more detail
  const drawPlayer = useCallback((ctx, x, y, direction, frame) => {
    const px = Math.floor(x) - 10;
    const py = Math.floor(y) - 14;

    // Better shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, py + 18, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4-frame animation cycle
    const animFrame = frame % 4;

    if (direction === 'down') {
      // Head with more detail
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 7, py + 3, 6, 7);

      // Hair
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 7, py + 2, 6, 3);
      ctx.fillRect(px + 6, py + 3, 1, 2);
      ctx.fillRect(px + 13, py + 3, 1, 2);

      // Hair highlights
      ctx.fillStyle = '#9b7f57';
      ctx.fillRect(px + 8, py + 2, 2, 1);

      // Body (shirt)
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 6, py + 10, 8, 6);
      ctx.fillStyle = '#3d96ef';
      ctx.fillRect(px + 7, py + 10, 6, 6);

      // Collar
      ctx.fillStyle = '#2d86df';
      ctx.fillRect(px + 8, py + 10, 4, 1);

      // Arms with animation
      ctx.fillStyle = '#ffcb9a';
      if (animFrame === 0 || animFrame === 2) {
        ctx.fillRect(px + 4, py + 10, 2, 5);
        ctx.fillRect(px + 14, py + 10, 2, 5);
      } else if (animFrame === 1) {
        ctx.fillRect(px + 4, py + 11, 2, 4);
        ctx.fillRect(px + 14, py + 9, 2, 6);
      } else {
        ctx.fillRect(px + 4, py + 9, 2, 6);
        ctx.fillRect(px + 14, py + 11, 2, 4);
      }

      // Sleeves
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 4, py + 10, 2, 2);
      ctx.fillRect(px + 14, py + 10, 2, 2);

      // Pants
      ctx.fillStyle = '#3d6e8f';
      ctx.fillRect(px + 7, py + 16, 2, 5);
      ctx.fillRect(px + 11, py + 16, 2, 5);

      // Legs animation (4 frames)
      if (animFrame === 0) {
        ctx.fillRect(px + 7, py + 16, 2, 5);
        ctx.fillRect(px + 11, py + 16, 2, 5);
      } else if (animFrame === 1) {
        ctx.fillRect(px + 7, py + 16, 2, 6);
        ctx.fillRect(px + 11, py + 15, 2, 5);
      } else if (animFrame === 2) {
        ctx.fillRect(px + 7, py + 16, 2, 5);
        ctx.fillRect(px + 11, py + 16, 2, 5);
      } else {
        ctx.fillRect(px + 7, py + 15, 2, 5);
        ctx.fillRect(px + 11, py + 16, 2, 6);
      }

      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 8, py + 6, 1, 1);
      ctx.fillRect(px + 11, py + 6, 1, 1);

      // Eye highlights
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 8, py + 6, 1, 1);
      ctx.fillRect(px + 11, py + 6, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 8, py + 6, 1, 1);
      ctx.fillRect(px + 11, py + 6, 1, 1);

      // Mouth
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 9, py + 8, 2, 1);

    } else if (direction === 'up') {
      // Back of head
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 7, py + 2, 6, 8);
      ctx.fillStyle = '#7b5f37';
      ctx.fillRect(px + 8, py + 3, 4, 6);

      // Body
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 6, py + 10, 8, 6);
      ctx.fillStyle = '#3d96ef';
      ctx.fillRect(px + 7, py + 10, 6, 6);

      // Arms with animation
      ctx.fillStyle = '#4da6ff';
      if (animFrame === 0 || animFrame === 2) {
        ctx.fillRect(px + 4, py + 10, 2, 5);
        ctx.fillRect(px + 14, py + 10, 2, 5);
      } else if (animFrame === 1) {
        ctx.fillRect(px + 4, py + 9, 2, 6);
        ctx.fillRect(px + 14, py + 11, 2, 4);
      } else {
        ctx.fillRect(px + 4, py + 11, 2, 4);
        ctx.fillRect(px + 14, py + 9, 2, 6);
      }

      // Pants
      ctx.fillStyle = '#3d6e8f';
      if (animFrame === 0 || animFrame === 2) {
        ctx.fillRect(px + 7, py + 16, 2, 5);
        ctx.fillRect(px + 11, py + 16, 2, 5);
      } else if (animFrame === 1) {
        ctx.fillRect(px + 7, py + 15, 2, 5);
        ctx.fillRect(px + 11, py + 16, 2, 6);
      } else {
        ctx.fillRect(px + 7, py + 16, 2, 6);
        ctx.fillRect(px + 11, py + 15, 2, 5);
      }

    } else if (direction === 'left') {
      // Side view head
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 8, py + 3, 5, 7);

      // Hair (side)
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 8, py + 2, 5, 4);
      ctx.fillRect(px + 7, py + 3, 1, 3);
      ctx.fillStyle = '#9b7f57';
      ctx.fillRect(px + 9, py + 2, 2, 1);

      // Body
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 7, py + 10, 7, 6);
      ctx.fillStyle = '#3d96ef';
      ctx.fillRect(px + 8, py + 10, 5, 6);

      // Arm (visible side)
      ctx.fillStyle = '#ffcb9a';
      if (animFrame === 0 || animFrame === 2) {
        ctx.fillRect(px + 6, py + 11, 2, 4);
      } else if (animFrame === 1) {
        ctx.fillRect(px + 6, py + 10, 2, 5);
      } else {
        ctx.fillRect(px + 6, py + 12, 2, 3);
      }

      // Pants
      ctx.fillStyle = '#3d6e8f';
      if (animFrame === 0 || animFrame === 2) {
        ctx.fillRect(px + 8, py + 16, 2, 5);
        ctx.fillRect(px + 10, py + 16, 2, 5);
      } else if (animFrame === 1) {
        ctx.fillRect(px + 8, py + 16, 2, 6);
        ctx.fillRect(px + 10, py + 15, 2, 5);
      } else {
        ctx.fillRect(px + 8, py + 15, 2, 5);
        ctx.fillRect(px + 10, py + 16, 2, 6);
      }

      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 10, py + 6, 1, 1);

    } else if (direction === 'right') {
      // Side view head
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 7, py + 3, 5, 7);

      // Hair (side)
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 7, py + 2, 5, 4);
      ctx.fillRect(px + 12, py + 3, 1, 3);
      ctx.fillStyle = '#9b7f57';
      ctx.fillRect(px + 9, py + 2, 2, 1);

      // Body
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(px + 6, py + 10, 7, 6);
      ctx.fillStyle = '#3d96ef';
      ctx.fillRect(px + 7, py + 10, 5, 6);

      // Arm (visible side)
      ctx.fillStyle = '#ffcb9a';
      if (animFrame === 0 || animFrame === 2) {
        ctx.fillRect(px + 12, py + 11, 2, 4);
      } else if (animFrame === 1) {
        ctx.fillRect(px + 12, py + 10, 2, 5);
      } else {
        ctx.fillRect(px + 12, py + 12, 2, 3);
      }

      // Pants
      ctx.fillStyle = '#3d6e8f';
      if (animFrame === 0 || animFrame === 2) {
        ctx.fillRect(px + 8, py + 16, 2, 5);
        ctx.fillRect(px + 10, py + 16, 2, 5);
      } else if (animFrame === 1) {
        ctx.fillRect(px + 8, py + 15, 2, 5);
        ctx.fillRect(px + 10, py + 16, 2, 6);
      } else {
        ctx.fillRect(px + 8, py + 16, 2, 6);
        ctx.fillRect(px + 10, py + 15, 2, 5);
      }

      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 9, py + 6, 1, 1);
    }
  }, []);

  // Enhanced NPCs with more personality
  const drawNPC = useCallback((ctx, npc, playerX, playerY) => {
    const px = Math.floor(npc.x) - 10;
    const py = Math.floor(npc.y) - 14;

    // Better shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(npc.x, py + 18, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    if (npc.id === 'verde') {
      // Verde the Validator - Enhanced
      // Head
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 7, py + 3, 6, 7);

      // Beard
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(px + 7, py + 8, 6, 3);
      ctx.fillRect(px + 8, py + 10, 4, 1);

      // Hair/Hat
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(px + 6, py + 1, 8, 3);
      ctx.fillRect(px + 7, py, 6, 2);
      // Hat badge
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(px + 9, py + 2, 2, 1);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(px + 9, py + 1, 2, 1);

      // Green robe with detail
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(px + 5, py + 10, 10, 8);
      ctx.fillStyle = '#00cc00';
      ctx.fillRect(px + 6, py + 11, 8, 7);
      ctx.fillStyle = '#00dd00';
      ctx.fillRect(px + 7, py + 12, 6, 5);

      // Robe trim
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(px + 6, py + 10, 8, 1);
      ctx.fillRect(px + 9, py + 14, 2, 3);

      // Arms
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(px + 3, py + 11, 2, 6);
      ctx.fillRect(px + 15, py + 11, 2, 6);

      // Hands
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 3, py + 15, 2, 2);
      ctx.fillRect(px + 15, py + 15, 2, 2);

      // Staff (validator tool)
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 2, py + 8, 1, 10);
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(px + 1, py + 7, 2, 2);

      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 8, py + 6, 1, 1);
      ctx.fillRect(px + 11, py + 6, 1, 1);

      // Smile
      ctx.fillRect(px + 9, py + 8, 2, 1);

    } else if (npc.id === 'skip') {
      // Skip-Pipe Courier - Enhanced
      // Head
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 7, py + 3, 6, 7);

      // Headband
      ctx.fillStyle = '#ff5555';
      ctx.fillRect(px + 6, py + 2, 8, 2);

      // Goggles
      ctx.fillStyle = '#555';
      ctx.fillRect(px + 7, py + 4, 3, 3);
      ctx.fillRect(px + 10, py + 4, 3, 3);
      // Lenses
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(px + 8, py + 5, 1, 1);
      ctx.fillRect(px + 11, py + 5, 1, 1);
      // Lens reflection
      ctx.fillStyle = '#80ffff';
      ctx.fillRect(px + 8, py + 5, 1, 1);
      ctx.fillRect(px + 11, py + 5, 1, 1);

      // Orange outfit
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(px + 5, py + 10, 10, 8);
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(px + 6, py + 11, 8, 7);

      // Vest detail
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(px + 9, py + 11, 2, 6);

      // Courier badge
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 8, py + 12, 1, 1);
      ctx.fillRect(px + 11, py + 12, 1, 1);

      // Arms
      ctx.fillStyle = '#ffcb9a';
      ctx.fillRect(px + 3, py + 11, 2, 5);
      ctx.fillRect(px + 15, py + 11, 2, 5);

      // Gloves
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(px + 3, py + 14, 2, 2);
      ctx.fillRect(px + 15, py + 14, 2, 2);

      // Holding package
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px + 16, py + 12, 3, 3);
      ctx.fillStyle = '#a07f57';
      ctx.fillRect(px + 17, py + 13, 1, 1);
    }

    // Name tag with better styling
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.strokeText(npc.name.split(' ')[0], npc.x, py - 4);
    ctx.fillText(npc.name.split(' ')[0], npc.x, py - 4);

    // Interaction prompt
    const distance = Math.sqrt(
      Math.pow(playerX - npc.x, 2) + Math.pow(playerY - npc.y, 2)
    );
    if (distance < INTERACTION_DISTANCE) {
      // Animated exclamation mark
      const bounce = Math.sin(Date.now() / 200) * 2;
      ctx.fillStyle = '#ffeb3b';
      ctx.fillRect(npc.x - 2, py - 20 + bounce, 4, 9);
      ctx.fillRect(npc.x - 2, py - 9 + bounce, 4, 3);

      // Glow effect
      ctx.fillStyle = 'rgba(255, 235, 59, 0.3)';
      ctx.fillRect(npc.x - 3, py - 21 + bounce, 6, 11);

      // [E] prompt with background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(npc.x - 10, py + 26, 20, 10);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.font = 'bold 12px monospace';
      ctx.strokeText('[E]', npc.x, py + 34);
      ctx.fillText('[E]', npc.x, py + 34);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let player = { ...gameState.player };
    let currentDirection = playerDirection;
    let currentFrame = animationFrame;
    let isMoving = false;

    const gameLoop = () => {
      // Handle movement
      let moved = false;
      let newDirection = currentDirection;

      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.y = Math.max(SPRITE_SIZE, player.y - MOVE_SPEED);
        newDirection = 'up';
        moved = true;
      }
      if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.y = Math.min(CANVAS_HEIGHT - SPRITE_SIZE, player.y + MOVE_SPEED);
        newDirection = 'down';
        moved = true;
      }
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.x = Math.max(SPRITE_SIZE, player.x - MOVE_SPEED);
        newDirection = 'left';
        moved = true;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.x = Math.min(CANVAS_WIDTH - SPRITE_SIZE, player.x + MOVE_SPEED);
        newDirection = 'right';
        moved = true;
      }

      if (moved) {
        updatePlayer({ x: player.x, y: player.y });

        if (newDirection !== currentDirection) {
          currentDirection = newDirection;
          setPlayerDirection(newDirection);
        }

        isMoving = true;

        // Update animation frame (now 4 frames)
        frameCounter.current++;
        if (frameCounter.current % 6 === 0) {
          currentFrame = (currentFrame + 1) % 4;
          setAnimationFrame(currentFrame);
        }
      } else {
        isMoving = false;
      }

      // Check for NPC interactions with debouncing
      if (keys['e'] || keys['E']) {
        const now = Date.now();
        if (now - lastInteractionTime.current > 500) {
          gameState.npcs.forEach(npc => {
            const distance = Math.sqrt(
              Math.pow(player.x - npc.x, 2) + Math.pow(player.y - npc.y, 2)
            );
            if (distance < INTERACTION_DISTANCE && !gameState.activeDialog) {
              lastInteractionTime.current = now;
              showDialog(npc.id);
            }
          });
        }
      }

      // Clear and draw
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw terrain
      drawTerrain(ctx);

      // Draw environment
      drawEnvironment(ctx);

      // Collect and sort all entities by Y position for proper layering
      const entities = [
        { type: 'player', y: player.y, draw: () => drawPlayer(ctx, player.x, player.y, currentDirection, isMoving ? currentFrame : 0) },
        ...gameState.npcs.map(npc => ({
          type: 'npc',
          y: npc.y,
          draw: () => drawNPC(ctx, npc, player.x, player.y)
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
  }, [keys, gameState, updatePlayer, showDialog, drawTerrain, drawEnvironment, drawPlayer, drawNPC, playerDirection, animationFrame]);

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
