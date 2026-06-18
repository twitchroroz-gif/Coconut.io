import { WeaponType } from './types';

export interface WeaponDefinition {
  type: WeaponType;
  name: string;
  isMelee: boolean;
  damage: number;
  cooldownMs: number;
  range: number;      // Max distance the projectile travels, or melee reach
  speed: number;      // Projectile speed (0 for melee)
}

export const WEAPONS: Record<WeaponType, WeaponDefinition> = {
  [WeaponType.NONE]: {
    type: WeaponType.NONE,
    name: 'Unarmed',
    isMelee: true,
    damage: 5,
    cooldownMs: 800,
    range: 40,
    speed: 0,
  },
  [WeaponType.SLINGSHOT]: {
    type: WeaponType.SLINGSHOT,
    name: 'Fronde',
    isMelee: false,
    damage: 15,
    cooldownMs: 500, // 2 shots per second
    range: 400,
    speed: 600, // projectile speed
  },
  [WeaponType.BLOWGUN]: {
    type: WeaponType.BLOWGUN,
    name: 'Sarbacane',
    isMelee: false,
    damage: 25,
    cooldownMs: 1000, // 1 shot per second
    range: 600,
    speed: 1000, // fast projectile
  },
  [WeaponType.MACHETE]: {
    type: WeaponType.MACHETE,
    name: 'Machette',
    isMelee: true,
    damage: 35,
    cooldownMs: 600,
    range: 60,
    speed: 0,
  },
};
