import Phaser from 'phaser';
import { networkManager } from '../network/NetworkManager';
import { CSS_COLORS } from 'coconutclash-shared';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Basic tropical animated background using Graphics
    this.createBackground();

    // Show the HTML menu UI
    const menuUi = document.getElementById('menu-ui');
    if (menuUi) menuUi.classList.remove('hidden');

    const playBtn = document.getElementById('play-button');
    const nameInput = document.getElementById('nickname-input') as HTMLInputElement;
    const statusText = document.getElementById('connection-status');

    if (playBtn && nameInput && statusText) {
      // Clear status
      statusText.innerText = '';
      
      // Auto-focus input
      nameInput.focus();

      const joinGame = async () => {
        const name = nameInput.value.trim() || 'Player' + Math.floor(Math.random() * 1000);
        
        playBtn.setAttribute('disabled', 'true');
        statusText.innerText = 'Connecting to server...';
        
        try {
          await networkManager.joinGame(name);
          // Hide UI and transition to GameScene
          menuUi.classList.add('hidden');
          this.scene.start('GameScene');
        } catch (e) {
          console.error(e);
          statusText.innerText = 'Failed to connect. Is the server running?';
          playBtn.removeAttribute('disabled');
        }
      };

      playBtn.onclick = joinGame;
      
      nameInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          joinGame();
        }
      };
    }
  }

  createBackground() {
    // Fill deep water
    this.cameras.main.setBackgroundColor(CSS_COLORS.waterDeep);
    
    // Draw some simple stylized waves/islands that slowly move
    const graphics = this.add.graphics();
    graphics.fillStyle(parseInt(CSS_COLORS.water.replace('#', '0x')), 1);
    
    // We'll animate these in update
    this.waves = [];
    for (let i = 0; i < 5; i++) {
      const wave = this.add.circle(
        Math.random() * this.cameras.main.width, 
        Math.random() * this.cameras.main.height, 
        Math.random() * 200 + 100, 
        parseInt(CSS_COLORS.water.replace('#', '0x'))
      );
      wave.setAlpha(0.5);
      
      this.tweens.add({
        targets: wave,
        scaleX: 1.5,
        scaleY: 1.5,
        y: wave.y - 100,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
}
