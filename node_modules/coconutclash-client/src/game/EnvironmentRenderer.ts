import Phaser from 'phaser';
import { GameState } from '../../../server/src/schemas/GameState';
import { COLORS } from 'coconutclash-shared';

export class EnvironmentRenderer {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(15); // Above players
  }

  public update(state: GameState, time: number) {
    this.graphics.clear();

    // 1. Draw Bushes
    state.bushes.forEach(bush => {
      // Base dark green
      this.graphics.fillStyle(0x2E7D32, 0.9);
      this.graphics.fillCircle(bush.x, bush.y, bush.radius);
      
      // Some texture/leaves (random looking but stable based on coordinates)
      this.graphics.fillStyle(0x388E3C, 1);
      this.graphics.fillCircle(bush.x - 10, bush.y - 15, bush.radius * 0.5);
      this.graphics.fillCircle(bush.x + 15, bush.y - 5, bush.radius * 0.6);
      this.graphics.fillCircle(bush.x - 5, bush.y + 15, bush.radius * 0.55);
    });

    // 2. Draw Obstacles (Rocks and Palms)
    state.obstacles.forEach(obs => {
      if (obs.type === "ROCK") {
        // Shadow
        this.graphics.fillStyle(0x000000, 0.3);
        this.graphics.fillCircle(obs.x + 5, obs.y + 5, obs.radius);
        
        // Base rock
        this.graphics.fillStyle(COLORS.rock, 1);
        this.graphics.fillCircle(obs.x, obs.y, obs.radius);
        
        // Rock highlights
        this.graphics.fillStyle(0x959A9D, 1);
        this.graphics.fillCircle(obs.x - 5, obs.y - 5, obs.radius * 0.6);
      } else if (obs.type === "PALM") {
        // Shadow
        this.graphics.fillStyle(0x000000, 0.4);
        this.graphics.fillCircle(obs.x + 10, obs.y + 10, obs.radius * 4);

        // Trunk
        this.graphics.fillStyle(COLORS.palmTrunk, 1);
        this.graphics.fillCircle(obs.x, obs.y, obs.radius);
        
        // Leaves (star pattern)
        this.graphics.fillStyle(COLORS.palmLeaves, 1);
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const leafX = obs.x + Math.cos(angle) * obs.radius * 3;
          const leafY = obs.y + Math.sin(angle) * obs.radius * 3;
          
          this.graphics.beginPath();
          this.graphics.moveTo(obs.x, obs.y);
          this.graphics.lineTo(leafX - Math.sin(angle)*15, leafY + Math.cos(angle)*15);
          this.graphics.lineTo(leafX + Math.sin(angle)*15, leafY - Math.cos(angle)*15);
          this.graphics.fillPath();
        }
      }
    });

    // 3. Draw Airdrops
    const now = Date.now();
    state.airdrops.forEach(airdrop => {
      if (!airdrop.isLanded) {
        // Falling animation
        const timeLeft = Math.max(0, airdrop.landedAt - now);
        const fallProgress = 1 - (timeLeft / 5000); // 0 to 1

        // Shadow gets darker and smaller as it lands
        this.graphics.fillStyle(0x000000, 0.5 * fallProgress);
        this.graphics.fillEllipse(airdrop.x, airdrop.y + 20, 40 * fallProgress, 20 * fallProgress);

        // Box falls from above
        const dropHeight = 500 * (1 - fallProgress);
        const boxY = airdrop.y - dropHeight;

        // Draw crate
        this.graphics.fillStyle(0xFFC107, 1); // Gold box
        this.graphics.fillRect(airdrop.x - 15, boxY - 15, 30, 30);
        this.graphics.lineStyle(2, 0xFF9800, 1);
        this.graphics.strokeRect(airdrop.x - 15, boxY - 15, 30, 30);
        
        // Draw cross lines on crate
        this.graphics.beginPath();
        this.graphics.moveTo(airdrop.x - 15, boxY - 15);
        this.graphics.lineTo(airdrop.x + 15, boxY + 15);
        this.graphics.moveTo(airdrop.x + 15, boxY - 15);
        this.graphics.lineTo(airdrop.x - 15, boxY + 15);
        this.graphics.strokePath();

        // Parachute
        this.graphics.fillStyle(0xFFFFFF, 0.9);
        this.graphics.beginPath();
        this.graphics.arc(airdrop.x, boxY - 30, 25, Math.PI, 0);
        this.graphics.fill();
        
        // Parachute strings
        this.graphics.lineStyle(1, 0xFFFFFF, 0.8);
        this.graphics.beginPath();
        this.graphics.moveTo(airdrop.x - 25, boxY - 30);
        this.graphics.lineTo(airdrop.x - 15, boxY - 15);
        this.graphics.moveTo(airdrop.x + 25, boxY - 30);
        this.graphics.lineTo(airdrop.x + 15, boxY - 15);
        this.graphics.strokePath();
      }
    });
  }
}
