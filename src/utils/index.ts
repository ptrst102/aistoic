// ダメージ計算関連
export {
  calculateDamage,
  calculateModifiers,
  generateRandomValue,
  isCriticalHit,
} from "./damage";

// ステータス計算関連
export { calculateStats, calculateTotalEVs } from "./stats";

// バトルシミュレーション関連
export { simulateBattle } from "./battle";

// モンテカルロシミュレーション関連
export {
  calculateWinRate,
  calculateWinRatesAgainstAllPresets,
  calculateWinRateAgainstCustom,
  getWinRateColorClass,
  getItemDescription,
} from "./simulation";

// 努力値最適化関連
export {
  getOptimalEv,
  checkAllEvWaste,
  getTotalEvWaste,
} from "./evOptimization";

// 努力値計算関連
export { calculateEvFromStat, getStatRange } from "./evCalculation";

// バトル分析関連
export { analyzeBattle } from "./battleAnalysis";
