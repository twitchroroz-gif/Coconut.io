import { Room } from "colyseus";
import { GameState } from "../schemas/GameState";
import { Player } from "../schemas/Player";
import { ZoneSystem } from "../game/ZoneSystem";
import { LootSystem } from "../game/LootSystem";
import { CombatSystem } from "../game/CombatSystem";
import { BotSystem } from "../game/BotSystem";
import { AirdropSystem } from "../game/AirdropSystem";
import { Bush } from "../schemas/Bush";
import { Obstacle } from "../schemas/Obstacle";
import { SERVER_TICK_MS, GamePhase, MAX_PLAYERS, TARGET_PLAYERS, LOBBY_WAIT_TIME_SEC, LOBBY_COUNTDOWN_SEC, MAP_WIDTH, MAP_HEIGHT, PLAYER_SPEED, PLAYER_MAX_HP } from "coconutclash-shared";
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
        this.botSystem = new BotSystem(this.state, this.combatSystem);
        this.airdropSystem = new AirdropSystem(this.state, this.lootSystem);
        this.state.phase = GamePhase.WAITING;
        this.state.phaseTimer = LOBBY_WAIT_TIME_SEC;
        // Generate Bushes
        for (let i = 0; i < 30; i++) {
            const bush = new Bush();
            bush.id = `bush_${i}`;
            bush.x = Math.random() * (MAP_WIDTH - 200) + 100;
            bush.y = Math.random() * (MAP_HEIGHT - 200) + 100;
            bush.radius = 60; // larger radius to hide player
            this.state.bushes.push(bush);
        }
        // Generate Obstacles (Rocks and Palms)
        const OBSTACLE_COUNT = 80;
        for (let i = 0; i < OBSTACLE_COUNT; i++) {
            const isRock = Math.random() > 0.5;
            const obs = new Obstacle();
            obs.id = `obs_${i}`;
            // Place randomly within the island radius roughly
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (MAP_WIDTH / 2 - 200); // Inner island
            obs.x = (MAP_WIDTH / 2) + Math.cos(angle) * radius;
            obs.y = (MAP_HEIGHT / 2) + Math.sin(angle) * radius;
            obs.radius = isRock ? (25 + Math.random() * 20) : (15 + Math.random() * 5); // Trunk radius for palms
            obs.type = isRock ? "ROCK" : "PALM";
            this.state.obstacles.push(obs);
        }
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
        if (this.state.phase === GamePhase.WAITING && this.state.aliveCount >= TARGET_PLAYERS) {
            this.startCountdown();
        }
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
        // Handle Game Phases
        if (this.state.phase === GamePhase.WAITING) {
            this.state.phaseTimer -= dtSeconds;
            if (this.state.phaseTimer <= 0) {
                this.startCountdown();
            }
            return; // Do not update game logic in lobby
        }
        else if (this.state.phase === GamePhase.COUNTDOWN) {
            this.state.phaseTimer -= dtSeconds;
            if (this.state.phaseTimer <= 0) {
                this.zoneSystem.startGame();
            }
            return; // Do not update game logic during countdown
        }
        else if (this.state.phase === GamePhase.GAME_OVER) {
            // Do nothing, wait for room disposal or players to leave
            return;
        }
        // Update systems
        this.zoneSystem.update(dtSeconds);
        this.lootSystem.update(dtSeconds);
        this.botSystem.update(dtSeconds);
        this.combatSystem.update(dtSeconds);
        this.airdropSystem.update(dtSeconds);
        // Check Victory Condition (Top 1)
        if (this.state.aliveCount <= 1 && this.state.phase === GamePhase.PLAYING) {
            this.state.phase = GamePhase.GAME_OVER;
            // Let clients know, then dispose the room after 10 seconds
            setTimeout(() => {
                this.disconnect();
            }, 10000);
            return;
        }
        // Process movement
        this.state.players.forEach((player, sessionId) => {
            if (player.alive) {
                // Normalize movement vector if moving diagonally
                let length = Math.sqrt(player.inputX * player.inputX + player.inputY * player.inputY);
                if (length > 0) {
                    const normX = player.inputX / length;
                    const normY = player.inputY / length;
                    const nextX = player.x + normX * PLAYER_SPEED * dtSeconds;
                    const nextY = player.y + normY * PLAYER_SPEED * dtSeconds;
                    // Obstacle Collision
                    let hitObs = false;
                    for (let i = 0; i < this.state.obstacles.length; i++) {
                        const obs = this.state.obstacles[i];
                        if (!obs)
                            continue;
                        const distSq = Math.pow(nextX - obs.x, 2) + Math.pow(nextY - obs.y, 2);
                        // Player radius is roughly 16. We use obs.radius + 16 for collision
                        if (distSq < Math.pow(obs.radius + 16, 2)) {
                            hitObs = true;
                            break;
                        }
                    }
                    if (!hitObs) {
                        player.x = nextX;
                        player.y = nextY;
                    }
                    else {
                        // Slide along the obstacle? For simplicity, just block for now, or allow partial axis movement
                        // Simple block:
                    }
                }
                // Clamp to map boundaries
                player.x = Math.max(0, Math.min(MAP_WIDTH, player.x));
                player.y = Math.max(0, Math.min(MAP_HEIGHT, player.y));
                // Auto-pickup loot
                this.lootSystem.handlePickup(sessionId);
                // Check bushes
                let hiding = false;
                for (let i = 0; i < this.state.bushes.length; i++) {
                    const bush = this.state.bushes[i];
                    if (!bush)
                        continue;
                    const distSq = Math.pow(player.x - bush.x, 2) + Math.pow(player.y - bush.y, 2);
                    if (distSq < bush.radius * bush.radius) {
                        hiding = true;
                        break;
                    }
                }
                player.inBush = hiding;
            }
        });
    }
    startCountdown() {
        if (this.state.phase === GamePhase.WAITING) {
            this.state.phase = GamePhase.COUNTDOWN;
            this.state.phaseTimer = LOBBY_COUNTDOWN_SEC;
            const BOT_NAMES = ["CocoCrusher", "TropicalTerror", "PalmPuncher", "SandSniper", "BeachBum", "IslandInvader", "MonkeyMan", "CaptainHook", "SaltyDog", "TikiTorch"];
            // Fill missing slots with bots
            const botsToAdd = TARGET_PLAYERS - this.state.aliveCount;
            for (let i = 0; i < botsToAdd; i++) {
                const bot = new Player();
                bot.isBot = true;
                bot.name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
                bot.x = Math.random() * (MAP_WIDTH - 400) + 200;
                bot.y = Math.random() * (MAP_HEIGHT - 400) + 200;
                bot.hp = PLAYER_MAX_HP;
                bot.maxHp = PLAYER_MAX_HP;
                this.state.players.set(`bot_${Math.random().toString(36).substring(7)}`, bot);
                this.state.aliveCount++;
            }
        }
    }
}
//# sourceMappingURL=GameRoom.js.map