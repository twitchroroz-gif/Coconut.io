import { Schema, type } from "@colyseus/schema";

export class Bush extends Schema {
  @type("string") id: string = "";
  @type("float32") x: number = 0;
  @type("float32") y: number = 0;
  @type("float32") radius: number = 40; // Default bush size
}
