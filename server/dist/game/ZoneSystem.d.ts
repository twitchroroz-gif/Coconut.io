import { GameState } from "../schemas/GameState";
export declare class ZoneSystem {
    private state;
    private currentPhaseIndex;
    private shrinkSpeed;
    private stateMachine;
    constructor(state: GameState);
    update(dtSeconds: number): void;
    private applyDamage;
    startGame(): void;
}
//# sourceMappingURL=ZoneSystem.d.ts.map