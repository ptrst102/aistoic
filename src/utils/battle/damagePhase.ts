import type { Thunder, Metagross } from "@/types";
import type { BattleState } from "./battleState";
import {
  calculateDamage,
  generateRandomValue,
  isCriticalHit,
} from "@/utils/damage";
import {
  checkParalysis,
  isParalyzedImmobile,
  checkFlinch,
} from "./statusEffects";
import { random } from "@/utils/random";

/**
 * わざの命中判定
 */
export const checkAccuracy = (
  accuracy: number,
  defenderItem: string | undefined,
): boolean => {
  let finalAccuracy = accuracy;
  if (defenderItem === "ひかりのこな") {
    finalAccuracy *= 0.9;
  }
  return random() < finalAccuracy / 100;
};

/**
 * サンダーのターン処理
 */
export const executeThunderTurn = (
  thunder: Thunder,
  metagross: Metagross,
  state: BattleState,
  isFlinched: boolean,
): { damage: number; causedParalysis: boolean } => {
  if (!thunder.stats || !metagross.stats) {
    throw new Error("ステータスが計算されていません");
  }

  // ひるみチェック
  if (isFlinched) {
    return { damage: 0, causedParalysis: false };
  }

  // ねむりチェック
  if (state.thunder.status === "sleep") {
    return { damage: 0, causedParalysis: false };
  }

  // まひによる行動不能チェック
  if (state.thunder.status === "paralysis" && isParalyzedImmobile()) {
    return { damage: 0, causedParalysis: false };
  }

  // でんき技の使用
  const moveData =
    thunder.electricMove === "10まんボルト"
      ? { power: 95, accuracy: 100, paralysisChance: 10 }
      : { power: 120, accuracy: 70, paralysisChance: 30 };

  // 命中判定
  if (!checkAccuracy(moveData.accuracy, metagross.item)) {
    return { damage: 0, causedParalysis: false };
  }

  // ダメージ計算（ヤタピのみの効果を考慮）
  const isCritical = isCriticalHit();
  const randomValue = generateRandomValue();

  // ヤタピのみの効果を適用したサンダーを作成
  let modifiedThunder = thunder;
  if (state.thunder.statBoosts.spAttack > 0) {
    modifiedThunder = {
      ...thunder,
      stats: {
        ...thunder.stats,
        spAttack: Math.floor(thunder.stats.spAttack * 1.5),
      },
    };
  }

  const damage = calculateDamage(
    modifiedThunder,
    metagross,
    moveData.power,
    "special",
    "electric",
    isCritical,
    randomValue,
  );

  // まひ判定
  const causedParalysis =
    state.metagross.status === "none" &&
    checkParalysis(moveData.paralysisChance);

  return { damage, causedParalysis };
};

/**
 * メタグロスのターン処理
 */
export const executeMetagrossTurn = (
  thunder: Thunder,
  metagross: Metagross,
  state: BattleState,
  isFlinched: boolean,
): { damage: number; causedFlinch: boolean } => {
  if (!thunder.stats || !metagross.stats) {
    throw new Error("ステータスが計算されていません");
  }

  // ひるみチェック
  if (isFlinched) {
    return { damage: 0, causedFlinch: false };
  }

  // ねむりチェック（メタグロスはねむらないが、将来の拡張のため）
  if (state.metagross.status === "sleep") {
    return { damage: 0, causedFlinch: false };
  }

  // まひによる行動不能チェック
  if (state.metagross.status === "paralysis" && isParalyzedImmobile()) {
    return { damage: 0, causedFlinch: false };
  }

  // いわなだれの使用
  const moveData = { power: 75, accuracy: 90, flinchChance: 30 };

  // 命中判定
  if (!checkAccuracy(moveData.accuracy, thunder.item)) {
    return { damage: 0, causedFlinch: false };
  }

  // ダメージ計算（チイラのみの効果を考慮）
  const isCritical = isCriticalHit();
  const randomValue = generateRandomValue();

  // チイラのみの効果を適用したメタグロスを作成
  let modifiedMetagross = metagross;
  if (state.metagross.statBoosts.attack > 0) {
    modifiedMetagross = {
      ...metagross,
      stats: {
        ...metagross.stats,
        attack: Math.floor(metagross.stats.attack * 1.5),
      },
    };
  }

  const damage = calculateDamage(
    modifiedMetagross,
    thunder,
    moveData.power,
    "physical",
    "rock",
    isCritical,
    randomValue,
  );

  // ひるみ判定（先制時のみ）
  const causedFlinch = false; // この時点では判定しない（ターンの最初に行動順を決めてから判定）

  return { damage, causedFlinch };
};
