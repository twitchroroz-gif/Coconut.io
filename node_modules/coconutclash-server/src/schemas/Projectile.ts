import { Schema, type } from "@colyseus/schema";

export class Projectile extends Schema {
  @type("string") id: string = "";
  @type("float32") x: number = 0;
  @type("float32") y: number = 0;
  @type("float32") angle: number = 0;
  @type("float32") speed: number = 0;
  @type("int16") damage: number = 0;
  @type("string") ownerId: string = "";
  @type("number") createdAt: number = 0;
}
