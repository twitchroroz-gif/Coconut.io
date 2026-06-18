"use strict";
// ============================================================
// CoconutClash — Shared Constants
// All game balance values, map dimensions, and timing in one place.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSS_COLORS = exports.COLORS = exports.COCONUT_USE_TIME_MS = exports.COCONUT_HEAL_AMOUNT = exports.SHIELD_MAX_HP = exports.MELEE_ARC_DEGREES = exports.PROJECTILE_LIFETIME_MS = exports.MAX_LOOT_ON_MAP = exports.LOOT_RESPAWN_INTERVAL_SEC = exports.INITIAL_LOOT_COUNT = exports.MAX_PLAYERS = exports.MIN_PLAYERS_TO_START = exports.LOBBY_COUNTDOWN_SEC = exports.ZONE_DAMAGE_PER_SEC = exports.ZONE_INITIAL_RADIUS = exports.ZONE_PHASES = exports.PLAYER_PICKUP_RANGE = exports.PLAYER_MAX_HP = exports.PLAYER_RADIUS = exports.PLAYER_SPEED = exports.SERVER_PORT = exports.SERVER_TICK_MS = exports.SERVER_TICK_RATE = exports.ISLAND_RADIUS = exports.MAP_CENTER_Y = exports.MAP_CENTER_X = exports.MAP_HEIGHT = exports.MAP_WIDTH = void 0;
// --- Map ---
exports.MAP_WIDTH = 4000;
exports.MAP_HEIGHT = 4000;
exports.MAP_CENTER_X = exports.MAP_WIDTH / 2;
exports.MAP_CENTER_Y = exports.MAP_HEIGHT / 2;
// Island is a circle inscribed in the map
exports.ISLAND_RADIUS = 1800;
// --- Server ---
exports.SERVER_TICK_RATE = 20; // ticks per second
exports.SERVER_TICK_MS = 1000 / exports.SERVER_TICK_RATE; // 50ms
exports.SERVER_PORT = 2567;
// --- Player ---
exports.PLAYER_SPEED = 200; // units per second
exports.PLAYER_RADIUS = 16;
exports.PLAYER_MAX_HP = 100;
exports.PLAYER_PICKUP_RANGE = 50;
// --- Zone shrink phases ---
// Each phase: [delay before shrink starts (sec), shrink duration (sec), target radius]
exports.ZONE_PHASES = [
    { delay: 30, shrinkDuration: 30, targetRadius: 1400 }, // Phase 1: gentle
    { delay: 20, shrinkDuration: 25, targetRadius: 900 }, // Phase 2
    { delay: 15, shrinkDuration: 20, targetRadius: 500 }, // Phase 3
    { delay: 10, shrinkDuration: 15, targetRadius: 200 }, // Phase 4
    { delay: 8, shrinkDuration: 10, targetRadius: 50 }, // Phase 5: final
];
exports.ZONE_INITIAL_RADIUS = exports.ISLAND_RADIUS;
exports.ZONE_DAMAGE_PER_SEC = [5, 8, 12, 18, 25]; // damage per phase index
// --- Game phases ---
exports.LOBBY_COUNTDOWN_SEC = 5;
exports.MIN_PLAYERS_TO_START = 2;
exports.MAX_PLAYERS = 50;
// --- Loot ---
exports.INITIAL_LOOT_COUNT = 80;
exports.LOOT_RESPAWN_INTERVAL_SEC = 15;
exports.MAX_LOOT_ON_MAP = 120;
// --- Combat ---
exports.PROJECTILE_LIFETIME_MS = 2000;
exports.MELEE_ARC_DEGREES = 90;
exports.SHIELD_MAX_HP = 50;
exports.COCONUT_HEAL_AMOUNT = 30;
exports.COCONUT_USE_TIME_MS = 2000;
// --- Colors (hex) ---
exports.COLORS = {
    sand: 0xF4E4BA,
    water: 0x5CC8D7,
    waterDeep: 0x3A9FB0,
    palmLeaves: 0x6BBF59,
    palmTrunk: 0xA0724A,
    accentCoral: 0xFF7043,
    accentYellow: 0xFFD54F,
    uiBg: 0x141E28,
    uiText: 0xF5F5F5,
    danger: 0xEF5350,
    healthFull: 0x66BB6A,
    healthLow: 0xEF5350,
    shield: 0x42A5F5,
};
// CSS string versions for HTML UI
exports.CSS_COLORS = {
    sand: '#F4E4BA',
    water: '#5CC8D7',
    waterDeep: '#3A9FB0',
    palmLeaves: '#6BBF59',
    palmTrunk: '#A0724A',
    accentCoral: '#FF7043',
    accentYellow: '#FFD54F',
    uiBg: 'rgba(20, 30, 40, 0.85)',
    uiText: '#F5F5F5',
    danger: '#EF5350',
    healthFull: '#66BB6A',
    healthLow: '#EF5350',
    shield: '#42A5F5',
};
//# sourceMappingURL=constants.js.map