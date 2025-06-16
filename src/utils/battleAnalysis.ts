import type { Thunder, Metagross, BattleAnalysis } from '@/types'
import { simulateBattle } from './battle'

/**
 * バトルの詳細分析を行う
 * @param thunder サンダーのデータ
 * @param metagross メタグロスのデータ
 * @param iterations シミュレーション回数
 * @returns バトル分析結果
 */
export const analyzeBattle = (
  thunder: Thunder,
  metagross: Metagross,
  iterations = 10000,
): BattleAnalysis => {
  const results = Array.from({ length: iterations }, () => 
    simulateBattle(thunder, metagross)
  )
  
  // 勝率計算
  const wins = results.filter(r => r.winner === 'thunder').length
  const winRate = (wins / iterations) * 100
  
  // ターン数統計
  const turns = results.map(r => r.turns)
  const averageTurns = turns.reduce((sum, t) => sum + t, 0) / iterations
  const minTurns = Math.min(...turns)
  const maxTurns = Math.max(...turns)
  
  // 勝因・負け因の分析
  const thunderWins = results.filter(r => r.winner === 'thunder')
  const thunderLosses = results.filter(r => r.winner === 'metagross')
  
  const winReasons = {
    byDamage: thunderWins.filter(r => r.winReason === 'damage').length,
    byStruggle: thunderWins.filter(r => r.winReason === 'struggle').length,
    byOther: thunderWins.filter(r => r.winReason === 'other').length,
  }
  
  const lossReasons = {
    byDamage: thunderLosses.filter(r => r.winReason === 'damage').length,
    byStruggle: thunderLosses.filter(r => r.winReason === 'struggle').length,
    byOther: thunderLosses.filter(r => r.winReason === 'other').length,
  }
  
  // 行動パターンの分析
  const thunderFlinchCount = results.filter(r => r.thunderFlinched).length
  const metagrossFlinchCount = results.filter(r => r.metagrossFlinched).length
  const thunderParalyzedCount = results.filter(r => r.thunderParalyzed).length
  const metagrossParalyzedCount = results.filter(r => r.metagrossParalyzed).length
  
  const actionPatterns = {
    thunderFlinchRate: (thunderFlinchCount / iterations) * 100,
    metagrossFlinchRate: (metagrossFlinchCount / iterations) * 100,
    thunderParalyzedRate: (thunderParalyzedCount / iterations) * 100,
    metagrossParalyzedRate: (metagrossParalyzedCount / iterations) * 100,
  }
  
  return {
    winRate,
    averageTurns,
    minTurns,
    maxTurns,
    winReasons,
    lossReasons,
    actionPatterns,
  }
}