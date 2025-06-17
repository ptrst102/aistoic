import type { Metagross, Thunder } from "@/types";
import { random } from "@/utils/random";

/**
 * ダメージ計算に必要な補正値を計算する
 */
export const calculateModifiers = (
  attacker: Thunder | Metagross,
  defender: Thunder | Metagross,
  moveType: "electric" | "rock",
  moveCategory: "physical" | "special",
) => {
  const stab =
    "electricMove" in attacker && moveType === "electric" ? 1.5 : 1.0;
  // いわなだれ→サンダーは2倍、それ以外は等倍（固定）
  const typeEffectiveness = moveType === "rock" ? 2.0 : 1.0;
  const itemBonus = (() => {
    if (attacker.item === "じしゃく" && moveType === "electric") return 1.1;
    if (attacker.item === "かたいいし" && moveType === "rock") return 1.1;
    if (attacker.item === "こだわりハチマキ" && moveCategory === "physical")
      return 1.5;
    return 1.0;
  })();

  return stab * typeEffectiveness * itemBonus;
};

/**
 * 第三世代のダメージ計算式に基づいてダメージを計算する
 * @param attacker 攻撃側のポケモン
 * @param defender 防御側のポケモン
 * @param movePower わざの威力
 * @param moveCategory わざの分類（物理/特殊）
 * @param moveType 技のタイプ
 * @param isCritical 急所判定
 * @param randomValue 乱数値（0.85-1.00）
 * @returns 計算されたダメージ
 */
export const calculateDamage = (
  attacker: Thunder | Metagross,
  defender: Thunder | Metagross,
  movePower: number,
  moveCategory: "physical" | "special",
  moveType: "electric" | "rock",
  isCritical: boolean,
  randomValue: number,
): number => {
  if (!attacker.stats || !defender.stats) {
    throw new Error("ステータスが計算されていません");
  }

  const level = 50; // 固定レベル
  const attack =
    moveCategory === "physical"
      ? attacker.stats.attack
      : attacker.stats.spAttack;
  const defense =
    moveCategory === "physical"
      ? defender.stats.defense
      : defender.stats.spDefense;

  // 基本ダメージ計算
  const baseDamage = Math.floor(
    Math.floor(
      (Math.floor((level * 2) / 5 + 2) * movePower * attack) / defense,
    ) /
      50 +
      2,
  );

  // 各種補正を適用
  const modifiers = calculateModifiers(
    attacker,
    defender,
    moveType,
    moveCategory,
  );
  const modifiedDamage = Math.floor(baseDamage * modifiers);

  // 乱数補正
  const randomizedDamage = Math.floor(modifiedDamage * randomValue);

  // 急所補正
  const finalDamage = isCritical ? randomizedDamage * 2 : randomizedDamage;

  // 最低でも1ダメージ
  return Math.max(1, finalDamage);
};

/**
 * 急所判定（1/16の確率）
 */
export const isCriticalHit = (): boolean => {
  return random() < 1 / 16;
};

/**
 * ダメージ乱数を生成（0.85-1.00の16段階）
 */
export const generateRandomValue = (): number => {
  const randomIndex = Math.floor(random() * 16);
  return (85 + randomIndex) / 100;
};
