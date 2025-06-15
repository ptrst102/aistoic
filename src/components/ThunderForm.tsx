import { DEFAULT_EVS, DEFAULT_IVS, NATURE_LIST, THUNDER_ITEMS } from '@/constants'
import type { EVs, IVs, Nature, Thunder, ThunderItem } from '@/types'
import { calculateStats, calculateTotalEVs, isValidEVs, getOptimalEv } from '@/utils'
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
    setEvs(newEvs)
  }

  const maxEvForStat = (stat: keyof EVs) => {
    return 252
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

        {/* ステータス設定 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>ステータス設定</Label>
            <span className={`text-sm ${remainingEvs < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              努力値残り: {remainingEvs} / 510
            </span>
          </div>

          <div className="space-y-3">
            {(['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'] as const).map((stat) => {
              const statLabels = {
                hp: 'HP',
                attack: 'こうげき',
                defense: 'ぼうぎょ',
                spAttack: 'とくこう',
                spDefense: 'とくぼう',
                speed: 'すばやさ',
              }
              const optimalEv = getOptimalEv('サンダー', 50, nature, ivs, evs, stat)
              const hasWaste = optimalEv !== null
              const wasteAmount = hasWaste ? evs[stat] - optimalEv : 0

              return (
                <div key={stat} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">{statLabels[stat]}</Label>
                    <div className="text-2xl font-bold">{stats[stat]}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* 個体値 */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">個体値</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={ivs[stat]}
                          onChange={(e) => {
                            const newValue = Math.max(0, Math.min(31, Number.parseInt(e.target.value) || 0))
                            setIvs({ ...ivs, [stat]: newValue })
                          }}
                          className="w-16 px-2 py-1 text-sm border rounded"
                          min={0}
                          max={31}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIvs({ ...ivs, [stat]: 31 })}
                          className="h-7 px-2"
                        >
                          V
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIvs({ ...ivs, [stat]: 0 })}
                          className="h-7 px-2"
                        >
                          U
                        </Button>
                      </div>
                    </div>

                    {/* 努力値 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">努力値</Label>
                        {hasWaste && (
                          <span className="text-xs text-orange-500">
                            無駄: {wasteAmount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={evs[stat]}
                          onChange={(e) => {
                            const newValue = Math.max(0, Math.min(252, Number.parseInt(e.target.value) || 0))
                            updateEv(stat, newValue)
                          }}
                          className={`w-16 px-2 py-1 text-sm border rounded ${hasWaste ? 'border-orange-500 bg-orange-50' : ''}`}
                          min={0}
                          max={252}
                          step={4}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateEv(stat, 252)}
                          className="h-7 px-2"
                        >
                          252
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateEv(stat, 0)}
                          className="h-7 px-2"
                        >
                          0
                        </Button>
                        {hasWaste && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateEv(stat, optimalEv)}
                            className="h-7 px-2 text-orange-600 border-orange-600"
                            title={`最適値: ${optimalEv}`}
                          >
                            最適
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Slider
                    value={[evs[stat]]}
                    onValueChange={(values) => updateEv(stat, values[0])}
                    max={252}
                    step={4}
                    className={`w-full ${hasWaste ? '[&_[role=slider]]:bg-orange-500' : ''}`}
                  />
                </div>
              )
            })}
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