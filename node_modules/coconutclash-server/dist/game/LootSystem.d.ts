import { GameState } from "../schemas/GameState";
export declare class LootSystem {
    private state;
    private respawnTimer;
    constructor(state: GameState);
    update(dtSeconds: number): void;
    private spawnInitialLoot;
    private spawnLootBatch;
    private getRandomItemType;
    handlePickup(sessionId: string): void;
    private applyItemEffect;
}
//# sourceMappingURL=LootSystem.d.ts.map