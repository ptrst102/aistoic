/**
 * 乱数生成器のインターフェース
 */
export interface RandomNumberGenerator {
  /**
   * 0以上1未満の乱数を生成
   */
  random(): number
  
  /**
   * 指定範囲の整数乱数を生成（min以上max以下）
   */
  randomInt(min: number, max: number): number
}

/**
 * Math.randomを使用するデフォルトの乱数生成器
 */
export class DefaultRandom implements RandomNumberGenerator {
  random(): number {
    return Math.random()
  }
  
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

/**
 * シード付き乱数生成器（Linear Congruential Generator）
 */
export class SeededRandom implements RandomNumberGenerator {
  private seed: number
  
  constructor(seed: number) {
    this.seed = seed
  }
  
  random(): number {
    // Linear Congruential Generator (LCG)
    // パラメータは Numerical Recipes より
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32
    
    this.seed = (a * this.seed + c) % m
    return this.seed / m
  }
  
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min
  }
}

/**
 * グローバルな乱数生成器インスタンス
 */
let globalRng: RandomNumberGenerator = new DefaultRandom()

/**
 * 乱数生成器を設定
 */
export const setRandomNumberGenerator = (rng: RandomNumberGenerator): void => {
  globalRng = rng
}

/**
 * 現在の乱数生成器を取得
 */
export const getRandomNumberGenerator = (): RandomNumberGenerator => {
  return globalRng
}

/**
 * 0以上1未満の乱数を生成（グローバル関数）
 */
export const random = (): number => {
  return globalRng.random()
}

/**
 * 指定範囲の整数乱数を生成（グローバル関数）
 */
export const randomInt = (min: number, max: number): number => {
  return globalRng.randomInt(min, max)
}