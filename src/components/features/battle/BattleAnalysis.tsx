import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { BattleAnalysis as BattleAnalysisType } from '@/types'

interface BattleAnalysisProps {
  analysis: BattleAnalysisType | null
  loading?: boolean
}

export const BattleAnalysis = ({ analysis, loading }: BattleAnalysisProps) => {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>バトル詳細分析</CardTitle>
          <CardDescription>分析中...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>バトル詳細分析</CardTitle>
        <CardDescription>
          10,000回のシミュレーション結果に基づく詳細分析
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本統計 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">基本統計</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">サンダー勝率</span>
                <span className="font-medium">{analysis.winRate.toFixed(1)}%</span>
              </div>
              <Progress value={analysis.winRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">平均ターン数</span>
                <span className="font-medium">{analysis.averageTurns.toFixed(1)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                最短 {analysis.minTurns} / 最長 {analysis.maxTurns}
              </div>
            </div>
          </div>
        </div>

        {/* 勝因・負け因分析 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">勝敗要因分析</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">サンダーの勝因</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">通常攻撃</span>
                  <span>{((analysis.winReasons.byDamage / (analysis.winRate * 100)) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">わるあがき</span>
                  <span>{((analysis.winReasons.byStruggle / (analysis.winRate * 100)) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">サンダーの負け因</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">通常攻撃</span>
                  <span>{((analysis.lossReasons.byDamage / ((100 - analysis.winRate) * 100)) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">わるあがき</span>
                  <span>{((analysis.lossReasons.byStruggle / ((100 - analysis.winRate) * 100)) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 行動パターン分析 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">行動パターン</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">ひるみ発生率</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">サンダー</span>
                  <span>{analysis.actionPatterns.thunderFlinchRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">メタグロス</span>
                  <span>{analysis.actionPatterns.metagrossFlinchRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">まひ発生率</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">サンダー</span>
                  <span>{analysis.actionPatterns.thunderParalyzedRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">メタグロス</span>
                  <span>{analysis.actionPatterns.metagrossParalyzedRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}