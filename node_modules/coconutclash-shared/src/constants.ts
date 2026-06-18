// ============================================================
// CoconutClash — Shared Constants
// All game balance values, map dimensions, and timing in one place.
// ============================================================

// --- Map ---
export const MAP_WIDTH = 4000;
export const MAP_HEIGHT = 4000;
export const MAP_CENTER_X = MAP_WIDTH / 2;
export const MAP_CENTER_Y = MAP_HEIGHT / 2;

// Island is a circle inscribed in the map
export const ISLAND_RADIUS = 1800;

// --- Server ---
export const SERVER_TICK_RATE = 20; // ticks per second
export const SERVER_TICK_MS = 1000 / SERVER_TICK_RATE; // 50ms
export const SERVER_PORT = 2567;

// Matchmaking
export const TARGET_PLAYERS = 10;
export const LOBBY_WAIT_TIME_SEC = 20;

// --- Player ---
export const PLAYER_SPEED = 240; // units per second (slightly faster for fluidity)
export const PLAYER_RADIUS = 16;
export const PLAYER_MAX_HP = 100;
export const PLAYER_PICKUP_RANGE = 50;

// --- Zone shrink phases ---
// Each phase: [delay before shrink starts (sec), shrink duration (sec), target radius]
export const ZONE_PHASES: Array<{ delay: number; shrinkDuration: number; targetRadius: number }> = [
  { delay: 60, shrinkDuration: 60, targetRadius: 1400 },  // Phase 1: gentle
  { delay: 45, shrinkDuration: 45, targetRadius: 900 },   // Phase 2
  { delay: 30, shrinkDuration: 30, targetRadius: 500 },   // Phase 3
  { delay: 20, shrinkDuration: 20, targetRadius: 200 },   // Phase 4
  { delay: 10, shrinkDuration: 15, targetRadius: 50 },    // Phase 5: final
];

export const ZONE_INITIAL_RADIUS = ISLAND_RADIUS;
export const ZONE_DAMAGE_PER_SEC = [5, 8, 12, 18, 25]; // damage per phase index

// --- Game phases ---
export const LOBBY_COUNTDOWN_SEC = 5;
export const MIN_PLAYERS_TO_START = 2;
export const MAX_PLAYERS = 50;

// --- Loot ---
export const INITIAL_LOOT_COUNT = 40;
export const LOOT_RESPAWN_INTERVAL_SEC = 20;
export const MAX_LOOT_ON_MAP = 60;

// --- Combat ---
export const PROJECTILE_LIFETIME_MS = 2000;
export const MELEE_ARC_DEGREES = 90;
export const SHIELD_MAX_HP = 50;
export const COCONUT_HEAL_AMOUNT = 30;
export const COCONUT_USE_TIME_MS = 2000;

// --- Colors (hex) ---
export const COLORS = {
  sand:         0xE2C792, // Darker sand for better contrast
  water:        0x5CC8D7,
  waterDeep:    0x3A9FB0,
  palmLeaves:   0x3A7A2D, // Deep tropical green
  palmTrunk:    0x6B4423,
  rock:         0x7D8285, // Gray for rocks
  accentCoral:  0xFF7043,
  accentYellow: 0xFFD54F,
  projectile:   0x00E5FF, // Neon Cyan for projectiles
  uiBg:         0x141E28,
  uiText:       0xF5F5F5,
  danger:       0xEF5350,
  healthFull:   0x66BB6A,
  healthLow:    0xEF5350,
  shield:       0x42A5F5,
} as const;

// CSS string versions for HTML UI
export const CSS_COLORS = {
  sand:         '#F4E4BA',
  water:        '#5CC8D7',
  waterDeep:    '#3A9FB0',
  palmLeaves:   '#6BBF59',
  palmTrunk:    '#A0724A',
  accentCoral:  '#FF7043',
  accentYellow: '#FFD54F',
  uiBg:         'rgba(20, 30, 40, 0.85)',
  uiText:       '#F5F5F5',
  danger:       '#EF5350',
  healthFull:   '#66BB6A',
  healthLow:    '#EF5350',
  shield:       '#42A5F5',
} as const;
