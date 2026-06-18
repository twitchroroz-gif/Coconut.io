import Phaser from 'phaser';
import { GameState } from '../../../server/src/schemas/GameState';
import { ItemType, COLORS } from 'coconutclash-shared';

export class LootRenderer {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(1); // Above map, below players
  }

  public update(state: GameState, time: number) {
    this.graphics.clear();

    // Pulse effect based on time
    const pulse = Math.sin(time / 200) * 0.1 + 0.9;

    state.lootItems.forEach(item => {
      switch (item.itemType) {
        case ItemType.COCONUT:
          this.drawCoconut(item.x, item.y, pulse);
          break;
        case ItemType.SHIELD:
          this.drawShield(item.x, item.y, pulse);
          break;
        case ItemType.SLINGSHOT:
          this.drawWeapon(item.x, item.y, pulse, 0xA0522D); // Brown
          break;
        case ItemType.BLOWGUN:
          this.drawWeapon(item.x, item.y, pulse, 0x2E8B57); // Dark Green
          break;
        case ItemType.MACHETE:
          this.drawWeapon(item.x, item.y, pulse, 0x808080); // Gray
          break;
      }
    });
  }

  private drawCoconut(x: number, y: number, pulse: number) {
    this.graphics.fillStyle(0x8B4513, 1); // SaddleBrown
    this.graphics.fillCircle(x, y, 8 * pulse);
    // Three dots
    this.graphics.fillStyle(0x000000, 0.5);
    this.graphics.fillCircle(x - 2, y - 2, 1);
    this.graphics.fillCircle(x + 2, y - 2, 1);
    this.graphics.fillCircle(x, y + 2, 1);
  }

  private drawShield(x: number, y: number, pulse: number) {
    this.graphics.fillStyle(COLORS.shield, 1);
    this.graphics.fillCircle(x, y, 10 * pulse);
    this.graphics.lineStyle(2, 0xffffff, 0.5);
    this.graphics.strokeCircle(x, y, 10 * pulse);
  }

  private drawWeapon(x: number, y: number, pulse: number, color: number) {
    // Simple glow
    this.graphics.fillStyle(COLORS.accentYellow, 0.3);
    this.graphics.fillCircle(x, y, 12 * pulse);
    
    // Weapon icon (placeholder simple shapes)
    this.graphics.lineStyle(3, color, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(x - 6, y + 6);
    this.graphics.lineTo(x + 6, y - 6);
    this.graphics.strokePath();
  }
}
