"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEAPONS = void 0;
const types_1 = require("./types");
exports.WEAPONS = {
    [types_1.WeaponType.NONE]: {
        type: types_1.WeaponType.NONE,
        name: 'Unarmed',
        isMelee: true,
        damage: 5,
        cooldownMs: 800,
        range: 40,
        speed: 0,
    },
    [types_1.WeaponType.SLINGSHOT]: {
        type: types_1.WeaponType.SLINGSHOT,
        name: 'Fronde',
        isMelee: false,
        damage: 15,
        cooldownMs: 500, // 2 shots per second
        range: 400,
        speed: 600, // projectile speed
    },
    [types_1.WeaponType.BLOWGUN]: {
        type: types_1.WeaponType.BLOWGUN,
        name: 'Sarbacane',
        isMelee: false,
        damage: 25,
        cooldownMs: 1000, // 1 shot per second
        range: 600,
        speed: 1000, // fast projectile
    },
    [types_1.WeaponType.MACHETE]: {
        type: types_1.WeaponType.MACHETE,
        name: 'Machette',
        isMelee: true,
        damage: 35,
        cooldownMs: 600,
        range: 60,
        speed: 0,
    },
};
//# sourceMappingURL=weapons.js.map