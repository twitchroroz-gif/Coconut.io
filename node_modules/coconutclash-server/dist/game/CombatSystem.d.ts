import { GameState } from "../schemas/GameState";
export declare class CombatSystem {
    private state;
    private lastShotTime;
    constructor(state: GameState);
    update(dtSeconds: number): void;
    handleShoot(sessionId: string): void;
    private performMeleeAttack;
    private fireProjectile;
    private applyDamage;
    private normalizeAngle;
}
//# sourceMappingURL=CombatSystem.d.ts.map