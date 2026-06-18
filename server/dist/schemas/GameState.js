var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "./Player";
import { LootItem } from "./LootItem";
import { Projectile } from "./Projectile";
import { GamePhase, MAP_CENTER_X, MAP_CENTER_Y, ZONE_INITIAL_RADIUS } from "coconutclash-shared";
export class GameState extends Schema {
    constructor() {
        super(...arguments);
        this.players = new MapSchema();
        this.lootItems = new ArraySchema();
        this.projectiles = new ArraySchema();
        this.zoneRadius = ZONE_INITIAL_RADIUS;
        this.zoneCenterX = MAP_CENTER_X;
        this.zoneCenterY = MAP_CENTER_Y;
        this.zoneTargetRadius = ZONE_INITIAL_RADIUS;
        this.phase = GamePhase.WAITING;
        this.aliveCount = 0;
        this.elapsedTime = 0;
        // To handle game loop timing
        this.phaseTimer = 0;
    }
}
__decorate([
    type({ map: Player }),
    __metadata("design:type", Object)
], GameState.prototype, "players", void 0);
__decorate([
    type([LootItem]),
    __metadata("design:type", Object)
], GameState.prototype, "lootItems", void 0);
__decorate([
    type([Projectile]),
    __metadata("design:type", Object)
], GameState.prototype, "projectiles", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], GameState.prototype, "zoneRadius", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], GameState.prototype, "zoneCenterX", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], GameState.prototype, "zoneCenterY", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], GameState.prototype, "zoneTargetRadius", void 0);
__decorate([
    type("number"),
    __metadata("design:type", Number)
], GameState.prototype, "phase", void 0);
__decorate([
    type("int16"),
    __metadata("design:type", Number)
], GameState.prototype, "aliveCount", void 0);
__decorate([
    type("number"),
    __metadata("design:type", Number)
], GameState.prototype, "elapsedTime", void 0);
__decorate([
    type("number"),
    __metadata("design:type", Number)
], GameState.prototype, "phaseTimer", void 0);
//# sourceMappingURL=GameState.js.map