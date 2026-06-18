export declare enum GamePhase {
    WAITING = 0,// Waiting for players in lobby
    COUNTDOWN = 1,// Enough players, counting down to start
    PLAYING = 2,// Game in progress
    GAME_OVER = 3
}
export declare enum WeaponType {
    NONE = "none",
    SLINGSHOT = "slingshot",// Fronde
    BLOWGUN = "blowgun",// Sarbacane
    MACHETE = "machete"
}
export declare enum ItemType {
    SLINGSHOT = "slingshot",
    BLOWGUN = "blowgun",
    MACHETE = "machete",
    SHIELD = "shield",// Bouclier en feuilles de palmier
    COCONUT = "coconut"
}
/** Input sent from client to server each tick */
export interface InputData {
    /** Movement direction flags */
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    /** Mouse angle in radians (direction the player is aiming) */
    angle: number;
    /** Whether the player is firing/attacking this frame */
    shoot: boolean;
    /** Sequence number for client-side prediction reconciliation */
    seq: number;
}
/** Kill event broadcast to all clients */
export interface KillEvent {
    killerName: string;
    killerSessionId: string;
    victimName: string;
    victimSessionId: string;
    weaponType: WeaponType;
}
/** Data sent when joining a room */
export interface JoinOptions {
    name: string;
}
/** Final ranking entry */
export interface RankingEntry {
    name: string;
    sessionId: string;
    kills: number;
    placement: number;
    alive: boolean;
}
/** Loot spawn weights — how likely each item type is to appear */
export declare const LOOT_WEIGHTS: Record<ItemType, number>;
//# sourceMappingURL=types.d.ts.map