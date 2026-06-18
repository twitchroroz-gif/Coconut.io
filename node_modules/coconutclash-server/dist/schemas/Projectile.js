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
export class Projectile extends Schema {
    constructor() {
        super(...arguments);
        this.id = "";
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.speed = 0;
        this.damage = 0;
        this.ownerId = "";
        this.createdAt = 0;
    }
}
__decorate([
    type("string"),
    __metadata("design:type", String)
], Projectile.prototype, "id", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], Projectile.prototype, "x", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], Projectile.prototype, "y", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], Projectile.prototype, "angle", void 0);
__decorate([
    type("float32"),
    __metadata("design:type", Number)
], Projectile.prototype, "speed", void 0);
__decorate([
    type("int16"),
    __metadata("design:type", Number)
], Projectile.prototype, "damage", void 0);
__decorate([
    type("string"),
    __metadata("design:type", String)
], Projectile.prototype, "ownerId", void 0);
__decorate([
    type("number"),
    __metadata("design:type", Number)
], Projectile.prototype, "createdAt", void 0);
//# sourceMappingURL=Projectile.js.map