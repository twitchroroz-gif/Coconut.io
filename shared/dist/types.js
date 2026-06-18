"use strict";
// ============================================================
// CoconutClash — Shared Types
// Enums, input structures, and message types used by both
// the server and client.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOOT_WEIGHTS = exports.ItemType = exports.WeaponType = exports.GamePhase = void 0;
var GamePhase;
(function (GamePhase) {
    GamePhase[GamePhase["WAITING"] = 0] = "WAITING";
    GamePhase[GamePhase["COUNTDOWN"] = 1] = "COUNTDOWN";
    GamePhase[GamePhase["PLAYING"] = 2] = "PLAYING";
    GamePhase[GamePhase["ENDED"] = 3] = "ENDED";
})(GamePhase || (exports.GamePhase = GamePhase = {}));
var WeaponType;
(function (WeaponType) {
    WeaponType["NONE"] = "none";
    WeaponType["SLINGSHOT"] = "slingshot";
    WeaponType["BLOWGUN"] = "blowgun";
    WeaponType["MACHETE"] = "machete";
})(WeaponType || (exports.WeaponType = WeaponType = {}));
var ItemType;
(function (ItemType) {
    ItemType["SLINGSHOT"] = "slingshot";
    ItemType["BLOWGUN"] = "blowgun";
    ItemType["MACHETE"] = "machete";
    ItemType["SHIELD"] = "shield";
    ItemType["COCONUT"] = "coconut";
})(ItemType || (exports.ItemType = ItemType = {}));
/** Loot spawn weights — how likely each item type is to appear */
exports.LOOT_WEIGHTS = {
    [ItemType.SLINGSHOT]: 30,
    [ItemType.BLOWGUN]: 15,
    [ItemType.MACHETE]: 20,
    [ItemType.SHIELD]: 15,
    [ItemType.COCONUT]: 20,
};
//# sourceMappingURL=types.js.map