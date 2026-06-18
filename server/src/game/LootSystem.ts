import { GameState } from "../schemas/GameState";
import { LootItem } from "../schemas/LootItem";
import { 
  ItemType, 
  LOOT_WEIGHTS, 
  INITIAL_LOOT_COUNT, 
  MAX_LOOT_ON_MAP,
  LOOT_RESPAWN_INTERVAL_SEC,
  ISLAND_RADIUS,
  MAP_CENTER_X,
  MAP_CENTER_Y,
  PLAYER_PICKUP_RANGE
} from "coconutclash-shared";
import { randomUUID } from "crypto";

export class LootSystem {
  private state: GameState;
  private respawnTimer: number = LOOT_RESPAWN_INTERVAL_SEC;

  constructor(state: GameState) {
    this.state = state;
    this.spawnInitialLoot();
  }

  public update(dtSeconds: number) {
    this.respawnTimer -= dtSeconds;
    if (this.respawnTimer <= 0) {
      this.respawnTimer = LOOT_RESPAWN_INTERVAL_SEC;
      this.spawnLootBatch(5); // Spawn a few items periodically
    }
  }

  private spawnInitialLoot() {
    this.spawnLootBatch(INITIAL_LOOT_COUNT);
  }

  private spawnLootBatch(count: number) {
    if (this.state.lootItems.length >= MAX_LOOT_ON_MAP) return;

    for (let i = 0; i < count; i++) {
      if (this.state.lootItems.length >= MAX_LOOT_ON_MAP) break;

      const item = new LootItem();
      item.id = randomUUID();
      
      // Spawn inside the CURRENT zone
      const radius = Math.random() * (this.state.zoneRadius - 50);
      const angle = Math.random() * Math.PI * 2;
      item.x = this.state.zoneCenterX + Math.cos(angle) * radius;
      item.y = this.state.zoneCenterY + Math.sin(angle) * radius;

      item.itemType = this.getRandomItemType();
      
      this.state.lootItems.push(item);
    }
  }

  public spawnLootAt(x: number, y: number, itemType: string) {
    if (this.state.lootItems.length >= MAX_LOOT_ON_MAP) return;
    
    const item = new LootItem();
    item.id = randomUUID();
    item.x = x;
    item.y = y;
    item.itemType = itemType;
    this.state.lootItems.push(item);
  }

  private getRandomItemType(): string {
    const totalWeight = Object.values(LOOT_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (const [type, weight] of Object.entries(LOOT_WEIGHTS)) {
      random -= weight;
      if (random <= 0) {
        return type;
      }
    }
    return ItemType.COCONUT; // Fallback
  }

  public handlePickup(sessionId: string) {
    const player = this.state.players.get(sessionId);
    if (!player || !player.alive) return;

    // Find closest item within pickup range
    let closestItemIndex = -1;
    let minDistanceSq = PLAYER_PICKUP_RANGE * PLAYER_PICKUP_RANGE;

    for (let i = 0; i < this.state.lootItems.length; i++) {
      const item = this.state.lootItems[i]!;
      const dx = player.x - item.x;
      const dy = player.y - item.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        closestItemIndex = i;
      }
    }

    if (closestItemIndex !== -1) {
      const item = this.state.lootItems[closestItemIndex]!;
      this.applyItemEffect(player, item.itemType as ItemType);
      
      // Remove item
      this.state.lootItems.splice(closestItemIndex, 1);
    }
  }

  private applyItemEffect(player: any, itemType: ItemType) {
    switch (itemType) {
      case ItemType.SLINGSHOT:
      case ItemType.BLOWGUN:
      case ItemType.MACHETE:
        player.weaponType = itemType;
        break;
      case ItemType.SHIELD:
        player.shieldHp = 50;
        break;
      case ItemType.COCONUT:
        player.hp = Math.min(player.maxHp, player.hp + 30);
        break;
    }
  }
}
