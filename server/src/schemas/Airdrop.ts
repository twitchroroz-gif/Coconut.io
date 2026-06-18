import { Schema, type } from "@colyseus/schema";

export class Airdrop extends Schema {
  @type("string") id: string = "";
  @type("float32") x: number = 0;
  @type("float32") y: number = 0;
  @type("number") landedAt: number = 0; // When it finishes falling
  @type("boolean") isLanded: boolean = false;
}
