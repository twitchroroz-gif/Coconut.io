import { WeaponType } from './types';
export interface WeaponDefinition {
    type: WeaponType;
    name: string;
    isMelee: boolean;
    damage: number;
    cooldownMs: number;
    range: number;
    speed: number;
}
export declare const WEAPONS: Record<WeaponType, WeaponDefinition>;
//# sourceMappingURL=weapons.d.ts.map