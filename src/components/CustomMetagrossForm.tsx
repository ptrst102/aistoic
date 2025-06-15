import { DEFAULT_EVS, DEFAULT_IVS, METAGROSS_ITEMS, NATURE_LIST } from '@/constants'
import type { EVs, IVs, Metagross, MetagrossItem, Nature } from '@/types'
import { calculateStats, calculateTotalEVs, isValidEVs } from '@/utils'
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'

interface CustomMetagrossFormProps {
  onSubmit: (metagross: Metagross) => void
  isExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

export const CustomMetagrossForm = ({ 
  onSubmit, 
  isExpanded = false, 
  onExpandedChange 
}: CustomMetagrossFormProps) => {
  const [nature, setNature] = useState<Nature>('いじっぱり')
  const [ivs, setIvs] = useState<IVs>(DEFAULT_IVS)
  const [evs, setEvs] = useState<EVs>({
    ...DEFAULT_EVS,
    hp: 252,
    attack: 252,
    speed: 4,
  })
  const [item, setItem] = useState<MetagrossItem>('こだわりハチマキ')

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
    const metagross: Metagross = {
      species: 'メタグロス',
      level: 50,
      nature,
      ivs,
      evs,
      item,
      stats: calculateStats('メタグロス', 50, nature, ivs, evs),
    }
    onSubmit(metagross)
  }

  const stats = calculateStats('メタグロス', 50, nature, ivs, evs)

  return (
    <Card className="w-full">
      <Collapsible open={isExpanded} onOpenChange={onExpandedChange}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>カスタムメタグロス</CardTitle>
                <CardDescription>
                  任意のメタグロスに対する勝率を計算（オプション）
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                {isExpanded ? '折りたたむ' : '展開する'}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* 性格選択 */}
            <div className="space-y-2">
              <Label htmlFor="metagross-nature">性格</Label>
              <Select value={nature} onValueChange={(value) => setNature(value as Nature)}>
                <SelectTrigger id="metagross-nature">
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

            {/* 持ち物選択 */}
            <div className="space-y-2">
              <Label htmlFor="metagross-item">持ち物</Label>
              <Select value={item} onValueChange={(value) => setItem(value as MetagrossItem)}>
                <SelectTrigger id="metagross-item">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METAGROSS_ITEMS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              カスタムメタグロスで計算
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}