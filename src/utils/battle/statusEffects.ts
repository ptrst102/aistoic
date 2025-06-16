import type { PokemonBattleState } from './battleState'
import { random } from '@/utils/random'

/**
 * 麻痺の付与判定
 * @param chance 麻痺付与確率(%)
 */
export const checkParalysis = (chance: number): boolean => {
  return random() < chance / 100
}

/**
 * ひるみの判定
 * @param chance ひるみ確率(%)
 */
export const checkFlinch = (chance: number): boolean => {
  return random() < chance / 100
}

/**
 * 麻痺による行動不能判定
 */
export const isParalyzedImmobile = (): boolean => {
  return random() < 0.25
}

/**
 * ねむりターンの減少処理
 * @param pokemonState ポケモンの戦闘状態
 * @returns 更新後の戦闘状態
 */
export const updateSleepTurns = (pokemonState: PokemonBattleState): PokemonBattleState => {
  if (pokemonState.status === 'sleep' && pokemonState.sleepTurns > 0) {
    const newSleepTurns = pokemonState.sleepTurns - 1
    const newStatus = newSleepTurns === 0 ? 'none' : 'sleep'
    
    return {
      ...pokemonState,
      sleepTurns: newSleepTurns,
      status: newStatus
    }
  }
  
  return pokemonState
}

/**
 * 状態異常の付与
 * @param pokemonState ポケモンの戦闘状態
 * @param status 付与する状態異常
 * @param sleepTurns ねむりターン数（ねむりの場合のみ）
 * @returns 更新後の戦闘状態
 */
export const applyStatusCondition = (
  pokemonState: PokemonBattleState,
  status: 'paralysis' | 'sleep',
  sleepTurns?: number
): PokemonBattleState => {
  // 既に状態異常の場合は付与しない
  if (pokemonState.status !== 'none') {
    return pokemonState
  }
  
  return {
    ...pokemonState,
    status,
    sleepTurns: status === 'sleep' && sleepTurns ? sleepTurns : pokemonState.sleepTurns
  }
}