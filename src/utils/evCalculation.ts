import { BASE_STATS, NATURE_MODIFIERS } from '@/constants'
import type { IVs, Nature, Species } from '@/types'

/**
 * 実数値から必要な努力値を逆算する
 * @param species ポケモンの種族
 * @param level レベル
 * @param nature 性格
 * @param iv 個体値
 * @param stat ステータス名
 * @param targetValue 目標実数値
 * @returns 必要な努力値（0-252）、不可能な場合はnull
 */
export const calculateEvFromStat = (
  species: Species,
  level: number,
  nature: Nature,
  iv: number,
  stat: keyof IVs,
  targetValue: number
): number | null => {
  const baseStat = BASE_STATS[species][stat]
  const natureModifier = NATURE_MODIFIERS[nature]
  
  if (stat === 'hp') {
    // HP計算式の逆算
    // targetValue = floor((baseStat * 2 + iv + floor(ev / 4)) * level / 100) + 10 + level
    const evPart = ((targetValue - 10 - level) * 100 / level - baseStat * 2 - iv) * 4
    const ev = Math.ceil(evPart)
    
    // 努力値は0-252の範囲内である必要がある
    if (ev < 0 || ev > 252) return null
    
    // 計算結果を検証（実際にその努力値で目標値になるか）
    const actualValue = Math.floor(
      Math.floor((baseStat * 2 + iv + Math.floor(ev / 4)) * level / 100) + 10 + level
    )
    
    // 目標値に到達できない場合は、最も近い努力値を探す
    if (actualValue !== targetValue) {
      for (let testEv = Math.max(0, ev - 8); testEv <= Math.min(252, ev + 8); testEv += 4) {
        const testValue = Math.floor(
          Math.floor((baseStat * 2 + iv + Math.floor(testEv / 4)) * level / 100) + 10 + level
        )
        if (testValue === targetValue) {
          return testEv
        }
      }
      return null
    }
    
    return ev
  }
  
  // その他のステータス計算式の逆算
    const natureMod = natureModifier.up === stat ? 1.1 : natureModifier.down === stat ? 0.9 : 1.0
    
    // targetValue = floor((floor((baseStat * 2 + iv + floor(ev / 4)) * level / 100) + 5) * natureMod)
    const beforeNature = targetValue / natureMod
    const evPart = ((beforeNature - 5) * 100 / level - baseStat * 2 - iv) * 4
    const ev = Math.ceil(evPart)
    
    if (ev < 0 || ev > 252) return null
    
    // 計算結果を検証
    const actualValue = Math.floor(
      (Math.floor((baseStat * 2 + iv + Math.floor(ev / 4)) * level / 100) + 5) * natureMod
    )
    
    if (actualValue !== targetValue) {
      for (let testEv = Math.max(0, ev - 8); testEv <= Math.min(252, ev + 8); testEv += 4) {
        const testValue = Math.floor(
          (Math.floor((baseStat * 2 + iv + Math.floor(testEv / 4)) * level / 100) + 5) * natureMod
        )
        if (testValue === targetValue) {
          return testEv
        }
      }
      return null
    }
    
    return ev
}

/**
 * 指定されたステータスの最小・最大実数値を計算
 */
export const getStatRange = (
  species: Species,
  level: number,
  nature: Nature,
  iv: number,
  stat: keyof IVs
): { min: number; max: number } => {
  const baseStat = BASE_STATS[species][stat]
  const natureModifier = NATURE_MODIFIERS[nature]
  
  if (stat === 'hp') {
    const min = Math.floor(
      Math.floor((baseStat * 2 + iv + 0) * level / 100) + 10 + level
    )
    const max = Math.floor(
      Math.floor((baseStat * 2 + iv + 63) * level / 100) + 10 + level // 252/4 = 63
    )
    return { min, max }
  }
  
  const natureMod = natureModifier.up === stat ? 1.1 : natureModifier.down === stat ? 0.9 : 1.0
    const min = Math.floor(
      (Math.floor((baseStat * 2 + iv + 0) * level / 100) + 5) * natureMod
    )
    const max = Math.floor(
      (Math.floor((baseStat * 2 + iv + 63) * level / 100) + 5) * natureMod
    )
    return { min, max }
}