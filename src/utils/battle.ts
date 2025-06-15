import type { Metagross, Thunder } from '@/types'
import { calculateDamage, generateRandomValue, isCriticalHit } from './damage'

// 状態異常の型定義
type StatusCondition = 'none' | 'paralysis' | 'sleep'

// バトル状態の型定義
interface BattleState {
  thunder: {
    currentHP: number
    maxHP: number
    status: StatusCondition
    sleepTurns: number
    hasUsedRest: boolean
    hasUsedLumBerry: boolean
    hasUsedSitrusBerry: boolean
  }
  metagross: {
    currentHP: number
    maxHP: number
    status: StatusCondition
    sleepTurns: number
    hasUsedLumBerry: boolean
    hasUsedSitrusBerry: boolean
  }
}

/**
 * 技の命中判定
 */
const checkAccuracy = (
  accuracy: number,
  defenderItem: string | undefined,
): boolean => {
  let finalAccuracy = accuracy
  if (defenderItem === 'ひかりのこな') {
    finalAccuracy *= 0.9
  }
  return Math.random() < finalAccuracy / 100
}

/**
 * 麻痺の判定
 */
const checkParalysis = (chance: number): boolean => {
  return Math.random() < chance / 100
}

/**
 * ひるみの判定
 */
const checkFlinch = (chance: number): boolean => {
  return Math.random() < chance / 100
}

/**
 * 麻痺による行動不能判定
 */
const isParalyzedImmobile = (): boolean => {
  return Math.random() < 0.25
}

/**
 * せんせいのツメの発動判定
 */
const checkQuickClaw = (): boolean => {
  return Math.random() < 0.2
}

/**
 * 行動順を決定する
 */
const determineTurnOrder = (
  thunder: Thunder,
  metagross: Metagross,
  battleState: BattleState,
): 'thunder' | 'metagross' => {
  if (!thunder.stats || !metagross.stats) {
    throw new Error('ステータスが計算されていません')
  }

  // せんせいのツメの判定
  const thunderQuickClaw = thunder.item === 'せんせいのツメ' && checkQuickClaw()
  const metagrossQuickClaw = metagross.item === 'せんせいのツメ' && checkQuickClaw()

  if (thunderQuickClaw && !metagrossQuickClaw) {
    return 'thunder'
  }
  if (!thunderQuickClaw && metagrossQuickClaw) {
    return 'metagross'
  }

  // 素早さによる判定（麻痺の影響を考慮）
  let thunderSpeed = thunder.stats.speed
  let metagrossSpeed = metagross.stats.speed

  if (battleState.thunder.status === 'paralysis') {
    thunderSpeed = Math.floor(thunderSpeed / 4)
  }
  if (battleState.metagross.status === 'paralysis') {
    metagrossSpeed = Math.floor(metagrossSpeed / 4)
  }

  return thunderSpeed >= metagrossSpeed ? 'thunder' : 'metagross'
}

/**
 * オボンのみの発動処理
 */
const checkSitrusBerry = (
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
const checkLumBerry = (
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
const applyLeftovers = (currentHP: number, maxHP: number): number => {
  const healAmount = Math.floor(maxHP / 16)
  return Math.min(currentHP + healAmount, maxHP)
}

/**
 * サンダーのターン処理
 */
const executeThunderTurn = (
  thunder: Thunder,
  metagross: Metagross,
  state: BattleState,
  isFlinched: boolean,
): { damage: number; causedParalysis: boolean } => {
  if (!thunder.stats || !metagross.stats) {
    throw new Error('ステータスが計算されていません')
  }

  // ひるみチェック
  if (isFlinched) {
    return { damage: 0, causedParalysis: false }
  }

  // ねむりチェック
  if (state.thunder.status === 'sleep') {
    return { damage: 0, causedParalysis: false }
  }

  // 麻痺による行動不能チェック
  if (state.thunder.status === 'paralysis' && isParalyzedImmobile()) {
    return { damage: 0, causedParalysis: false }
  }

  // ねむるの使用判定
  if (
    thunder.hasRest &&
    !state.thunder.hasUsedRest &&
    state.thunder.currentHP <= state.thunder.maxHP / 2 &&
    state.thunder.currentHP < state.thunder.maxHP
  ) {
    state.thunder.currentHP = state.thunder.maxHP
    state.thunder.status = 'sleep'
    state.thunder.sleepTurns = 2
    state.thunder.hasUsedRest = true
    return { damage: 0, causedParalysis: false }
  }

  // 電気技の使用
  const moveData = thunder.electricMove === '10まんボルト'
    ? { power: 95, accuracy: 100, paralysisChance: 10 }
    : { power: 120, accuracy: 70, paralysisChance: 30 }

  // 命中判定
  if (!checkAccuracy(moveData.accuracy, metagross.item)) {
    return { damage: 0, causedParalysis: false }
  }

  // ダメージ計算
  const isCritical = isCriticalHit()
  const randomValue = generateRandomValue()
  const damage = calculateDamage(
    thunder,
    metagross,
    moveData.power,
    'special',
    'electric',
    isCritical,
    randomValue,
  )

  // 麻痺判定
  const causedParalysis = state.metagross.status === 'none' && checkParalysis(moveData.paralysisChance)

  return { damage, causedParalysis }
}

/**
 * メタグロスのターン処理
 */
const executeMetagrossTurn = (
  thunder: Thunder,
  metagross: Metagross,
  state: BattleState,
  isFlinched: boolean,
): { damage: number; causedFlinch: boolean } => {
  if (!thunder.stats || !metagross.stats) {
    throw new Error('ステータスが計算されていません')
  }

  // ひるみチェック
  if (isFlinched) {
    return { damage: 0, causedFlinch: false }
  }

  // ねむりチェック（メタグロスはねむらないが、将来の拡張のため）
  if (state.metagross.status === 'sleep') {
    return { damage: 0, causedFlinch: false }
  }

  // 麻痺による行動不能チェック
  if (state.metagross.status === 'paralysis' && isParalyzedImmobile()) {
    return { damage: 0, causedFlinch: false }
  }

  // いわなだれの使用
  const moveData = { power: 75, accuracy: 90, flinchChance: 30 }

  // 命中判定
  if (!checkAccuracy(moveData.accuracy, thunder.item)) {
    return { damage: 0, causedFlinch: false }
  }

  // ダメージ計算
  const isCritical = isCriticalHit()
  const randomValue = generateRandomValue()
  const damage = calculateDamage(
    metagross,
    thunder,
    moveData.power,
    'physical',
    'rock',
    isCritical,
    randomValue,
  )

  // ひるみ判定（先制時のみ）
  const causedFlinch = false // この時点では判定しない（ターンの最初に行動順を決めてから判定）

  return { damage, causedFlinch }
}

/**
 * 1回のバトルシミュレーション
 * @returns サンダーが勝利したらtrue、メタグロスが勝利したらfalse
 */
export const simulateBattle = (thunder: Thunder, metagross: Metagross): boolean => {
  if (!thunder.stats || !metagross.stats) {
    throw new Error('ステータスが計算されていません')
  }

  // バトル状態の初期化
  const state: BattleState = {
    thunder: {
      currentHP: thunder.stats.hp,
      maxHP: thunder.stats.hp,
      status: 'none',
      sleepTurns: 0,
      hasUsedRest: false,
      hasUsedLumBerry: false,
      hasUsedSitrusBerry: false,
    },
    metagross: {
      currentHP: metagross.stats.hp,
      maxHP: metagross.stats.hp,
      status: 'none',
      sleepTurns: 0,
      hasUsedLumBerry: false,
      hasUsedSitrusBerry: false,
    },
  }

  // ターン制限（念のため無限ループ防止）
  const MAX_TURNS = 100

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    // ターン開始時の処理

    // たべのこしの回復（サンダーはたべのこしを持てないが、将来の拡張のため）
    // if (thunder.item === 'たべのこし') {
    //   state.thunder.currentHP = applyLeftovers(state.thunder.currentHP, state.thunder.maxHP)
    // }
    if (metagross.item === 'たべのこし') {
      state.metagross.currentHP = applyLeftovers(state.metagross.currentHP, state.metagross.maxHP)
    }

    // ねむりターンの減少
    if (state.thunder.status === 'sleep' && state.thunder.sleepTurns > 0) {
      state.thunder.sleepTurns--
      if (state.thunder.sleepTurns === 0) {
        state.thunder.status = 'none'
      }
    }
    if (state.metagross.status === 'sleep' && state.metagross.sleepTurns > 0) {
      state.metagross.sleepTurns--
      if (state.metagross.sleepTurns === 0) {
        state.metagross.status = 'none'
      }
    }

    // 行動順の決定
    const firstMover = determineTurnOrder(thunder, metagross, state)
    let thunderFlinched = false

    if (firstMover === 'thunder') {
      // サンダー先制
      const thunderResult = executeThunderTurn(thunder, metagross, state, false)
      state.metagross.currentHP -= thunderResult.damage

      // メタグロスのHP確認
      if (state.metagross.currentHP <= 0) {
        return true // サンダーの勝利
      }

      // オボンのみ発動判定
      const sitrusResult = checkSitrusBerry(
        state.metagross.currentHP,
        state.metagross.maxHP,
        state.metagross.hasUsedSitrusBerry,
      )
      if (sitrusResult.shouldActivate) {
        state.metagross.currentHP = sitrusResult.newHP
        state.metagross.hasUsedSitrusBerry = true
      }

      // 麻痺付与
      if (thunderResult.causedParalysis) {
        state.metagross.status = 'paralysis'
        // ラムのみ発動判定
        const lumResult = checkLumBerry(state.metagross.status, state.metagross.hasUsedLumBerry)
        if (lumResult.shouldActivate) {
          state.metagross.status = lumResult.newStatus
          state.metagross.hasUsedLumBerry = true
        }
      }

      // メタグロスのターン
      const metagrossResult = executeMetagrossTurn(thunder, metagross, state, false)
      state.thunder.currentHP -= metagrossResult.damage

      // サンダーのHP確認
      if (state.thunder.currentHP <= 0) {
        return false // メタグロスの勝利
      }

      // オボンのみ発動判定
      const thunderSitrusResult = checkSitrusBerry(
        state.thunder.currentHP,
        state.thunder.maxHP,
        state.thunder.hasUsedSitrusBerry,
      )
      if (thunderSitrusResult.shouldActivate) {
        state.thunder.currentHP = thunderSitrusResult.newHP
        state.thunder.hasUsedSitrusBerry = true
      }

    } else {
      // メタグロス先制
      const metagrossResult = executeMetagrossTurn(thunder, metagross, state, false)
      state.thunder.currentHP -= metagrossResult.damage

      // ひるみ判定（先制時のみ）
      if (metagrossResult.damage > 0 && checkFlinch(30)) {
        thunderFlinched = true
      }

      // サンダーのHP確認
      if (state.thunder.currentHP <= 0) {
        return false // メタグロスの勝利
      }

      // オボンのみ発動判定
      const sitrusResult = checkSitrusBerry(
        state.thunder.currentHP,
        state.thunder.maxHP,
        state.thunder.hasUsedSitrusBerry,
      )
      if (sitrusResult.shouldActivate) {
        state.thunder.currentHP = sitrusResult.newHP
        state.thunder.hasUsedSitrusBerry = true
      }

      // サンダーのターン（ひるみ状態を渡す）
      const thunderResult = executeThunderTurn(thunder, metagross, state, thunderFlinched)
      state.metagross.currentHP -= thunderResult.damage

      // メタグロスのHP確認
      if (state.metagross.currentHP <= 0) {
        return true // サンダーの勝利
      }

      // オボンのみ発動判定
      const metagrossSitrusResult = checkSitrusBerry(
        state.metagross.currentHP,
        state.metagross.maxHP,
        state.metagross.hasUsedSitrusBerry,
      )
      if (metagrossSitrusResult.shouldActivate) {
        state.metagross.currentHP = metagrossSitrusResult.newHP
        state.metagross.hasUsedSitrusBerry = true
      }

      // 麻痺付与
      if (thunderResult.causedParalysis) {
        state.metagross.status = 'paralysis'
        // ラムのみ発動判定
        const lumResult = checkLumBerry(state.metagross.status, state.metagross.hasUsedLumBerry)
        if (lumResult.shouldActivate) {
          state.metagross.status = lumResult.newStatus
          state.metagross.hasUsedLumBerry = true
        }
      }
    }
  }

  // ターン制限に達した場合（実際にはほぼ起こらない）
  return state.thunder.currentHP > state.metagross.currentHP
}