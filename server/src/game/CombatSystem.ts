import { GameState } from "../schemas/GameState";
import { Projectile } from "../schemas/Projectile";
import { 
  WEAPONS, 
  WeaponType, 
  PROJECTILE_LIFETIME_MS, 
  PLAYER_RADIUS 
} from "coconutclash-shared";
import { randomUUID } from "crypto";

export class CombatSystem {
  private state: GameState;
  private lastShotTime: Map<string, number> = new Map();

  constructor(state: GameState) {
    this.state = state;
  }

  public update(dtSeconds: number) {
    const now = Date.now();

    // 1. Move Projectiles
    for (let i = this.state.projectiles.length - 1; i >= 0; i--) {
      const proj = this.state.projectiles[i]!;
      
      // Move projectile
      proj.x += Math.cos(proj.angle) * proj.speed * dtSeconds;
      proj.y += Math.sin(proj.angle) * proj.speed * dtSeconds;
      
      // Check collision with obstacles
      let hitObstacle = false;
      for (let j = 0; j < this.state.obstacles.length; j++) {
        const obs = this.state.obstacles[j];
        if (!obs) continue;
        const distSq = Math.pow(proj.x - obs.x, 2) + Math.pow(proj.y - obs.y, 2);
        if (distSq < obs.radius * obs.radius) {
          hitObstacle = true;
          break;
        }
      }

      if (hitObstacle) {
        this.state.projectiles.splice(i, 1);
        continue;
      }

      // Check lifetime
      if (now - proj.createdAt > PROJECTILE_LIFETIME_MS) {
        this.state.projectiles.splice(i, 1);
        continue;
      }

      // Check collisions with players
      let hit = false;
      for (const [sessionId, player] of this.state.players.entries()) {
        if (!player.alive || sessionId === proj.ownerId) continue;

        const dx = player.x - proj.x;
        const dy = player.y - proj.y;
        const distSq = dx * dx + dy * dy;

        // Simple circle collision
        if (distSq < (PLAYER_RADIUS + 4) * (PLAYER_RADIUS + 4)) { // 4 is approx projectile radius
          this.applyDamage(sessionId, proj.ownerId, proj.damage);
          hit = true;
          break; // Projectile destroyed on first hit
        }
      }

      if (hit) {
        this.state.projectiles.splice(i, 1);
      }
    }
  }

  public handleShoot(sessionId: string) {
    const player = this.state.players.get(sessionId);
    if (!player || !player.alive) return;

    const weaponType = player.weaponType as WeaponType;
    const weaponDef = WEAPONS[weaponType] || WEAPONS[WeaponType.NONE];
    
    const now = Date.now();
    const lastShot = this.lastShotTime.get(sessionId) || 0;

    if (now - lastShot < weaponDef.cooldownMs) {
      return; // Still on cooldown
    }
    
    this.lastShotTime.set(sessionId, now);

    if (weaponDef.isMelee) {
      this.performMeleeAttack(sessionId, player, weaponDef);
    } else {
      this.fireProjectile(sessionId, player, weaponDef);
    }
  }

  private performMeleeAttack(ownerId: string, attacker: any, weaponDef: any) {
    // Simple area of effect in front of player
    for (const [sessionId, victim] of this.state.players.entries()) {
      if (!victim.alive || sessionId === ownerId) continue;

      const dx = victim.x - attacker.x;
      const dy = victim.y - attacker.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= weaponDef.range) {
        // Check angle
        const angleToVictim = Math.atan2(dy, dx);
        const angleDiff = Math.abs(this.normalizeAngle(angleToVictim - attacker.angle));
        
        // 90 degree arc (PI/4 on each side)
        if (angleDiff <= Math.PI / 4) {
          this.applyDamage(sessionId, ownerId, weaponDef.damage);
        }
      }
    }
  }

  private fireProjectile(ownerId: string, player: any, weaponDef: any) {
    const proj = new Projectile();
    proj.id = randomUUID();
    // Spawn slightly in front of player
    proj.x = player.x + Math.cos(player.angle) * (PLAYER_RADIUS + 5);
    proj.y = player.y + Math.sin(player.angle) * (PLAYER_RADIUS + 5);
    proj.angle = player.angle;
    proj.speed = weaponDef.speed;
    proj.damage = weaponDef.damage;
    proj.ownerId = ownerId;
    proj.createdAt = Date.now();

    this.state.projectiles.push(proj);
  }

  private applyDamage(victimId: string, attackerId: string, damage: number) {
    const victim = this.state.players.get(victimId);
    if (!victim || !victim.alive) return;

    // Apply to shield first
    if (victim.shieldHp > 0) {
      const shieldDamage = Math.min(victim.shieldHp, damage);
      victim.shieldHp -= shieldDamage;
      damage -= shieldDamage;
    }

    if (damage > 0) {
      victim.hp -= damage;
    }

    if (victim.hp <= 0) {
      victim.hp = 0;
      victim.alive = false;
      this.state.aliveCount--;

      const attacker = this.state.players.get(attackerId);
      if (attacker) {
        attacker.kills++;
      }
      
      // TODO: Broadcast KillEvent to clients for the kill feed
    }
  }

  private normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }
}
