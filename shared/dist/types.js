// ============================================================
// CoconutClash — Shared Types
// Enums, input structures, and message types used by both
// the server and client.
// ============================================================
export var GamePhase;
(function (GamePhase) {
    GamePhase[GamePhase["WAITING"] = 0] = "WAITING";
    GamePhase[GamePhase["COUNTDOWN"] = 1] = "COUNTDOWN";
    GamePhase[GamePhase["PLAYING"] = 2] = "PLAYING";
    GamePhase[GamePhase["GAME_OVER"] = 3] = "GAME_OVER";
})(GamePhase || (GamePhase = {}));
export var WeaponType;
(function (WeaponType) {
    WeaponType["NONE"] = "none";
    WeaponType["SLINGSHOT"] = "slingshot";
    WeaponType["BLOWGUN"] = "blowgun";
    WeaponType["MACHETE"] = "machete";
})(WeaponType || (WeaponType = {}));
export var ItemType;
(function (ItemType) {
    ItemType["SLINGSHOT"] = "slingshot";
    ItemType["BLOWGUN"] = "blowgun";
    ItemType["MACHETE"] = "machete";
    ItemType["SHIELD"] = "shield";
    ItemType["COCONUT"] = "coconut";
})(ItemType || (ItemType = {}));
/** Loot spawn weights — how likely each item type is to appear */
export const LOOT_WEIGHTS = {
    [ItemType.SLINGSHOT]: 30,
    [ItemType.BLOWGUN]: 15,
    [ItemType.MACHETE]: 20,
    [ItemType.SHIELD]: 15,
    [ItemType.COCONUT]: 20,
};
//# sourceMappingURL=types.js.map