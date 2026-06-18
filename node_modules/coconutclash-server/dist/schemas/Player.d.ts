import { Schema } from "@colyseus/schema";
export declare class Player extends Schema {
    name: string;
    x: number;
    y: number;
    angle: number;
    hp: number;
    maxHp: number;
    alive: boolean;
    weaponType: string;
    shieldHp: number;
    kills: number;
    inputX: number;
    inputY: number;
    isBot: boolean;
    inBush: boolean;
    lastProcessedSeq: number;
}
//# sourceMappingURL=Player.d.ts.map