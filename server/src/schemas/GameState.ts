import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "./Player";
import { LootItem } from "./LootItem";
import { Projectile } from "./Projectile";
import { Bush } from "./Bush";
import { Airdrop } from "./Airdrop";
import { Obstacle } from "./Obstacle";
import { GamePhase, MAP_CENTER_X, MAP_CENTER_Y, ZONE_INITIAL_RADIUS } from "coconutclash-shared";

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([LootItem]) lootItems = new ArraySchema<LootItem>();
  @type([Projectile]) projectiles = new ArraySchema<Projectile>();
  @type([Bush]) bushes = new ArraySchema<Bush>();
  @type([Airdrop]) airdrops = new ArraySchema<Airdrop>();
  @type([Obstacle]) obstacles = new ArraySchema<Obstacle>();
  
  @type("float32") zoneRadius: number = ZONE_INITIAL_RADIUS;
  @type("float32") zoneCenterX: number = MAP_CENTER_X;
  @type("float32") zoneCenterY: number = MAP_CENTER_Y;
  @type("float32") zoneTargetRadius: number = ZONE_INITIAL_RADIUS;
  
  @type("number") phase: number = GamePhase.WAITING;
  @type("int16") aliveCount: number = 0;
  @type("number") elapsedTime: number = 0;
  
  // To handle game loop timing
  @type("number") phaseTimer: number = 0;
}
