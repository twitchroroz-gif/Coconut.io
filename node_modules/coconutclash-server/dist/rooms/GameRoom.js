import { Room } from "colyseus";
import { GameState } from "../schemas/GameState";
import { Player } from "../schemas/Player";
import { ZoneSystem } from "../game/ZoneSystem";
import { LootSystem } from "../game/LootSystem";
import { CombatSystem } from "../game/CombatSystem";
import { SERVER_TICK_MS, MAX_PLAYERS, MAP_WIDTH, MAP_HEIGHT, PLAYER_SPEED, PLAYER_MAX_HP } from "coconutclash-shared";
export class GameRoom extends Room {
    constructor() {
        super(...arguments);
        this.maxClients = MAX_PLAYERS;
    }
    onCreate(options) {
        this.setState(new GameState());
        this.zoneSystem = new ZoneSystem(this.state);
        this.lootSystem = new LootSystem(this.state);
        this.combatSystem = new CombatSystem(this.state);
        // Auto-start for now when room is created. In a full version, we'd wait for players.
        this.zoneSystem.startGame();
        // Input message handler
        this.onMessage("input", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (player && player.alive) {
                player.inputX = (data.right ? 1 : 0) - (data.left ? 1 : 0);
                player.inputY = (data.down ? 1 : 0) - (data.up ? 1 : 0);
                player.angle = data.angle;
                player.lastProcessedSeq = data.seq;
                if (data.shoot) {
                    this.combatSystem.handleShoot(client.sessionId);
                }
                // Handle pickup (in a real game, this might be a specific button, or automatic)
                // Let's make it automatic if they are close, or trigger on a flag. We'll check it here.
                this.lootSystem.handlePickup(client.sessionId);
            }
        });
        // Run game loop
        this.setSimulationInterval((deltaTime) => this.update(deltaTime), SERVER_TICK_MS);
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const player = new Player();
        // Spawn player in a random spot for now
        player.x = Math.random() * (MAP_WIDTH - 200) + 100;
        player.y = Math.random() * (MAP_HEIGHT - 200) + 100;
        player.name = options.name || "Anonymous";
        player.hp = PLAYER_MAX_HP;
        player.maxHp = PLAYER_MAX_HP;
        this.state.players.set(client.sessionId, player);
        this.state.aliveCount++;
    }
    onLeave(client, consented) {
        console.log(client.sessionId, "left!");
        const player = this.state.players.get(client.sessionId);
        if (player && player.alive) {
            player.alive = false;
            this.state.aliveCount--;
        }
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log("Room disposed.");
    }
    update(deltaTime) {
        const dtSeconds = deltaTime / 1000;
        // Update systems
        this.zoneSystem.update(dtSeconds);
        this.lootSystem.update(dtSeconds);
        this.combatSystem.update(dtSeconds);
        // Process movement
        this.state.players.forEach((player) => {
            if (player.alive) {
                // Normalize movement vector if moving diagonally
                let length = Math.sqrt(player.inputX * player.inputX + player.inputY * player.inputY);
                if (length > 0) {
                    const normX = player.inputX / length;
                    const normY = player.inputY / length;
                    player.x += normX * PLAYER_SPEED * dtSeconds;
                    player.y += normY * PLAYER_SPEED * dtSeconds;
                }
                // Clamp to map boundaries
                player.x = Math.max(0, Math.min(MAP_WIDTH, player.x));
                player.y = Math.max(0, Math.min(MAP_HEIGHT, player.y));
            }
        });
    }
}
//# sourceMappingURL=GameRoom.js.map