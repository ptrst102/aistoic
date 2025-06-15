import type { Metagross, Thunder } from '@/types'

/**
 * ダメージ計算に必要な補正値を計算する
 */
export const calculateModifiers = (
  attacker: Thunder | Metagross,
  defender: Thunder | Metagross,
  moveType: 'electric' | 'rock',
  moveCategory: 'physical' | 'special',
) => {
  let modifier = 1.0

  // タイプ一致ボーナス
  if (
    (attacker.species === 'サンダー' && moveType === 'electric') ||
    (attacker.species === 'メタグロス' && moveType === 'rock')
  ) {
    modifier *= 1.5
  }

  // タイプ相性
  if (moveType === 'rock' && defender.species === 'サンダー') {
    modifier *= 2.0 // いわ→ひこう（ばつぐん）
  }
  // でんき→はがね/エスパーは等倍なので1.0のまま

  // 持ち物補正
  if (attacker.item === 'じしゃく' && moveType === 'electric') {
    modifier *= 1.1
  }
  if (attacker.item === 'こだわりハチマキ' && moveCategory === 'physical') {
    modifier *= 1.5
  }

  return modifier
}

/**
 * 第三世代のダメージ計算式に基づいてダメージを計算する
 * @param attacker 攻撃側のポケモン
 * @param defender 防御側のポケモン
 * @param movePower 技の威力
 * @param moveCategory 技の分類（物理/特殊）
 * @param moveType 技のタイプ
 * @param isCritical 急所判定
 * @param randomValue 乱数値（0.85-1.00）
 * @returns 計算されたダメージ
 */
export const calculateDamage = (
  attacker: Thunder | Metagross,
  defender: Thunder | Metagross,
  movePower: number,
  moveCategory: 'physical' | 'special',
  moveType: 'electric' | 'rock',
  isCritical: boolean,
  randomValue: number,
): number => {
  if (!attacker.stats || !defender.stats) {
    throw new Error('ステータスが計算されていません')
  }

  const level = attacker.level
  const attack =
    moveCategory === 'physical' ? attacker.stats.attack : attacker.stats.spAttack
  const defense =
    moveCategory === 'physical' ? defender.stats.defense : defender.stats.spDefense

  // 基本ダメージ計算
  let damage = Math.floor(
    Math.floor((Math.floor((level * 2) / 5 + 2) * movePower * attack) / defense) / 50 + 2,
  )

  // 各種補正を適用
  const modifiers = calculateModifiers(attacker, defender, moveType, moveCategory)
  damage = Math.floor(damage * modifiers)

  // 乱数補正
  damage = Math.floor(damage * randomValue)

  // 急所補正
  if (isCritical) {
    damage *= 2
  }

  // 最低でも1ダメージ
  return Math.max(1, damage)
}

/**
 * 急所判定（1/16の確率）
 */
export const isCriticalHit = (): boolean => {
  return Math.random() < 1 / 16
}

/**
 * ダメージ乱数を生成（0.85-1.00の16段階）
 */
export const generateRandomValue = (): number => {
  const randomIndex = Math.floor(Math.random() * 16)
  return (85 + randomIndex) / 100
}