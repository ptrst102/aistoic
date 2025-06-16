import type { StatusCondition, PokemonBattleState } from './battleState'
import type { Thunder, Metagross } from '@/types'

/**
 * オボンのみの発動処理
 */
export const checkSitrusBerry = (
  currentHP: number,
  maxHP: number,
  hasUsed: boolean,
): { shouldActivate: boolean; newHP: number } => {
  if (!hasUsed && currentHP <= maxHP / 2) {
    return {
      shouldActivate: true,
      newHP: Math.min(currentHP + 30, maxHP),
    }
  }
  return { shouldActivate: false, newHP: currentHP }
}

/**
 * ラムのみの発動処理
 */
export const checkLumBerry = (
  status: StatusCondition,
  hasUsed: boolean,
): { shouldActivate: boolean; newStatus: StatusCondition } => {
  if (!hasUsed && status === 'paralysis') {
    return {
      shouldActivate: true,
      newStatus: 'none',
    }
  }
  return { shouldActivate: false, newStatus: status }
}

/**
 * たべのこしの回復処理
 */
export const applyLeftovers = (currentHP: number, maxHP: number): number => {
  const healAmount = Math.floor(maxHP / 16)
  return Math.min(currentHP + healAmount, maxHP)
}

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
    return { shouldActivate: false, stat: null }
  }

  switch (item) {
    case 'ヤタピのみ':
      return { shouldActivate: true, stat: 'spAttack' }
    case 'チイラのみ':
      return { shouldActivate: true, stat: 'attack' }
    case 'カムラのみ':
      return { shouldActivate: true, stat: 'speed' }
    default:
      return { shouldActivate: false, stat: null }
  }
}

/**
 * もちもの効果の適用
 * @param pokemonState ポケモンの戦闘状態
 * @param pokemon ポケモンデータ
 * @returns 更新後の戦闘状態
 */
export const applyItemEffects = (
  pokemonState: PokemonBattleState,
  pokemon: Thunder | Metagross
): PokemonBattleState => {
  let updatedState = { ...pokemonState }

  // オボンのみ
  if (pokemon.item === 'オボンのみ') {
    const sitrus = checkSitrusBerry(
      updatedState.currentHP,
      updatedState.maxHP,
      updatedState.hasUsedSitrusBerry
    )
    if (sitrus.shouldActivate) {
      updatedState = {
        ...updatedState,
        currentHP: sitrus.newHP,
        hasUsedSitrusBerry: true
      }
    }
  }

  // ラムのみ
  if (pokemon.item === 'ラムのみ') {
    const lum = checkLumBerry(updatedState.status, updatedState.hasUsedLumBerry)
    if (lum.shouldActivate) {
      updatedState = {
        ...updatedState,
        status: lum.newStatus,
        hasUsedLumBerry: true
      }
    }
  }

  // ピンチきのみ
  const pinch = checkPinchBerry(
    updatedState.currentHP,
    updatedState.maxHP,
    pokemon.item,
    updatedState.hasUsedPinchBerry
  )
  if (pinch.shouldActivate && pinch.stat) {
    updatedState = {
      ...updatedState,
      hasUsedPinchBerry: true,
      statBoosts: {
        ...updatedState.statBoosts,
        [pinch.stat]: 1
      }
    }
  }

  // たべのこしはターン開始時に処理するため、ここでは処理しない

  return updatedState
}