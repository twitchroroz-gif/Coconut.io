import Phaser from 'phaser';
import { GameState } from '../../../server/src/schemas/GameState';
import { COLORS } from 'coconutclash-shared';

export class ZoneRenderer {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    // Zone is above ground but below players
    this.graphics.setDepth(-5);
  }

  public update(state: GameState) {
    this.graphics.clear();

    const { zoneRadius, zoneCenterX, zoneCenterY, zoneTargetRadius } = state;

    // Outer mask: dim area outside the zone
    // For V1, we'll just draw a red stroke for the current zone and a dashed white for target zone
    
    // Current Zone
    this.graphics.lineStyle(4, COLORS.danger, 0.8);
    this.graphics.strokeCircle(zoneCenterX, zoneCenterY, zoneRadius);
    
    // Target Zone (where it's shrinking to)
    if (zoneTargetRadius < zoneRadius) {
      this.graphics.lineStyle(2, 0xffffff, 0.5);
      // Phaser doesn't have dashed stroke natively on graphics, so we'll just draw a light solid line for now
      this.graphics.strokeCircle(zoneCenterX, zoneCenterY, zoneTargetRadius);
    }
  }
}
