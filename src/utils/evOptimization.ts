import { calculateStats } from "./stats";
import type { EVs, IVs, Nature, Species } from "@/types";

/**
 * 努力値に無駄があるかチェックし、最適値を提案する
 * @param species ポケモンの種族
 * @param level レベル
 * @param nature 性格
 * @param ivs 個体値
 * @param evs 努力値
 * @param stat チェックするステータス
 * @returns 無駄がある場合は最適値、ない場合はnull
 */
export const getOptimalEv = (
  species: Species,
  level: number,
  nature: Nature,
  ivs: IVs,
  evs: EVs,
  stat: keyof EVs,
): number | null => {
  const currentEv = evs[stat];
  if (currentEv === 0) return null;

  // 現在の実数値を計算
  const currentStats = calculateStats(species, level, nature, ivs, evs);
  const currentValue = currentStats[stat];

  // 努力値を減らしながら実数値が変わらないところを探す
  const evCandidates = Array.from(
    { length: Math.floor(currentEv / 4) + 1 },
    (_, i) => currentEv - i * 4,
  ).filter((ev) => ev >= 0);

  const optimalEv = evCandidates.reduce((optimal, ev) => {
    const testEvs = { ...evs, [stat]: ev };
    const testStats = calculateStats(species, level, nature, ivs, testEvs);
    return testStats[stat] === currentValue ? ev : optimal;
  }, currentEv);

  // 無駄がある場合のみ返す
  return optimalEv < currentEv ? optimalEv : null;
};

/**
 * 全ステータスの努力値の無駄をチェック
 */
export const checkAllEvWaste = (
  species: Species,
  level: number,
  nature: Nature,
  ivs: IVs,
  evs: EVs,
): Record<keyof EVs, number | null> => {
  const stats = [
    "hp",
    "attack",
    "defense",
    "spAttack",
    "spDefense",
    "speed",
  ] as const;

  const result = {} as Record<keyof EVs, number | null>;

  for (const stat of stats) {
    result[stat] = getOptimalEv(species, level, nature, ivs, evs, stat);
  }

  return result;
};

/**
 * 努力値の無駄の合計を計算
 */
export const getTotalEvWaste = (
  species: Species,
  level: number,
  nature: Nature,
  ivs: IVs,
  evs: EVs,
): number => {
  const wasteCheck = checkAllEvWaste(species, level, nature, ivs, evs);

  return Object.entries(wasteCheck).reduce((totalWaste, [stat, optimal]) => {
    if (optimal !== null) {
      return totalWaste + (evs[stat as keyof EVs] - optimal);
    }
    return totalWaste;
  }, 0);
};
