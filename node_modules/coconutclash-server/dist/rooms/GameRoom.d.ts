import { Room, Client } from "colyseus";
import { GameState } from "../schemas/GameState";
import { JoinOptions } from "coconutclash-shared";
export declare class GameRoom extends Room<GameState> {
    maxClients: number;
    private zoneSystem;
    private lootSystem;
    private combatSystem;
    private botSystem;
    private airdropSystem;
    onCreate(options: any): void;
    onJoin(client: Client, options: JoinOptions): void;
    onLeave(client: Client, consented: boolean): void;
    onDispose(): void;
    update(deltaTime: number): void;
    private startCountdown;
}
//# sourceMappingURL=GameRoom.d.ts.map