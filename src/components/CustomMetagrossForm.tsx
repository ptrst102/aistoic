import { DEFAULT_EVS, DEFAULT_IVS, NATURE_LIST } from '@/constants'
import type { EVs, IVs, Metagross, Nature, Thunder } from '@/types'
import { calculateStats, calculateTotalEVs, isValidEVs, getOptimalEv, calculateEvFromStat, getStatRange, calculateDamage } from '@/utils'
import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'

interface CustomMetagrossFormProps {
  onSubmit: (metagross: Metagross) => void
  thunder?: Thunder | null
}

export const CustomMetagrossForm = ({ onSubmit, thunder }: CustomMetagrossFormProps) => {
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

  const maxEvForStat = (stat: keyof EVs) => {
    return 252
  }

  const handleSubmit = () => {
    // 持ち物は呼び出し側で各種類試すので、ここでは基本情報のみ渡す
    const metagross: Omit<Metagross, 'item'> = {
      species: 'メタグロス',
      level: 50,
      nature,
      ivs,
      evs,
      stats: calculateStats('メタグロス', 50, nature, ivs, evs),
    }
    onSubmit(metagross as Metagross)
  }

  const stats = calculateStats('メタグロス', 50, nature, ivs, evs)

  // メタグロスの情報が変更されたら自動的にonSubmitを呼ぶ
  useEffect(() => {
    handleSubmit()
  }, [nature, ivs, evs])

  // サンダーからのダメージを計算
  const calculateThunderDamage = () => {
    // thunderがない場合はデフォルトのサンダーを使用
    const defaultThunder: Thunder = {
      species: 'サンダー',
      level: 50,
      nature: 'ひかえめ',
      ivs: DEFAULT_IVS,
      evs: { ...DEFAULT_EVS, hp: 252, spAttack: 252, speed: 4 },
      item: 'じしゃく',
      electricMove: '10まんボルト',
      stats: calculateStats('サンダー', 50, 'ひかえめ', DEFAULT_IVS, { ...DEFAULT_EVS, hp: 252, spAttack: 252, speed: 4 }),
    }
    const attackingThunder = thunder || defaultThunder

    const metagross: Metagross = {
      species: 'メタグロス',
      level: 50,
      nature,
      ivs,
      evs,
      item: 'こだわりハチマキ', // ダメージ表示用に仮の持ち物を設定
      stats,
    }

    // 10万ボルトのダメージ計算
    const tboltMin = calculateDamage(attackingThunder, metagross, 95, 'special', 'electric', false, 0.85)
    const tboltMax = calculateDamage(attackingThunder, metagross, 95, 'special', 'electric', false, 1.0)
    const tboltCritMin = calculateDamage(attackingThunder, metagross, 95, 'special', 'electric', true, 0.85)
    const tboltCritMax = calculateDamage(attackingThunder, metagross, 95, 'special', 'electric', true, 1.0)

    // かみなりのダメージ計算
    const thunderMin = calculateDamage(attackingThunder, metagross, 120, 'special', 'electric', false, 0.85)
    const thunderMax = calculateDamage(attackingThunder, metagross, 120, 'special', 'electric', false, 1.0)
    const thunderCritMin = calculateDamage(attackingThunder, metagross, 120, 'special', 'electric', true, 0.85)
    const thunderCritMax = calculateDamage(attackingThunder, metagross, 120, 'special', 'electric', true, 1.0)

    return {
      tbolt: { min: tboltMin, max: tboltMax, critMin: tboltCritMin, critMax: tboltCritMax },
      thunder: { min: thunderMin, max: thunderMax, critMin: thunderCritMin, critMax: thunderCritMax },
    }
  }

  const damageInfo = calculateThunderDamage()

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
                  const optimalEv = getOptimalEv('メタグロス', 50, nature, ivs, evs, stat)
                  const hasWaste = optimalEv !== null
                  const wasteAmount = hasWaste ? evs[stat] - optimalEv : 0

                  return (
                    <div key={stat} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">{statLabels[stat]}</Label>
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
                              onClick={() => setIvs({ ...ivs, [stat]: 31 })}
                              className="h-7 px-2 text-xs"
                            >
                              V
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIvs({ ...ivs, [stat]: 0 })}
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
                              onClick={() => updateEv(stat, 252)}
                              className="h-7 px-2 text-xs"
                            >
                              252
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateEv(stat, 0)}
                              className="h-7 px-2 text-xs"
                            >
                              0
                            </Button>
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

            {/* 持ち物はこだわりハチマキ固定 */}

            {/* サンダーからのダメージ表示 */}
            {damageInfo && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold mb-3">サンダーからの被ダメージ</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>10万ボルト:</span>
                    <div className="font-mono">
                      <span>{damageInfo.tbolt.min}-{damageInfo.tbolt.max}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({Math.floor((damageInfo.tbolt.min / stats.hp) * 100)}-{Math.floor((damageInfo.tbolt.max / stats.hp) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="ml-4">(急所):</span>
                    <div className="font-mono">
                      <span>{damageInfo.tbolt.critMin}-{damageInfo.tbolt.critMax}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({Math.floor((damageInfo.tbolt.critMin / stats.hp) * 100)}-{Math.floor((damageInfo.tbolt.critMax / stats.hp) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>かみなり:</span>
                    <div className="font-mono">
                      <span>{damageInfo.thunder.min}-{damageInfo.thunder.max}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({Math.floor((damageInfo.thunder.min / stats.hp) * 100)}-{Math.floor((damageInfo.thunder.max / stats.hp) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="ml-4">(急所):</span>
                    <div className="font-mono">
                      <span>{damageInfo.thunder.critMin}-{damageInfo.thunder.critMax}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({Math.floor((damageInfo.thunder.critMin / stats.hp) * 100)}-{Math.floor((damageInfo.thunder.critMax / stats.hp) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* 耐久指標表示 */}
                  <div className="border-t pt-2 mt-2 text-xs text-gray-700">
                    <div>HP{stats.hp} → 10万ボルト {Math.ceil(stats.hp / damageInfo.tbolt.max)}発耐え</div>
                    <div>HP{stats.hp} → かみなり {Math.ceil(stats.hp / damageInfo.thunder.max)}発耐え</div>
                  </div>
                </div>
              </div>
            )}
      </CardContent>
    </Card>
  )
}

// 実数値入力用のコンポーネント
interface StatInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
}

const StatInput = ({ value, onChange, min, max }: StatInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 外部から値が変更された時
  if (!isFocused && inputValue !== value.toString()) {
    setInputValue(value.toString())
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // 空文字列を許容
    if (newValue === '') return
    
    const numValue = Number.parseInt(newValue)
    if (!isNaN(numValue)) {
      // 範囲内の値のみ変更を反映
      if (numValue >= min && numValue <= max) {
        onChange(numValue)
      }
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    
    // フォーカスが外れた時に有効値に補正
    if (inputValue === '') {
      setInputValue(value.toString())
      return
    }
    
    const numValue = Number.parseInt(inputValue)
    if (isNaN(numValue)) {
      setInputValue(value.toString())
      return
    }
    
    // 範囲外の場合は最も近い値に補正
    if (numValue < min) {
      onChange(min)
      setInputValue(min.toString())
    } else if (numValue > max) {
      onChange(max)
      setInputValue(max.toString())
    } else {
      // 範囲内でも、現在の値と異なる場合は反映
      if (numValue !== value) {
        onChange(numValue)
      }
      setInputValue(numValue.toString())
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // 全選択して編集しやすくする
    setTimeout(() => {
      inputRef.current?.select()
    }, 0)
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      className="w-20 px-2 py-1 text-2xl font-bold text-center border rounded"
    />
  )
}