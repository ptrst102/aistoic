import type { Thunder, Metagross } from '@/types'
import { calculateDamage, calculateStats } from '@/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { DEFAULT_EVS, DEFAULT_IVS } from '@/constants'

interface DamageCalculationProps {
  thunder: Thunder
  metagross: Metagross
}

export const DamageCalculation = ({ thunder, metagross }: DamageCalculationProps) => {
  const calculateDamages = () => {

    // ダメージ計算（持ち物はこだわりハチマキ固定で計算）
    const metagrossWithItem: Metagross = {
      ...metagross,
      item: 'こだわりハチマキ',
    }

    // 10万ボルトのダメージ計算
    const tboltMin = calculateDamage(thunder, metagrossWithItem, 95, 'special', 'electric', false, 0.85)
    const tboltMax = calculateDamage(thunder, metagrossWithItem, 95, 'special', 'electric', false, 1.0)

    // かみなりのダメージ計算
    const thunderMin = calculateDamage(thunder, metagrossWithItem, 120, 'special', 'electric', false, 0.85)
    const thunderMax = calculateDamage(thunder, metagrossWithItem, 120, 'special', 'electric', false, 1.0)

    return {
      tbolt: { min: tboltMin, max: tboltMax },
      thunder: { min: thunderMin, max: thunderMax },
      hp: metagross.stats?.hp || 155,
    }
  }

  const damageInfo = calculateDamages()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ダメージ計算</CardTitle>
        <CardDescription>
          サンダー → カスタムメタグロスへのダメージ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">10まんボルト:</span>
            <div className="text-right">
              <span className="font-mono text-lg">
                {damageInfo.tbolt.min}-{damageInfo.tbolt.max}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({Math.floor((damageInfo.tbolt.min / damageInfo.hp) * 100)}-
                {Math.floor((damageInfo.tbolt.max / damageInfo.hp) * 100)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">かみなり:</span>
            <div className="text-right">
              <span className="font-mono text-lg">
                {damageInfo.thunder.min}-{damageInfo.thunder.max}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({Math.floor((damageInfo.thunder.min / damageInfo.hp) * 100)}-
                {Math.floor((damageInfo.thunder.max / damageInfo.hp) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}