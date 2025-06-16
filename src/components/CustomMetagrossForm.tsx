import { DEFAULT_EVS, DEFAULT_IVS, STAT_LABELS, STAT_KEYS } from '@/constants'
import type { EVs, IVs, Metagross, Nature } from '@/types'
import { calculateStats, calculateTotalEVs, getOptimalEv, calculateEvFromStat, getStatRange } from '@/utils'
import { useState, useImperativeHandle, forwardRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { StatInput } from './common/StatInput'
import { NatureSelectWithGroups } from './common/NatureSelectWithGroups'

export interface CustomMetagrossFormRef {
  getMetagross: () => Metagross
}


export const CustomMetagrossForm = forwardRef<CustomMetagrossFormRef>(
  (_, ref) => {
  const [nature, setNature] = useState<Nature>('いじっぱり')
  const [ivs, setIvs] = useState<IVs>(DEFAULT_IVS)
  const [evs, setEvs] = useState<EVs>({
    ...DEFAULT_EVS,
    hp: 244,
    attack: 36,
    defense: 4,
    spDefense: 164,
    speed: 60,
  })
  // 持ち物は計算時に各種類試すので、ここでは不要

  const totalEvs = calculateTotalEVs(evs)
  const remainingEvs = 510 - totalEvs

  const updateEv = (stat: keyof EVs, value: number) => {
    const newEvs = { ...evs, [stat]: value }
    setEvs(newEvs)
  }


  const stats = calculateStats('メタグロス', 50, nature, ivs, evs)

  // 親コンポーネントからメタグロスの情報を取得できるようにする
  useImperativeHandle(ref, () => ({
    getMetagross: () => ({
      species: 'メタグロス',
      level: 50,
      nature,
      ivs,
      evs,
      stats,
      item: 'もちものなし', // 呼び出し側で各種類試すので、ここではデフォルト値
    }),
  }), [nature, ivs, evs, stats])


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>カスタムメタグロス</CardTitle>
        <CardDescription>
          任意のメタグロスに対する勝率を計算
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
            {/* 性格選択 */}
            <div className="space-y-2">
              <Label htmlFor="metagross-nature">性格</Label>
              <NatureSelectWithGroups
                value={nature}
                onValueChange={(value) => {
                  setNature(value)
                                  }}
                id="metagross-nature"
              />
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
                {STAT_KEYS.map((stat) => {
                  const optimalEv = getOptimalEv('メタグロス', 50, nature, ivs, evs, stat)
                  const hasWaste = optimalEv !== null
                  const wasteAmount = hasWaste ? evs[stat] - optimalEv : 0

                  return (
                    <div key={stat} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">{STAT_LABELS[stat]}</Label>
                        <div className="flex items-center gap-2">
                          <StatInput
                            value={stats[stat]}
                            onChange={(targetValue) => {
                              const newEv = calculateEvFromStat('メタグロス', 50, nature, ivs[stat], stat, targetValue)
                              if (newEv !== null) {
                                updateEv(stat, newEv)
                              }
                            }}
                            min={getStatRange('メタグロス', 50, nature, ivs[stat], stat).min}
                            max={getStatRange('メタグロス', 50, nature, ivs[stat], stat).max}
                          />
                          <div className="text-xs text-muted-foreground">
                            ({getStatRange('メタグロス', 50, nature, ivs[stat], stat).min}-
                            {getStatRange('メタグロス', 50, nature, ivs[stat], stat).max})
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* 個体値 */}
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">個体値</Label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={ivs[stat]}
                              onChange={(e) => {
                                const newValue = Math.max(0, Math.min(31, Number.parseInt(e.target.value) || 0))
                                setIvs({ ...ivs, [stat]: newValue })
                                                              }}
                              className="w-14 px-2 py-1 text-sm border rounded"
                              min={0}
                              max={31}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIvs({ ...ivs, [stat]: 31 })
                                                              }}
                              className="h-7 px-2 text-xs"
                            >
                              V
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIvs({ ...ivs, [stat]: 0 })
                                                              }}
                              className="h-7 px-2 text-xs"
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
                              <span className="text-xs text-orange-500 cursor-help" title={`最適値: ${optimalEv}`}>
                                無駄: {wasteAmount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={evs[stat]}
                              onChange={(e) => {
                                const newValue = Math.max(0, Math.min(252, Number.parseInt(e.target.value) || 0))
                                updateEv(stat, newValue)
                              }}
                              className={`w-14 px-2 py-1 text-sm border rounded ${hasWaste ? 'border-orange-500 bg-orange-50' : ''}`}
                              min={0}
                              max={252}
                              step={4}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                updateEv(stat, 252)
                                                              }}
                              className="h-7 px-2 text-xs"
                            >
                              252
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                updateEv(stat, 0)
                                                              }}
                              className="h-7 px-2 text-xs"
                            >
                              0
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Slider
                        value={[evs[stat]]}
                        onValueChange={(values) => {
                          updateEv(stat, values[0])
                                                  }}
                        max={252}
                        step={4}
                        className={`w-full ${hasWaste ? '[&_[role=slider]]:bg-orange-500' : ''}`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 持ち物は計算時に各種類試すので、ここでは不要 */}
      </CardContent>
    </Card>
  )
})

CustomMetagrossForm.displayName = 'CustomMetagrossForm'