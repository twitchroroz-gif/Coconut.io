import { GameState } from "../schemas/GameState";
import { ZONE_PHASES, ZONE_DAMAGE_PER_SEC, GamePhase } from "coconutclash-shared";

export class ZoneSystem {
  private state: GameState;
  private currentPhaseIndex: number = 0;
  private shrinkSpeed: number = 0;
  private stateMachine: 'waiting' | 'shrinking' | 'done' = 'waiting';

  constructor(state: GameState) {
    this.state = state;
  }

  public update(dtSeconds: number) {
    if (this.state.phase !== GamePhase.PLAYING) return;

    // Advance timer
    this.state.phaseTimer -= dtSeconds;

    const currentPhaseConfig = ZONE_PHASES[this.currentPhaseIndex];
    if (!currentPhaseConfig) {
      // All phases done, apply massive damage
      this.applyDamage(ZONE_DAMAGE_PER_SEC[ZONE_DAMAGE_PER_SEC.length - 1] * dtSeconds);
      return;
    }

    if (this.stateMachine === 'waiting') {
      if (this.state.phaseTimer <= 0) {
        // Start shrinking
        this.stateMachine = 'shrinking';
        this.state.zoneTargetRadius = currentPhaseConfig.targetRadius;
        this.state.phaseTimer = currentPhaseConfig.shrinkDuration;
        
        const radiusDiff = this.state.zoneRadius - this.state.zoneTargetRadius;
        this.shrinkSpeed = radiusDiff / currentPhaseConfig.shrinkDuration;
      }
    } else if (this.stateMachine === 'shrinking') {
      this.state.zoneRadius -= this.shrinkSpeed * dtSeconds;

      if (this.state.zoneRadius <= this.state.zoneTargetRadius) {
        this.state.zoneRadius = this.state.zoneTargetRadius;
        // Phase done, setup next phase
        this.currentPhaseIndex++;
        const nextPhaseConfig = ZONE_PHASES[this.currentPhaseIndex];
        
        if (nextPhaseConfig) {
          this.stateMachine = 'waiting';
          this.state.phaseTimer = nextPhaseConfig.delay;
        } else {
          this.stateMachine = 'done';
        }
      }
    }

    // Apply damage to players outside zone
    const currentDamagePerSec = ZONE_DAMAGE_PER_SEC[Math.min(this.currentPhaseIndex, ZONE_DAMAGE_PER_SEC.length - 1)];
    this.applyDamage(currentDamagePerSec * dtSeconds);
  }

  private applyDamage(damage: number) {
    this.state.players.forEach(player => {
      if (!player.alive) return;

      const dx = player.x - this.state.zoneCenterX;
      const dy = player.y - this.state.zoneCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > this.state.zoneRadius) {
        // Player is outside the zone
        player.hp -= damage;
        if (player.hp <= 0) {
          player.hp = 0;
          player.alive = false;
          this.state.aliveCount--;
          // Combat system will handle kill broadcast later
        }
      }
    });
  }

  public startGame() {
    this.state.phase = GamePhase.PLAYING;
    this.currentPhaseIndex = 0;
    this.stateMachine = 'waiting';
    if (ZONE_PHASES.length > 0) {
      this.state.phaseTimer = ZONE_PHASES[0].delay;
      this.state.zoneTargetRadius = ZONE_PHASES[0].targetRadius;
    }
  }
}
