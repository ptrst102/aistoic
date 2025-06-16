import type { Thunder, Metagross } from '@/types'
import type { BattleState, PokemonBattleState } from './battleState'
import { determineTurnOrder } from './turnOrder'
import { checkFlinch, updateSleepTurns, applyStatusCondition } from './statusEffects'
import { applyItemEffects } from './itemEffects'
import { executeThunderTurn, executeMetagrossTurn } from './damagePhase'

/**
 * バトル結果の型定義
 */
export interface BattleResult {
  winner: 'thunder' | 'metagross'
  turns: number
  winReason?: 'damage' | 'struggle' | 'other'
  thunderFlinched?: boolean
  metagrossFlinched?: boolean
  thunderParalyzed?: boolean
  metagrossParalyzed?: boolean
}

/**
 * バトル状態の初期化
 */
const initializeBattleState = (thunder: Thunder, metagross: Metagross): BattleState => {
  if (!thunder.stats || !metagross.stats) {
    throw new Error('ステータスが計算されていません')
  }

  return {
    thunder: {
      currentHP: thunder.stats.hp,
      maxHP: thunder.stats.hp,
      status: 'none',
      sleepTurns: 0,
      hasUsedLumBerry: false,
      hasUsedSitrusBerry: false,
      hasUsedPinchBerry: false,
      statBoosts: {
        attack: 0,
        defense: 0,
        spAttack: 0,
        spDefense: 0,
        speed: 0,
      },
    },
    metagross: {
      currentHP: metagross.stats.hp,
      maxHP: metagross.stats.hp,
      status: 'none',
      sleepTurns: 0,
      hasUsedLumBerry: false,
      hasUsedSitrusBerry: false,
      hasUsedPinchBerry: false,
      statBoosts: {
        attack: 0,
        defense: 0,
        spAttack: 0,
        spDefense: 0,
        speed: 0,
      },
    },
  }
}

/**
 * 勝敗判定
 */
const checkBattleEnd = (state: BattleState): 'thunder' | 'metagross' | null => {
  if (state.thunder.currentHP <= 0) return 'metagross'
  if (state.metagross.currentHP <= 0) return 'thunder'
  return null
}

/**
 * ターン開始時の処理
 */
const processTurnStart = (state: BattleState, thunder: Thunder, metagross: Metagross): BattleState => {
  // たべのこしの回復（ターン開始時）
  const updatedState = { ...state }
  
  if (thunder.item === 'たべのこし') {
    const healAmount = Math.floor(updatedState.thunder.maxHP / 16)
    updatedState.thunder.currentHP = Math.min(
      updatedState.thunder.currentHP + healAmount,
      updatedState.thunder.maxHP
    )
  }
  
  if (metagross.item === 'たべのこし') {
    const healAmount = Math.floor(updatedState.metagross.maxHP / 16)
    updatedState.metagross.currentHP = Math.min(
      updatedState.metagross.currentHP + healAmount,
      updatedState.metagross.maxHP
    )
  }
  
  // ねむりターンの更新
  return {
    ...updatedState,
    thunder: updateSleepTurns(updatedState.thunder),
    metagross: updateSleepTurns(updatedState.metagross)
  }
}

/**
 * ターン終了時の処理
 */
const processTurnEnd = (state: BattleState, thunder: Thunder, metagross: Metagross): BattleState => {
  return {
    ...state,
    thunder: applyItemEffects(state.thunder, thunder),
    metagross: applyItemEffects(state.metagross, metagross)
  }
}

/**
 * 1対1のバトルをシミュレート
 */
export const simulateBattle = (
  thunder: Thunder,
  metagross: Metagross,
): BattleResult => {
  let state = initializeBattleState(thunder, metagross)
  let turns = 0
  const maxTurns = 100 // 無限ループ防止
  
  // 詳細情報の記録
  let thunderEverFlinched = false
  let metagrossEverFlinched = false
  let thunderEverParalyzed = false
  let metagrossEverParalyzed = false
  let winReason: 'damage' | 'struggle' | 'other' = 'damage'

  while (turns < maxTurns) {
    turns++
    
    // ターン開始時の処理
    state = processTurnStart(state, thunder, metagross)

    // 行動順の決定
    const moveOrder = determineTurnOrder(thunder, metagross, state)
    let thunderFlinched = false
    const metagrossFlinched = false

    if (moveOrder === 'thunder') {
      // サンダーが先制
      const thunderResult = executeThunderTurn(thunder, metagross, state, thunderFlinched)
      
      // ダメージの適用
      state = {
        ...state,
        metagross: {
          ...state.metagross,
          currentHP: Math.max(0, state.metagross.currentHP - thunderResult.damage)
        }
      }

      // オボンのみの即時発動チェック（ダメージを受けた直後）
      if (metagross.item === 'オボンのみ' && !state.metagross.hasUsedSitrusBerry) {
        const afterDamageHP = state.metagross.currentHP
        const maxHP = state.metagross.maxHP
        if (afterDamageHP > 0 && afterDamageHP <= maxHP / 2) {
          state = {
            ...state,
            metagross: {
              ...state.metagross,
              currentHP: Math.min(afterDamageHP + 30, maxHP),
              hasUsedSitrusBerry: true
            }
          }
        }
      }

      // 麻痺の付与
      if (thunderResult.causedParalysis) {
        state = {
          ...state,
          metagross: applyStatusCondition(state.metagross, 'paralysis')
        }
        metagrossEverParalyzed = true
        
        // ラムのみの即時発動チェック（麻痺になった直後）
        if (metagross.item === 'ラムのみ' && !state.metagross.hasUsedLumBerry && state.metagross.status === 'paralysis') {
          state = {
            ...state,
            metagross: {
              ...state.metagross,
              status: 'none',
              hasUsedLumBerry: true
            }
          }
        }
      }

      // メタグロスが倒れたらバトル終了
      const winner = checkBattleEnd(state)
      if (winner) {
        return { winner, turns }
      }

      // メタグロスの攻撃（まだ生きている場合）
      const metagrossResult = executeMetagrossTurn(thunder, metagross, state, metagrossFlinched)
      
      // ダメージの適用
      state = {
        ...state,
        thunder: {
          ...state.thunder,
          currentHP: Math.max(0, state.thunder.currentHP - metagrossResult.damage)
        }
      }

      // オボンのみの即時発動チェック（ダメージを受けた直後）
      if (thunder.item === 'オボンのみ' && !state.thunder.hasUsedSitrusBerry) {
        const afterDamageHP = state.thunder.currentHP
        const maxHP = state.thunder.maxHP
        if (afterDamageHP > 0 && afterDamageHP <= maxHP / 2) {
          state = {
            ...state,
            thunder: {
              ...state.thunder,
              currentHP: Math.min(afterDamageHP + 30, maxHP),
              hasUsedSitrusBerry: true
            }
          }
        }
      }
    } else {
      // メタグロスが先制
      const metagrossResult = executeMetagrossTurn(thunder, metagross, state, metagrossFlinched)
      
      // ダメージの適用
      state = {
        ...state,
        thunder: {
          ...state.thunder,
          currentHP: Math.max(0, state.thunder.currentHP - metagrossResult.damage)
        }
      }

      // オボンのみの即時発動チェック（ダメージを受けた直後）
      if (thunder.item === 'オボンのみ' && !state.thunder.hasUsedSitrusBerry) {
        const afterDamageHP = state.thunder.currentHP
        const maxHP = state.thunder.maxHP
        if (afterDamageHP > 0 && afterDamageHP <= maxHP / 2) {
          state = {
            ...state,
            thunder: {
              ...state.thunder,
              currentHP: Math.min(afterDamageHP + 30, maxHP),
              hasUsedSitrusBerry: true
            }
          }
        }
      }

      // サンダーが倒れたらバトル終了
      const winner = checkBattleEnd(state)
      if (winner) {
        return { winner, turns }
      }

      // ひるみ判定（メタグロスが先制した場合のみ）
      if (metagrossResult.damage > 0 && checkFlinch(30)) {
        thunderFlinched = true
        thunderEverFlinched = true
      }

      // サンダーの攻撃（ひるまず、まだ生きている場合）
      const thunderResult = executeThunderTurn(thunder, metagross, state, thunderFlinched)
      
      // ダメージの適用
      state = {
        ...state,
        metagross: {
          ...state.metagross,
          currentHP: Math.max(0, state.metagross.currentHP - thunderResult.damage)
        }
      }

      // オボンのみの即時発動チェック（ダメージを受けた直後）
      if (metagross.item === 'オボンのみ' && !state.metagross.hasUsedSitrusBerry) {
        const afterDamageHP = state.metagross.currentHP
        const maxHP = state.metagross.maxHP
        if (afterDamageHP > 0 && afterDamageHP <= maxHP / 2) {
          state = {
            ...state,
            metagross: {
              ...state.metagross,
              currentHP: Math.min(afterDamageHP + 30, maxHP),
              hasUsedSitrusBerry: true
            }
          }
        }
      }

      // 麻痺の付与
      if (thunderResult.causedParalysis) {
        state = {
          ...state,
          metagross: applyStatusCondition(state.metagross, 'paralysis')
        }
        metagrossEverParalyzed = true
        
        // ラムのみの即時発動チェック（麻痺になった直後）
        if (metagross.item === 'ラムのみ' && !state.metagross.hasUsedLumBerry && state.metagross.status === 'paralysis') {
          state = {
            ...state,
            metagross: {
              ...state.metagross,
              status: 'none',
              hasUsedLumBerry: true
            }
          }
        }
      }
    }

    // ターン終了時の処理
    state = processTurnEnd(state, thunder, metagross)

    // 勝敗判定
    const winner = checkBattleEnd(state)
    if (winner) {
      return {
        winner,
        turns,
        winReason,
        thunderFlinched: thunderEverFlinched,
        metagrossFlinched: metagrossEverFlinched,
        thunderParalyzed: thunderEverParalyzed,
        metagrossParalyzed: metagrossEverParalyzed,
      }
    }
  }

  // タイムアウト（わるあがきで決着をつける）
  winReason = 'struggle'
  return state.thunder.currentHP > state.metagross.currentHP 
    ? {
        winner: 'thunder',
        turns,
        winReason,
        thunderFlinched: thunderEverFlinched,
        metagrossFlinched: metagrossEverFlinched,
        thunderParalyzed: thunderEverParalyzed,
        metagrossParalyzed: metagrossEverParalyzed,
      }
    : {
        winner: 'metagross',
        turns,
        winReason,
        thunderFlinched: thunderEverFlinched,
        metagrossFlinched: metagrossEverFlinched,
        thunderParalyzed: thunderEverParalyzed,
        metagrossParalyzed: metagrossEverParalyzed,
      }
}