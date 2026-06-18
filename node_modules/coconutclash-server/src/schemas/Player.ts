import { Schema, type } from "@colyseus/schema";
import { WeaponType } from "coconutclash-shared";

export class Player extends Schema {
  @type("string") name: string = "Anonymous";
  @type("float32") x: number = 0;
  @type("float32") y: number = 0;
  @type("float32") angle: number = 0;
  @type("int16") hp: number = 100;
  @type("int16") maxHp: number = 100;
  @type("boolean") alive: boolean = true;
  @type("string") weaponType: string = WeaponType.NONE;
  @type("int16") shieldHp: number = 0;
  @type("int16") kills: number = 0;
  @type("number") inputX: number = 0;
  @type("number") inputY: number = 0;
  
  @type("boolean") isBot: boolean = false;
  @type("boolean") inBush: boolean = false;

  // To handle client-side reconciliation
  @type("int32") lastProcessedSeq: number = 0;
}
