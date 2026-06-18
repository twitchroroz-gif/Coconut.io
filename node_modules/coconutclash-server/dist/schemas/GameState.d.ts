import { Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "./Player";
import { LootItem } from "./LootItem";
import { Projectile } from "./Projectile";
import { Bush } from "./Bush";
import { Airdrop } from "./Airdrop";
import { Obstacle } from "./Obstacle";
export declare class GameState extends Schema {
    players: MapSchema<Player, string>;
    lootItems: ArraySchema<LootItem>;
    projectiles: ArraySchema<Projectile>;
    bushes: ArraySchema<Bush>;
    airdrops: ArraySchema<Airdrop>;
    obstacles: ArraySchema<Obstacle>;
    zoneRadius: number;
    zoneCenterX: number;
    zoneCenterY: number;
    zoneTargetRadius: number;
    phase: number;
    aliveCount: number;
    elapsedTime: number;
    phaseTimer: number;
}
//# sourceMappingURL=GameState.d.ts.map