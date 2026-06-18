import Phaser from 'phaser';
import { MAP_WIDTH, MAP_HEIGHT, MAP_CENTER_X, MAP_CENTER_Y, ISLAND_RADIUS, COLORS } from 'coconutclash-shared';

export class MapRenderer {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    // Ensure map is rendered below everything else
    this.graphics.setDepth(-10);
    this.render();
  }

  public render() {
    this.graphics.clear();

    // 1. Base deep water background
    this.graphics.fillStyle(COLORS.waterDeep, 1);
    this.graphics.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Draw foam/shallow water (slightly larger than island)
    this.graphics.fillStyle(COLORS.water, 1);
    this.graphics.fillCircle(MAP_CENTER_X, MAP_CENTER_Y, ISLAND_RADIUS + 50);

    // Draw the island (sand)
    this.graphics.fillStyle(COLORS.sand, 1);
    this.graphics.fillCircle(MAP_CENTER_X, MAP_CENTER_Y, ISLAND_RADIUS);

    // Draw grass patches
    // To make it organic but stable, we use a seeded-like approach (Math.sin) based on coordinates
    this.graphics.fillStyle(0x8B9A46, 0.6); // Muted green
    for (let x = MAP_CENTER_X - ISLAND_RADIUS; x < MAP_CENTER_X + ISLAND_RADIUS; x += 300) {
      for (let y = MAP_CENTER_Y - ISLAND_RADIUS; y < MAP_CENTER_Y + ISLAND_RADIUS; y += 300) {
        if (Math.pow(x - MAP_CENTER_X, 2) + Math.pow(y - MAP_CENTER_Y, 2) < Math.pow(ISLAND_RADIUS - 100, 2)) {
          // Stable random
          const r = Math.abs(Math.sin(x * y)) * 100;
          if (r > 30) {
            this.graphics.fillCircle(x + r, y - r, r);
            this.graphics.fillCircle(x - r/2, y + r/2, r * 1.5);
          }
        }
      }
    }

    // Grid (optional, but keep it faint for reference)
    this.graphics.lineStyle(1, 0x000000, 0.05);

    // 3. Decorate with palm trees and rocks
    // We'll scatter them deterministically or randomly within the island radius
    this.drawDecorations();
  }

  private drawDecorations() {
    const numTrees = 150;
    
    // Set a seed for pseudo-random deterministic placement if we want 
    // same map every time, but Math.random() is fine for V1 if server doesn't care.
    // For a battle royale, server needs to know tree locations for collisions.
    // In this basic version, trees are just visual for now.
    
    for (let i = 0; i < numTrees; i++) {
      // Random angle and distance within island
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (ISLAND_RADIUS - 100);
      const x = MAP_CENTER_X + Math.cos(angle) * dist;
      const y = MAP_CENTER_Y + Math.sin(angle) * dist;

      this.drawPalmTree(x, y);
    }
  }

  private drawPalmTree(x: number, y: number) {
    // Shadow
    this.graphics.fillStyle(0x000000, 0.2);
    this.graphics.fillEllipse(x + 5, y + 25, 30, 15);

    // Trunk
    this.graphics.fillStyle(COLORS.palmTrunk, 1);
    this.graphics.fillRect(x - 4, y, 8, 30);

    // Leaves
    this.graphics.fillStyle(COLORS.palmLeaves, 1);
    this.graphics.fillEllipse(x, y, 45, 20);
    
    // A second layer of leaves rotated
    // Since we are using standard graphics fillEllipse, we can't easily rotate a single ellipse.
    // We'll draw circles instead to make a clustered top.
    this.graphics.fillCircle(x - 15, y - 5, 12);
    this.graphics.fillCircle(x + 15, y - 5, 12);
    this.graphics.fillCircle(x, y - 15, 12);
    this.graphics.fillCircle(x, y + 5, 12);
  }
}
