import Phaser from 'phaser';
import { networkManager } from '../network/NetworkManager';
import { COLORS, InputData, MAP_WIDTH, MAP_HEIGHT } from 'coconutclash-shared';
import { MapRenderer } from '../game/MapRenderer';
import { ZoneRenderer } from '../game/ZoneRenderer';
import { LootRenderer } from '../game/LootRenderer';
import { ProjectileRenderer } from '../game/ProjectileRenderer';
import { PlayerRenderer } from '../game/PlayerRenderer';
import { EnvironmentRenderer } from '../game/EnvironmentRenderer';
import { HUD } from '../ui/HUD';

export class GameScene extends Phaser.Scene {
  private players: { [sessionId: string]: PlayerRenderer } = {};
  private localPlayerSprite?: PlayerRenderer;
  
  private mapRenderer!: MapRenderer;
  private zoneRenderer!: ZoneRenderer;
  private lootRenderer!: LootRenderer;
  private projectileRenderer!: ProjectileRenderer;
  private environmentRenderer!: EnvironmentRenderer;
  private hud!: HUD;
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;

  constructor() {
    super('GameScene');
  }

  create() {
    // Basic setup
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Generate circle texture for particles if not exists
    if (!this.textures.exists('circle')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1);
      g.fillCircle(8, 8, 8);
      g.generateTexture('circle', 16, 16);
    }
    
    this.mapRenderer = new MapRenderer(this);
    this.zoneRenderer = new ZoneRenderer(this);
    this.lootRenderer = new LootRenderer(this);
    this.projectileRenderer = new ProjectileRenderer(this);
    this.environmentRenderer = new EnvironmentRenderer(this);
    this.hud = new HUD();

    // Inputs
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
    }

    // Connect state listeners
    const room = networkManager.room;
    if (!room) {
      this.scene.start('MenuScene');
      return;
    }

    room.state.players.onAdd((player: any, sessionId: string) => {
      // Create PlayerRenderer
      const isLocal = sessionId === room.sessionId;
      const renderer = new PlayerRenderer(this, sessionId, isLocal, player.x, player.y, player.name);
      
      this.players[sessionId] = renderer;

      if (isLocal) {
        this.localPlayerSprite = renderer;
        this.cameras.main.startFollow(renderer.container, true, 0.1, 0.1);
      }

      // We will sync using the update method, but we can also listen for changes
      player.onChange(() => {
        renderer.updateState(player);
      });

      player.listen("hp", (currentValue: number, previousValue: number) => {
        if (previousValue !== undefined && currentValue < previousValue) {
          renderer.playDamageAnimation();
        }
      });
      
      // Initialize state
      renderer.updateState(player);
    });

    room.state.players.onRemove((player: any, sessionId: string) => {
      const renderer = this.players[sessionId];
      if (renderer) {
        // Death animation / particles
        this.playDeathParticles(renderer.container.x, renderer.container.y);
        renderer.destroy();
        delete this.players[sessionId];
      }
    });

    // Show HUD
    document.getElementById('hud-ui')?.classList.remove('hidden');
    
    // Setup Replay Button
    const replayBtn = document.getElementById('replay-button');
    if (replayBtn) {
      replayBtn.onclick = () => {
        networkManager.leaveGame();
        document.getElementById('gameover-ui')?.classList.add('hidden');
        this.scene.start('MenuScene');
      };
    }
  }

  update(time: number) {
    if (!networkManager.room || !this.localPlayerSprite) return;

    // Calculate mouse angle relative to player in world space
    const pointer = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
      this.localPlayerSprite.container.x, 
      this.localPlayerSprite.container.y,
      pointer.worldX, 
      pointer.worldY
    );

    // Build input (block movement/shooting if not PLAYING)
    const isPlaying = networkManager.room && (networkManager.room.state as any).phase === 2; // GamePhase.PLAYING = 2
    
    if (isPlaying && this.input.activePointer.isDown) {
      const state = networkManager.room.state as any;
      const playerState = state.players.get(networkManager.room.sessionId);
      if (playerState) {
        this.localPlayerSprite.playAttackAnimation(playerState.weaponType);
      }
    }
    
    const input: InputData = {
      up: isPlaying && (this.cursors.up.isDown || this.wasdKeys.W.isDown),
      down: isPlaying && (this.cursors.down.isDown || this.wasdKeys.S.isDown),
      left: isPlaying && (this.cursors.left.isDown || this.wasdKeys.A.isDown),
      right: isPlaying && (this.cursors.right.isDown || this.wasdKeys.D.isDown),
      angle: angle,
      shoot: isPlaying && this.input.activePointer.isDown,
      seq: 0
    };

    // Send to server
    networkManager.sendInput(input);
    
    // Update renderers
    if (networkManager.room && networkManager.room.state) {
      const state = networkManager.room.state as any;
      this.zoneRenderer.update(state);
      this.lootRenderer.update(state, time);
      this.projectileRenderer.update(state);
      this.environmentRenderer.update(state, time);
      this.hud.update(state, networkManager.room.sessionId);
    }
  }

  private playDeathParticles(x: number, y: number) {
    // Basic particle explosion
    const particles = this.add.particles(x, y, 'circle', {
      speed: { min: 100, max: 300 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [0xff0000, 0x8b0000, 0x000000],
      lifespan: 800,
      quantity: 20,
      blendMode: 'ADD'
    });
    
    // Stop emitting after burst
    particles.stop();
    // Destroy after lifespan
    setTimeout(() => {
      particles.destroy();
    }, 1000);
  }
}
