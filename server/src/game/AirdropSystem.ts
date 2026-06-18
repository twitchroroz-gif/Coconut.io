import { GameState } from "../schemas/GameState";
import { Airdrop } from "../schemas/Airdrop";
import { LootSystem } from "./LootSystem";
import { GamePhase, ItemType, WeaponType } from "coconutclash-shared";
import { randomUUID } from "crypto";

export class AirdropSystem {
  private state: GameState;
  private lootSystem: LootSystem;
  private timer: number = 0;
  private spawnInterval: number = 45; // Every 45 seconds

  constructor(state: GameState, lootSystem: LootSystem) {
    this.state = state;
    this.lootSystem = lootSystem;
    this.timer = 20; // First airdrop at 20 seconds into the game
  }

  public update(dtSeconds: number) {
    if (this.state.phase !== GamePhase.PLAYING) return;

    this.timer -= dtSeconds;
    if (this.timer <= 0) {
      this.spawnAirdrop();
      this.timer = this.spawnInterval;
    }

    // Check if any airdrops have landed
    const now = Date.now();
    for (let i = this.state.airdrops.length - 1; i >= 0; i--) {
      const airdrop = this.state.airdrops[i];
      if (!airdrop.isLanded && now >= airdrop.landedAt) {
        airdrop.isLanded = true;
        this.openAirdrop(airdrop);
        // Remove from list after a short delay or immediately?
        // Let's remove immediately to keep it clean, the loot is now on the floor
        this.state.airdrops.splice(i, 1);
      }
    }
  }

  private spawnAirdrop() {
    // Pick a random spot inside the current safe zone
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * (this.state.zoneRadius * 0.8); // 80% of radius to keep it somewhat centered
    
    const x = this.state.zoneCenterX + Math.cos(angle) * dist;
    const y = this.state.zoneCenterY + Math.sin(angle) * dist;

    const airdrop = new Airdrop();
    airdrop.id = randomUUID();
    airdrop.x = x;
    airdrop.y = y;
    airdrop.landedAt = Date.now() + 5000; // Lands in 5 seconds
    airdrop.isLanded = false;

    this.state.airdrops.push(airdrop);
  }

  private openAirdrop(airdrop: Airdrop) {
    // Drop 3 rare items
    // Shield
    this.lootSystem.spawnLootAt(airdrop.x - 20, airdrop.y, ItemType.SHIELD);
    // Coconut
    this.lootSystem.spawnLootAt(airdrop.x + 20, airdrop.y, ItemType.COCONUT);
    // Random Weapon
    const weapons = [ItemType.MACHETE, ItemType.SLINGSHOT, ItemType.BLOWGUN];
    const w = weapons[Math.floor(Math.random() * weapons.length)];
    this.lootSystem.spawnLootAt(airdrop.x, airdrop.y + 20, w);
  }
}
