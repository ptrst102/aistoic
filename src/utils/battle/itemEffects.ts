import type { StatusCondition, PokemonBattleState } from "./battleState";
import type { Thunder, Metagross } from "@/types";

/**
 * オボンのみの発動処理
 */
export const checkSitrusBerry = (
  currentHP: number,
  maxHP: number,
  hasUsed: boolean,
): { shouldActivate: boolean; newHP: number } => {
  if (!hasUsed && currentHP > 0 && currentHP <= maxHP / 2) {
    return {
      shouldActivate: true,
      newHP: Math.min(currentHP + 30, maxHP),
    };
  }
  return { shouldActivate: false, newHP: currentHP };
};

/**
 * ラムのみの発動処理
 */
export const checkLumBerry = (
  status: StatusCondition,
  hasUsed: boolean,
): { shouldActivate: boolean; newStatus: StatusCondition } => {
  if (!hasUsed && status === "paralysis") {
    return {
      shouldActivate: true,
      newStatus: "none",
    };
  }
  return { shouldActivate: false, newStatus: status };
};

/**
 * たべのこしの回復処理
 */
export const applyLeftovers = (currentHP: number, maxHP: number): number => {
  const healAmount = Math.floor(maxHP / 16);
  return Math.min(currentHP + healAmount, maxHP);
};

/**
 * ピンチきのみの発動処理
 */
export const checkPinchBerry = (
  currentHP: number,
  maxHP: number,
  item: string,
  hasUsed: boolean,
): { shouldActivate: boolean; stat: string | null } => {
  if (hasUsed || currentHP > maxHP / 4) {
    return { shouldActivate: false, stat: null };
  }

  switch (item) {
    case "ヤタピのみ":
      return { shouldActivate: true, stat: "spAttack" };
    case "チイラのみ":
      return { shouldActivate: true, stat: "attack" };
    case "カムラのみ":
      return { shouldActivate: true, stat: "speed" };
    default:
      return { shouldActivate: false, stat: null };
  }
};

/**
 * オボンのみの即時処理（ダメージを受けた直後）
 * @param pokemonState ポケモンの戦闘状態
 * @param pokemon ポケモンデータ
 * @returns 更新後の戦闘状態
 */
export const applySitrusBerryImmediate = (
  pokemonState: PokemonBattleState,
  pokemon: Thunder | Metagross,
): PokemonBattleState => {
  if (pokemon.item === "オボンのみ" && !pokemonState.hasUsedSitrusBerry) {
    const afterDamageHP = pokemonState.currentHP;
    const maxHP = pokemonState.maxHP;
    if (afterDamageHP > 0 && afterDamageHP <= maxHP / 2) {
      return {
        ...pokemonState,
        currentHP: Math.min(afterDamageHP + 30, maxHP),
        hasUsedSitrusBerry: true,
      };
    }
  }
  return pokemonState;
};

/**
 * ラムのみの即時処理（状態異常になった直後）
 * @param pokemonState ポケモンの戦闘状態
 * @param pokemon ポケモンデータ
 * @returns 更新後の戦闘状態
 */
export const applyLumBerryImmediate = (
  pokemonState: PokemonBattleState,
  pokemon: Thunder | Metagross,
): PokemonBattleState => {
  if (
    pokemon.item === "ラムのみ" &&
    !pokemonState.hasUsedLumBerry &&
    pokemonState.status === "paralysis"
  ) {
    return {
      ...pokemonState,
      status: "none",
      hasUsedLumBerry: true,
    };
  }
  return pokemonState;
};

/**
 * ピンチきのみの効果を適用（ターン終了時）
 * @param pokemonState ポケモンの戦闘状態
 * @param pokemon ポケモンデータ
 * @returns 更新後の戦闘状態
 */
export const applyPinchBerryEffect = (
  pokemonState: PokemonBattleState,
  pokemon: Thunder | Metagross,
): PokemonBattleState => {
  const pinch = checkPinchBerry(
    pokemonState.currentHP,
    pokemonState.maxHP,
    pokemon.item,
    pokemonState.hasUsedPinchBerry,
  );

  if (pinch.shouldActivate && pinch.stat) {
    return {
      ...pokemonState,
      hasUsedPinchBerry: true,
      statBoosts: {
        ...pokemonState.statBoosts,
        [pinch.stat]: 1,
      },
    };
  }

  return pokemonState;
};
