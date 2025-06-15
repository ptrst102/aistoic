import { DEFAULT_EVS, DEFAULT_IVS, NATURE_LIST, THUNDER_ITEMS } from '@/constants'
import type { EVs, IVs, Nature, Thunder, ThunderItem } from '@/types'
import { calculateStats, calculateTotalEVs, isValidEVs } from '@/utils'
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'

interface ThunderFormProps {
  onSubmit: (thunder: Thunder) => void
}

export const ThunderForm = ({ onSubmit }: ThunderFormProps) => {
  const [nature, setNature] = useState<Nature>('ひかえめ')
  const [ivs, setIvs] = useState<IVs>(DEFAULT_IVS)
  const [evs, setEvs] = useState<EVs>({
    ...DEFAULT_EVS,
    hp: 252,
    spAttack: 252,
    speed: 4,
  })
  const [electricMove, setElectricMove] = useState<'10まんボルト' | 'かみなり'>('10まんボルト')
  const [item, setItem] = useState<ThunderItem>('じしゃく')

  const totalEvs = calculateTotalEVs(evs)
  const remainingEvs = 510 - totalEvs

  const updateEv = (stat: keyof EVs, value: number) => {
    const newEvs = { ...evs, [stat]: value }
    if (isValidEVs(newEvs)) {
      setEvs(newEvs)
    }
  }

  const maxEvForStat = (stat: keyof EVs) => {
    return Math.min(252, evs[stat] + remainingEvs)
  }

  const handleSubmit = () => {
    const thunder: Thunder = {
      species: 'サンダー',
      level: 50,
      nature,
      ivs,
      evs,
      item,
      electricMove,
      stats: calculateStats('サンダー', 50, nature, ivs, evs),
    }
    onSubmit(thunder)
  }

  const stats = calculateStats('サンダー', 50, nature, ivs, evs)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>サンダーの設定</CardTitle>
        <CardDescription>
          育成方針を入力してください
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 性格選択 */}
        <div className="space-y-2">
          <Label htmlFor="nature">性格</Label>
          <Select value={nature} onValueChange={(value) => setNature(value as Nature)}>
            <SelectTrigger id="nature">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NATURE_LIST.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 努力値設定 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>努力値配分</Label>
            <span className="text-sm text-muted-foreground">
              残り: {remainingEvs} / 510
            </span>
          </div>

          {Object.entries(evs).map(([stat, value]) => {
            const statLabels = {
              hp: 'HP',
              attack: 'こうげき',
              defense: 'ぼうぎょ',
              spAttack: 'とくこう',
              spDefense: 'とくぼう',
              speed: 'すばやさ',
            }
            return (
              <div key={stat} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{statLabels[stat as keyof EVs]}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-12 text-right">{value}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateEv(stat as keyof EVs, 252)}
                      disabled={maxEvForStat(stat as keyof EVs) < 252}
                    >
                      252
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateEv(stat as keyof EVs, 0)}
                    >
                      0
                    </Button>
                  </div>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={(values) => updateEv(stat as keyof EVs, values[0])}
                  max={maxEvForStat(stat as keyof EVs)}
                  step={4}
                  className="w-full"
                />
              </div>
            )
          })}
        </div>

        {/* 実数値表示 */}
        <div className="space-y-2 p-4 bg-muted rounded-lg">
          <Label className="text-sm">実数値</Label>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>HP: {stats.hp}</div>
            <div>こうげき: {stats.attack}</div>
            <div>ぼうぎょ: {stats.defense}</div>
            <div>とくこう: {stats.spAttack}</div>
            <div>とくぼう: {stats.spDefense}</div>
            <div>すばやさ: {stats.speed}</div>
          </div>
        </div>

        {/* 電気技選択 */}
        <div className="space-y-2">
          <Label htmlFor="electric-move">使用する電気技</Label>
          <Select 
            value={electricMove} 
            onValueChange={(value) => setElectricMove(value as '10まんボルト' | 'かみなり')}
          >
            <SelectTrigger id="electric-move">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10まんボルト">
                10まんボルト (威力95 命中100 麻痺10%)
              </SelectItem>
              <SelectItem value="かみなり">
                かみなり (威力120 命中70 麻痺30%)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 持ち物選択 */}
        <div className="space-y-2">
          <Label htmlFor="item">持ち物</Label>
          <Select value={item} onValueChange={(value) => setItem(value as ThunderItem)}>
            <SelectTrigger id="item">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THUNDER_ITEMS.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          計算する
        </Button>
      </CardContent>
    </Card>
  )
}