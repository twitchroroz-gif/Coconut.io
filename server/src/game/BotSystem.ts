import { GameState } from "../schemas/GameState";
import { Player } from "../schemas/Player";
import { ItemType, WeaponType, MAP_WIDTH, MAP_HEIGHT, PLAYER_SPEED, GamePhase } from "coconutclash-shared";
import { CombatSystem } from "./CombatSystem";

export class BotSystem {
  private state: GameState;
  private combatSystem: CombatSystem;
  
  // Keep track of bot states
  private botStates: Map<string, any> = new Map();

  constructor(state: GameState, combatSystem: CombatSystem) {
    this.state = state;
    this.combatSystem = combatSystem;
  }

  public update(dtSeconds: number) {
    if (this.state.phase !== GamePhase.PLAYING) return;

    this.state.players.forEach((player, sessionId) => {
      if (player.isBot && player.alive) {
        this.updateBot(player, sessionId, dtSeconds);
      }
    });
  }

  private updateBot(bot: Player, sessionId: string, dtSeconds: number) {
    let state = this.botStates.get(sessionId);
    if (!state) {
      state = {
        state: 'wander',
        targetX: bot.x,
        targetY: bot.y,
        timer: 0,
        shootCooldown: 0
      };
      this.botStates.set(sessionId, state);
    }

    state.timer -= dtSeconds;
    state.shootCooldown -= dtSeconds;

    // Reset inputs
    bot.inputX = 0;
    bot.inputY = 0;
    bot.angle = 0;
    let shoot = false;

    // 1. Check zone
    const distToCenter = Math.sqrt(
      Math.pow(bot.x - this.state.zoneCenterX, 2) + 
      Math.pow(bot.y - this.state.zoneCenterY, 2)
    );

    // If near the edge of the zone (or outside), move to center
    if (distToCenter > this.state.zoneRadius - 100) {
      state.state = 'flee_zone';
      state.targetX = this.state.zoneCenterX + (Math.random() * 200 - 100);
      state.targetY = this.state.zoneCenterY + (Math.random() * 200 - 100);
      state.timer = 2; // Move for 2 seconds
    }

    // 2. Find enemies
    let closestEnemy: Player | null = null;
    let closestEnemyDist = 999999;

    this.state.players.forEach((otherPlayer, otherId) => {
      if (otherId !== sessionId && otherPlayer.alive && !otherPlayer.inBush) {
        const dist = Math.sqrt(Math.pow(bot.x - otherPlayer.x, 2) + Math.pow(bot.y - otherPlayer.y, 2));
        if (dist < closestEnemyDist) {
          closestEnemyDist = dist;
          closestEnemy = otherPlayer;
        }
      }
    });

    // 3. Find loot if unarmed
    let closestLoot: any = null;
    let closestLootDist = 999999;
    if (bot.weaponType === WeaponType.NONE) {
      this.state.lootItems.forEach(loot => {
        const dist = Math.sqrt(Math.pow(bot.x - loot.x, 2) + Math.pow(bot.y - loot.y, 2));
        if (dist < closestLootDist && dist < 600) { // Only see loot within 600 units
          closestLootDist = dist;
          closestLoot = loot;
        }
      });
    }

    // Determine Action
    if (state.state !== 'flee_zone') {
      const isUnarmed = bot.weaponType === WeaponType.NONE;
      const hasLowHealth = bot.hp < 40;
      const isMelee = bot.weaponType === WeaponType.MACHETE;

      if (closestEnemy && closestEnemyDist < 600) {
        
        if (hasLowHealth || (isUnarmed && closestEnemyDist > 100)) {
          // Flee!
          state.state = 'flee';
          state.targetX = bot.x + (bot.x - closestEnemy.x);
          state.targetY = bot.y + (bot.y - closestEnemy.y);
        } else if (closestLoot && isUnarmed && closestEnemyDist > 200) {
          // Prefer getting loot if enemy isn't right on top of us
          state.state = 'loot';
          state.targetX = closestLoot.x;
          state.targetY = closestLoot.y;
        } else {
          // Combat mode
          state.state = 'combat';
          
          // Aim at enemy with slight random inaccuracy
          const perfectAngle = Math.atan2(closestEnemy.y - bot.y, closestEnemy.x - bot.x);
          bot.angle = perfectAngle + (Math.random() - 0.5) * 0.4;
          
          // Shoot if ready
          if (state.shootCooldown <= 0 && closestEnemyDist < 400) {
            shoot = true;
            state.shootCooldown = 1.0 + Math.random() * 1.5; // Slower fire rate for bots
          }
          
          // Movement strategy
          if (isMelee || isUnarmed) {
            // Chase
            state.targetX = closestEnemy.x;
            state.targetY = closestEnemy.y;
          } else {
            // Ranged: Kite/Keep distance (~250-300)
            if (closestEnemyDist < 250) {
              // Back away
              state.targetX = bot.x + (bot.x - closestEnemy.x);
              state.targetY = bot.y + (bot.y - closestEnemy.y);
            } else if (closestEnemyDist > 350) {
              // Move closer
              state.targetX = closestEnemy.x;
              state.targetY = closestEnemy.y;
            } else {
              // Strafe
              state.targetX = bot.x + Math.cos(perfectAngle + Math.PI/2) * 50;
              state.targetY = bot.y + Math.sin(perfectAngle + Math.PI/2) * 50;
            }
          }
        }
      } else if (closestLoot) {
        // Go get loot
        state.state = 'loot';
        state.targetX = closestLoot.x;
        state.targetY = closestLoot.y;
      } else {
        // Wander
        if (state.timer <= 0) {
          state.state = 'wander';
          state.timer = 1 + Math.random() * 3;
          const angle = Math.random() * Math.PI * 2;
          const dist = 100 + Math.random() * 200;
          state.targetX = bot.x + Math.cos(angle) * dist;
          state.targetY = bot.y + Math.sin(angle) * dist;
        }
      }
    }

    // Move towards target
    const dx = state.targetX - bot.x;
    const dy = state.targetY - bot.y;
    const distToTarget = Math.sqrt(dx * dx + dy * dy);

    if (distToTarget > 10) {
      bot.inputX = dx / distToTarget;
      bot.inputY = dy / distToTarget;
      
      // If not in combat, look where we are going
      if (state.state !== 'combat') {
        bot.angle = Math.atan2(dy, dx);
      }
    } else if (state.state === 'flee_zone' || state.state === 'loot' || state.state === 'flee') {
      state.timer = 0; // Reached target, reset
      bot.inputX = 0;
      bot.inputY = 0;
    }

    // Execute shoot
    if (shoot) {
      this.combatSystem.handleShoot(sessionId);
    }
  }
}
