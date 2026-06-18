import Phaser from 'phaser';
import { GameState } from '../../../server/src/schemas/GameState';
import { COLORS } from 'coconutclash-shared';

export class ProjectileRenderer {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(5); // Above players
  }

  public update(state: GameState) {
    this.graphics.clear();

    state.projectiles.forEach(proj => {
      // Draw a fast moving trail / small bullet
      this.graphics.fillStyle(COLORS.projectile, 1);
      
      // We can draw a small capsule shape aligned with the angle
      const length = 12;
      const width = 4;
      
      this.graphics.save();
      
      // Unfortunately, Phaser's graphics path operations don't natively support easy rotation around a point for primitives without transforms.
      // Since it's a lightweight renderer, we'll draw a circle for now.
      
      // Draw outline
      this.graphics.fillStyle(0x000000, 1);
      this.graphics.fillCircle(proj.x, proj.y, width + 1.5);

      this.graphics.fillStyle(COLORS.projectile, 1);
      this.graphics.fillCircle(proj.x, proj.y, width);
      
      // Draw a small trail line
      this.graphics.lineStyle(2, COLORS.projectile, 0.5);
      this.graphics.beginPath();
      this.graphics.moveTo(proj.x, proj.y);
      this.graphics.lineTo(
        proj.x - Math.cos(proj.angle) * length,
        proj.y - Math.sin(proj.angle) * length
      );
      this.graphics.strokePath();

      this.graphics.restore();
    });
  }
}
