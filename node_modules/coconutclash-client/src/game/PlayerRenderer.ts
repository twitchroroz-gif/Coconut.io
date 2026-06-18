import Phaser from 'phaser';
import { Player } from '../../../server/src/schemas/Player';
import { COLORS, WeaponType } from 'coconutclash-shared';

export class PlayerRenderer {
  public container: Phaser.GameObjects.Container;
  private bodyGraphics: Phaser.GameObjects.Graphics;
  private weaponGraphics: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private hpGraphics: Phaser.GameObjects.Graphics;
  
  public sessionId: string;
  public isLocal: boolean;
  private scene: Phaser.Scene;
  
  public isAttacking: boolean = false;

  constructor(scene: Phaser.Scene, sessionId: string, isLocal: boolean, initialX: number, initialY: number, name: string) {
    this.scene = scene;
    this.sessionId = sessionId;
    this.isLocal = isLocal;

    this.container = scene.add.container(initialX, initialY);
    this.container.setDepth(10); // Above map and loot

    // 1. Weapon (drawn under body or over, let's put it at index 0 in container)
    this.weaponGraphics = scene.add.graphics();
    this.container.add(this.weaponGraphics);

    // 2. Body & Eyes
    this.bodyGraphics = scene.add.graphics();
    this.container.add(this.bodyGraphics);

    // 3. Name Text
    this.nameText = scene.add.text(0, -35, name, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5);
    this.container.add(this.nameText);

    // 4. Health Bar
    this.hpGraphics = scene.add.graphics();
    this.container.add(this.hpGraphics);

    this.drawBody();
  }

  private drawBody() {
    this.bodyGraphics.clear();
    const color = this.isLocal ? COLORS.accentYellow : COLORS.accentCoral;
    
    // Main body circle
    this.bodyGraphics.fillStyle(color, 1);
    this.bodyGraphics.lineStyle(2, 0x000000, 0.5);
    this.bodyGraphics.fillCircle(0, 0, 16);
    this.bodyGraphics.strokeCircle(0, 0, 16);

    // Eyes (to show direction)
    // We will rotate the entire bodyGraphics based on angle later, 
    // so we draw eyes facing "right" (angle 0)
    this.bodyGraphics.fillStyle(0x000000, 1);
    this.bodyGraphics.fillCircle(8, -6, 3); // Right eye
    this.bodyGraphics.fillCircle(8, 6, 3);  // Left eye
    
    // White reflection
    this.bodyGraphics.fillStyle(0xffffff, 1);
    this.bodyGraphics.fillCircle(9, -7, 1);
    this.bodyGraphics.fillCircle(9, 5, 1);
  }

  public updateState(player: Player) {
    // Smooth position interpolation for ALL players (fixes local stutter)
    this.scene.tweens.add({
      targets: this.container,
      x: player.x,
      y: player.y,
      duration: 50, // Match SERVER_TICK_MS
      ease: 'Linear'
    });

    // Update rotation
    // We rotate the body and weapon, but keep name and HP bar upright
    this.bodyGraphics.rotation = player.angle;
    this.weaponGraphics.rotation = player.angle;

    // Handle Stealth (Bush)
    if (player.inBush) {
      this.container.alpha = this.isLocal ? 0.5 : 0;
    } else {
      this.container.alpha = 1;
    }

    // Update Health
    this.hpGraphics.clear();
    const hpWidth = 32;
    const hpPercent = Math.max(0, player.hp / player.maxHp);
    
    this.hpGraphics.fillStyle(0x000000, 0.6);
    this.hpGraphics.fillRect(-hpWidth/2, 22, hpWidth, 6);
    
    this.hpGraphics.fillStyle(player.hp > 30 ? COLORS.healthFull : COLORS.danger, 1);
    this.hpGraphics.fillRect(-hpWidth/2, 22, hpWidth * hpPercent, 6);

    // Shield
    if (player.shieldHp > 0) {
      this.hpGraphics.fillStyle(COLORS.shield, 1);
      this.hpGraphics.fillRect(-hpWidth/2, 22, hpWidth * (player.shieldHp / 50), 6);
      
      // Draw shield aura
      this.bodyGraphics.lineStyle(3, COLORS.shield, 0.5);
      this.bodyGraphics.strokeCircle(0, 0, 20);
    } else {
      this.drawBody(); // Redraw without shield aura
    }

    // Update Weapon
    this.drawWeapon(player.weaponType as WeaponType);
  }

  private drawWeapon(type: WeaponType) {
    this.weaponGraphics.clear();
    
    if (type === WeaponType.NONE) {
      // Draw fists
      this.weaponGraphics.fillStyle(0xccaa88, 1);
      this.weaponGraphics.fillCircle(14, -12, 5);
      this.weaponGraphics.fillCircle(14, 12, 5);
      return;
    }

    // For other weapons, draw them held in the right hand (bottom side when facing right)
    if (type === WeaponType.MACHETE) {
      this.weaponGraphics.lineStyle(4, 0xaaaaaa, 1);
      this.weaponGraphics.beginPath();
      this.weaponGraphics.moveTo(10, 14);
      this.weaponGraphics.lineTo(25, 14);
      this.weaponGraphics.strokePath();
      // Handle
      this.weaponGraphics.lineStyle(4, 0x8b4513, 1);
      this.weaponGraphics.beginPath();
      this.weaponGraphics.moveTo(5, 14);
      this.weaponGraphics.lineTo(10, 14);
      this.weaponGraphics.strokePath();
    } else if (type === WeaponType.SLINGSHOT) {
      this.weaponGraphics.lineStyle(3, 0x8b4513, 1);
      this.weaponGraphics.beginPath();
      this.weaponGraphics.moveTo(10, 14);
      this.weaponGraphics.lineTo(20, 8);
      this.weaponGraphics.moveTo(10, 14);
      this.weaponGraphics.lineTo(20, 20);
      this.weaponGraphics.strokePath();
      // Band
      this.weaponGraphics.lineStyle(1, 0x000000, 0.5);
      this.weaponGraphics.beginPath();
      this.weaponGraphics.moveTo(20, 8);
      this.weaponGraphics.lineTo(18, 14);
      this.weaponGraphics.lineTo(20, 20);
      this.weaponGraphics.strokePath();
    } else if (type === WeaponType.BLOWGUN) {
      this.weaponGraphics.lineStyle(4, 0x2e8b57, 1);
      this.weaponGraphics.beginPath();
      this.weaponGraphics.moveTo(5, 14);
      this.weaponGraphics.lineTo(30, 14);
      this.weaponGraphics.strokePath();
    }
  }

  public playAttackAnimation(weaponType: WeaponType) {
    if (this.isAttacking) return;
    this.isAttacking = true;

    if (weaponType === WeaponType.MACHETE) {
      // Swing animation
      this.scene.tweens.add({
        targets: this.weaponGraphics,
        angle: 45, // swing forward
        duration: 100,
        yoyo: true,
        ease: 'Quad.easeOut',
        onComplete: () => { this.isAttacking = false; }
      });
    } else {
      // Recoil animation
      this.scene.tweens.add({
        targets: this.weaponGraphics,
        x: -5,
        duration: 50,
        yoyo: true,
        ease: 'Quad.easeOut',
        onComplete: () => { this.isAttacking = false; }
      });
    }
  }

  public playDamageAnimation() {
    // Flash red
    this.scene.tweens.add({
      targets: this.bodyGraphics,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 1
    });

    // Blood particles
    const particles = this.scene.add.particles(this.container.x, this.container.y, 'circle', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: 0xff0000,
      lifespan: 300,
      quantity: 5,
      blendMode: 'ADD'
    });
    // Since we don't have a 'circle' texture loaded by default, we can create one or just use a generated graphic.
    // I will handle particle textures in GameScene.
  }

  public destroy() {
    this.container.destroy();
  }
}
