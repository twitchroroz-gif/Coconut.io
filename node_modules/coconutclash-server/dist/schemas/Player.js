var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Schema, type } from "@colyseus/schema";
import { WeaponType } from "coconutclash-shared";
export class Player extends Schema {
    constructor() {
        super(...arguments);
        this.name = "Anonymous";
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.hp = 100;
        this.maxHp = 100;
        this.alive = true;
        this.weaponType = WeaponType.NONE;
        this.shieldHp = 0;
        this.kills = 0;
        this.inputX = 0;
        this.inputY = 0;
        // To handle client-side reconciliation
        this.lastProcessedSeq = 0;
    }
}
__decorate([
    type("string"),
    __metadata("design:type", String)
], Player.prototype, "name", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], Player.prototype, "x", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], Player.prototype, "y", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], Player.prototype, "angle", void 0);
__decorate([
    type("int16"),
    __metadata("design:type", Number)
], Player.prototype, "hp", void 0);
__decorate([
    type("int16"),
    __metadata("design:type", Number)
], Player.prototype, "maxHp", void 0);
__decorate([
    type("boolean"),
    __metadata("design:type", Boolean)
], Player.prototype, "alive", void 0);
__decorate([
    type("string"),
    __metadata("design:type", String)
], Player.prototype, "weaponType", void 0);
__decorate([
    type("int16"),
    __metadata("design:type", Number)
], Player.prototype, "shieldHp", void 0);
__decorate([
    type("int16"),
    __metadata("design:type", Number)
], Player.prototype, "kills", void 0);
__decorate([
    type("number"),
    __metadata("design:type", Number)
], Player.prototype, "inputX", void 0);
__decorate([
    type("number"),
    __metadata("design:type", Number)
], Player.prototype, "inputY", void 0);
__decorate([
    type("int32"),
    __metadata("design:type", Number)
], Player.prototype, "lastProcessedSeq", void 0);
//# sourceMappingURL=Player.js.map