import { GameState } from '../../../server/src/schemas/GameState';
import { GamePhase, TARGET_PLAYERS, WeaponType, ItemType } from 'coconutclash-shared';

const WEAPON_INFO: Record<string, { icon: string; name: string }> = {
  [WeaponType.NONE]: { icon: '👊', name: 'Fists' },
  [WeaponType.MACHETE]: { icon: '🔪', name: 'Machete' },
  [WeaponType.SLINGSHOT]: { icon: '🏹', name: 'Slingshot' },
  [WeaponType.BLOWGUN]: { icon: '🎯', name: 'Blowgun' },
};

export class HUD {
  private aliveCountEl: HTMLElement;
  private zoneTimeTextEl: HTMLElement;
  private killFeedEl: HTMLElement;
  private gameoverUiEl: HTMLElement;
  private hudUiEl: HTMLElement;
  private lobbyOverlayEl: HTMLElement;
  private lobbyTextEl: HTMLElement;

  // New HUD elements
  private healthFillEl: HTMLElement;
  private shieldFillEl: HTMLElement;
  private healthTextEl: HTMLElement;
  private weaponIconEl: HTMLElement;
  private weaponNameEl: HTMLElement;
  private minimapCanvas: HTMLCanvasElement;
  private minimapCtx: CanvasRenderingContext2D;

  private gameOverShown = false;

  constructor() {
    this.aliveCountEl = document.getElementById('alive-count')!;
    this.zoneTimeTextEl = document.getElementById('zone-time-text')!;
    this.killFeedEl = document.getElementById('kill-feed')!;
    this.gameoverUiEl = document.getElementById('gameover-ui')!;
    this.hudUiEl = document.getElementById('hud-ui')!;
    this.lobbyOverlayEl = document.getElementById('lobby-overlay')!;
    this.lobbyTextEl = document.getElementById('lobby-text')!;
    
    // New
    this.healthFillEl = document.getElementById('hud-health-fill')!;
    this.shieldFillEl = document.getElementById('hud-shield-fill')!;
    this.healthTextEl = document.getElementById('hud-health-text')!;
    this.weaponIconEl = document.getElementById('weapon-icon')!;
    this.weaponNameEl = document.getElementById('weapon-name')!;
    this.minimapCanvas = document.getElementById('minimap-canvas') as HTMLCanvasElement;
    this.minimapCtx = this.minimapCanvas.getContext('2d')!;
  }

  public update(state: GameState, localPlayerId: string) {
    // Update survivors
    this.aliveCountEl.innerText = state.aliveCount.toString();

    // Update zone timer
    const minutes = Math.floor(Math.max(0, state.phaseTimer) / 60);
    const seconds = Math.floor(Math.max(0, state.phaseTimer) % 60);
    this.zoneTimeTextEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Handle lobby display
    if (state.phase === GamePhase.WAITING) {
      this.lobbyOverlayEl.style.display = 'block';
      this.lobbyTextEl.innerText = `Waiting for players... (${state.aliveCount}/${TARGET_PLAYERS})`;
    } else if (state.phase === GamePhase.COUNTDOWN) {
      this.lobbyOverlayEl.style.display = 'block';
      this.lobbyTextEl.innerText = `Deploying in ${Math.ceil(state.phaseTimer)}...`;
    } else {
      this.lobbyOverlayEl.style.display = 'none';
    }

    // Local player HUD
    const player = state.players.get(localPlayerId);
    if (player) {
      // Health bar
      const hpPercent = Math.max(0, player.hp / player.maxHp) * 100;
      this.healthFillEl.style.width = `${hpPercent}%`;
      
      if (hpPercent < 30) {
        this.healthFillEl.style.background = 'linear-gradient(90deg, #E53935, #EF5350)';
      } else {
        this.healthFillEl.style.background = 'linear-gradient(90deg, #43A047, #66BB6A)';
      }
      
      this.healthTextEl.innerText = `${Math.ceil(player.hp)}`;

      // Shield bar
      const shieldPercent = Math.max(0, player.shieldHp / 50) * 100;
      this.shieldFillEl.style.width = `${shieldPercent}%`;

      // Weapon
      const weaponInfo = WEAPON_INFO[player.weaponType] || WEAPON_INFO[WeaponType.NONE];
      this.weaponIconEl.innerText = weaponInfo.icon;
      this.weaponNameEl.innerText = weaponInfo.name;

      // Check Game Over / Victory
      if (!this.gameOverShown) {
        if (!player.alive) {
          this.showGameOver(player.kills, state.aliveCount + 1, false);
          this.gameOverShown = true;
        } else if (state.phase === GamePhase.GAME_OVER && state.aliveCount <= 1) {
          this.showGameOver(player.kills, 1, true);
          this.gameOverShown = true;
        }
      }
    }

    // Draw Minimap
    this.drawMinimap(state, localPlayerId);
  }

  private drawMinimap(state: GameState, localPlayerId: string) {
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;
    const mapW = 4000; // MAP_WIDTH
    const mapH = 4000; // MAP_HEIGHT
    const scaleX = w / mapW;
    const scaleY = h / mapH;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background (water)
    ctx.fillStyle = '#2A7A8A';
    ctx.beginPath();
    ctx.arc(w/2, h/2, w/2, 0, Math.PI * 2);
    ctx.fill();

    // Island
    const islandR = (1800 / mapW) * w;
    ctx.fillStyle = '#D4B87A';
    ctx.beginPath();
    ctx.arc(w/2, h/2, islandR, 0, Math.PI * 2);
    ctx.fill();

    // Zone circle
    const zoneR = (state.zoneRadius / mapW) * w;
    const zoneCX = state.zoneCenterX * scaleX;
    const zoneCY = state.zoneCenterY * scaleY;
    ctx.strokeStyle = 'rgba(239, 83, 80, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(zoneCX, zoneCY, zoneR, 0, Math.PI * 2);
    ctx.stroke();

    // Players
    state.players.forEach((player, sessionId) => {
      if (!player.alive) return;
      const px = player.x * scaleX;
      const py = player.y * scaleY;

      if (sessionId === localPlayerId) {
        ctx.fillStyle = '#FFD54F'; // Yellow for local
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#FF6B3D'; // Coral for enemies
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  public addKillFeedEvent(killerName: string, victimName: string, weapon: string) {
    const item = document.createElement('div');
    item.className = 'kill-feed-item';
    item.innerText = `${killerName} 🔫 ${victimName}`;
    
    this.killFeedEl.appendChild(item);

    // Fade out after 4 seconds
    setTimeout(() => {
      item.classList.add('fade-out');
      setTimeout(() => {
        item.remove();
      }, 600);
    }, 4000);
  }

  public showGameOver(kills: number, placement: number, isVictory: boolean) {
    this.hudUiEl.classList.add('hidden');
    this.gameoverUiEl.classList.remove('hidden');

    const titleEl = document.getElementById('gameover-title');
    const badgeEl = document.getElementById('gameover-badge');
    const killsEl = document.getElementById('go-kills');
    const placementEl = document.getElementById('go-placement');
    
    if (titleEl && badgeEl) {
      if (isVictory) {
        badgeEl.innerText = "🏆";
        titleEl.innerText = "VICTORY ROYALE";
        titleEl.style.color = "#FFD54F";
      } else {
        badgeEl.innerText = "💀";
        titleEl.innerText = "ELIMINATED";
        titleEl.style.color = "#EF5350";
      }
    }

    if (killsEl) killsEl.innerText = kills.toString();
    if (placementEl) placementEl.innerText = `#${placement}`;
  }
}
