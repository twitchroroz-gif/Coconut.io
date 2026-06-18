import { Schema, type } from "@colyseus/schema";

export class Obstacle extends Schema {
  @type("string") id: string = "";
  @type("float32") x: number = 0;
  @type("float32") y: number = 0;
  @type("float32") radius: number = 0;
  @type("string") type: string = "ROCK"; // "ROCK" or "PALM"
}
