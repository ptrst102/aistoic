/**
 * バトル分析結果の型定義
 */
export interface BattleAnalysis {
  /** 勝率（パーセンテージ） */
  winRate: number
  /** 平均ターン数 */
  averageTurns: number
  /** 最短ターン数 */
  minTurns: number
  /** 最長ターン数 */
  maxTurns: number
  /** 勝因の内訳 */
  winReasons: {
    /** 通常の攻撃による勝利 */
    byDamage: number
    /** わるあがきによる勝利 */
    byStruggle: number
    /** その他（相手の反動ダメージなど） */
    byOther: number
  }
  /** 負け因の内訳 */
  lossReasons: {
    /** 通常の攻撃による敗北 */
    byDamage: number
    /** わるあがきによる敗北 */
    byStruggle: number
    /** その他 */
    byOther: number
  }
  /** 主要な行動パターン */
  actionPatterns: {
    /** サンダーがひるんだ回数の平均 */
    thunderFlinchRate: number
    /** メタグロスがひるんだ回数の平均 */
    metagrossFlinchRate: number
    /** サンダーがまひした割合 */
    thunderParalyzedRate: number
    /** メタグロスがまひした割合 */
    metagrossParalyzedRate: number
  }
}