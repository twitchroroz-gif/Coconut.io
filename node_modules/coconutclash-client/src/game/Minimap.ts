import Phaser from 'phaser';
import { MAP_WIDTH, MAP_HEIGHT, COLORS } from 'coconutclash-shared';

export class Minimap {
  private scene: Phaser.Scene;
  private camera!: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    const size = 150;
    const margin = 20;
    
    // Create the secondary camera for the minimap
    // Position it in the top right corner
    this.camera = this.scene.cameras.add(
      this.scene.scale.width - size - margin,
      margin + 60, // below the HUD
      size,
      size
    );

    // Zoom out to show the whole map
    // The zoom factor depends on the map size vs minimap size
    const zoomX = size / MAP_WIDTH;
    const zoomY = size / MAP_HEIGHT;
    this.camera.setZoom(Math.min(zoomX, zoomY));
    
    // Center it on the map
    this.camera.setScroll(MAP_WIDTH / 2, MAP_HEIGHT / 2);
    
    // Visuals
    this.camera.setBackgroundColor(parseInt(COLORS.waterDeep.toString().replace('#', '0x')));
    this.camera.setAlpha(0.85);

    // Draw border
    const border = this.scene.add.graphics();
    border.lineStyle(4, parseInt(COLORS.accentYellow.toString().replace('#', '0x')), 1);
    border.strokeRect(
      this.scene.scale.width - size - margin,
      margin + 60,
      size,
      size
    );
    border.setScrollFactor(0); // Fixed to UI
    border.setDepth(100);
    
    // Ignore UI elements on the minimap
    // (We will need to pass in UI layers to ignore later if they are added to the scene)
  }

  public resize() {
    const size = 150;
    const margin = 20;
    this.camera.setPosition(
      this.scene.scale.width - size - margin,
      margin + 60
    );
    
    // We would need to update the border position too, but for simplicity
    // we assume window resize is rare or we redraw the border in a dedicated UI scene.
  }
}
