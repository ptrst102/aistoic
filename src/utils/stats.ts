import { BASE_STATS, NATURE_MODIFIERS } from '@/constants'
import type { EVs, IVs, Nature, Species, Stats } from '@/types'

/**
 * HPの実数値を計算する（第三世代仕様）
 */
const calculateHP = (
  baseStat: number,
  iv: number,
  ev: number,
  level: number,
): number => {
  return Math.floor(
    Math.floor((baseStat * 2 + iv + Math.floor(ev / 4)) * level / 100) + 10 + level
  )
}

/**
 * HP以外のステータスの実数値を計算する（第三世代仕様）
 */
const calculateOtherStat = (
  baseStat: number,
  iv: number,
  ev: number,
  level: number,
  natureMod: number,
): number => {
  return Math.floor(
    (Math.floor((baseStat * 2 + iv + Math.floor(ev / 4)) * level / 100) + 5) * natureMod
  )
}

/**
 * ポケモンのステータスを計算する
 * @param species ポケモンの種族
 * @param level レベル
 * @param nature 性格
 * @param ivs 個体値
 * @param evs 努力値
 * @returns 計算されたステータス
 */
export const calculateStats = (
  species: Species,
  level: number,
  nature: Nature,
  ivs: IVs,
  evs: EVs,
): Stats => {
  const baseStats = BASE_STATS[species]
  const natureModifier = NATURE_MODIFIERS[nature]

  // HP計算
  const hp = calculateHP(baseStats.hp, ivs.hp, evs.hp, level)

  // その他のステータス計算
  const attack = calculateOtherStat(
    baseStats.attack,
    ivs.attack,
    evs.attack,
    level,
    natureModifier.up === 'attack' ? 1.1 : natureModifier.down === 'attack' ? 0.9 : 1.0,
  )

  const defense = calculateOtherStat(
    baseStats.defense,
    ivs.defense,
    evs.defense,
    level,
    natureModifier.up === 'defense' ? 1.1 : natureModifier.down === 'defense' ? 0.9 : 1.0,
  )

  const spAttack = calculateOtherStat(
    baseStats.spAttack,
    ivs.spAttack,
    evs.spAttack,
    level,
    natureModifier.up === 'spAttack' ? 1.1 : natureModifier.down === 'spAttack' ? 0.9 : 1.0,
  )

  const spDefense = calculateOtherStat(
    baseStats.spDefense,
    ivs.spDefense,
    evs.spDefense,
    level,
    natureModifier.up === 'spDefense' ? 1.1 : natureModifier.down === 'spDefense' ? 0.9 : 1.0,
  )

  const speed = calculateOtherStat(
    baseStats.speed,
    ivs.speed,
    evs.speed,
    level,
    natureModifier.up === 'speed' ? 1.1 : natureModifier.down === 'speed' ? 0.9 : 1.0,
  )

  return {
    hp,
    attack,
    defense,
    spAttack,
    spDefense,
    speed,
  }
}

/**
 * 努力値の合計を計算する
 */
export const calculateTotalEVs = (evs: EVs): number => {
  return evs.hp + evs.attack + evs.defense + evs.spAttack + evs.spDefense + evs.speed
}

/**
 * 努力値が有効な範囲内かチェックする
 */
export const isValidEVs = (evs: EVs): boolean => {
  // 各ステータスが0-252の範囲内かチェック
  const values = Object.values(evs)
  if (values.some(v => v < 0 || v > 252)) {
    return false
  }

  // 合計が510以下かチェック
  return calculateTotalEVs(evs) <= 510
}