import type { Thunder, Metagross } from '@/types'
import type { BattleState } from './battleState'
import { random } from '@/utils/random'

/**
 * せんせいのツメの発動判定
 */
export const checkQuickClaw = (): boolean => {
  return random() < 0.2
}

/**
 * 行動順を決定する
 */
export const determineTurnOrder = (
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

  // 素早さによる判定（麻痺とカムラのみの影響を考慮）
  let thunderSpeed = thunder.stats.speed
  let metagrossSpeed = metagross.stats.speed

  if (battleState.thunder.status === 'paralysis') {
    thunderSpeed = Math.floor(thunderSpeed / 4)
  }
  if (battleState.metagross.status === 'paralysis') {
    metagrossSpeed = Math.floor(metagrossSpeed / 4)
  }

  // カムラのみの効果を適用
  if (battleState.thunder.statBoosts.speed > 0) {
    thunderSpeed = Math.floor(thunderSpeed * 1.5)
  }
  if (battleState.metagross.statBoosts.speed > 0) {
    metagrossSpeed = Math.floor(metagrossSpeed * 1.5)
  }

  return thunderSpeed >= metagrossSpeed ? 'thunder' : 'metagross'
}