import type { PokemonBattleState } from "./battleState";
import { random } from "@/utils/random";

/**
 * まひの付与判定
 * @param chance まひ付与確率(%)
 */
export const checkParalysis = (chance: number): boolean => {
  return random() < chance / 100;
};

/**
 * ひるみの判定
 * @param chance ひるみ確率(%)
 */
export const checkFlinch = (chance: number): boolean => {
  return random() < chance / 100;
};

/**
 * まひによる行動不能判定
 */
export const isParalyzedImmobile = (): boolean => {
  return random() < 0.25;
};

/**
 * 状態異常の付与
 * @param pokemonState ポケモンの戦闘状態
 * @param status 付与する状態異常
 * @returns 更新後の戦闘状態
 */
export const applyStatusCondition = (
  pokemonState: PokemonBattleState,
  status: "paralysis",
): PokemonBattleState => {
  // 既に状態異常の場合は付与しない
  if (pokemonState.status !== "none") {
    return pokemonState;
  }

  return {
    ...pokemonState,
    status,
  };
};
