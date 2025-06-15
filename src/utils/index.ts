// ダメージ計算関連
export {
  calculateDamage,
  calculateModifiers,
  generateRandomValue,
  isCriticalHit,
} from './damage'

// ステータス計算関連
export { calculateStats, calculateTotalEVs, isValidEVs } from './stats'

// バトルシミュレーション関連
export { simulateBattle } from './battle'

// モンテカルロシミュレーション関連
export {
  calculateWinRate,
  calculateWinRatesAgainstAllPresets,
  calculateWinRateAgainstCustom,
  getWinRateColorClass,
  getItemDescription,
} from './simulation'