import { STAT_LABELS, STAT_KEYS } from '@/constants'
import type { EVs, IVs, Nature } from '@/types'
import { calculateStats, calculateTotalEVs, getStatRange } from '@/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { StatInput } from '@/components/common/StatInput'
import { NatureSelectWithGroups } from '@/components/common/NatureSelectWithGroups'

interface CustomMetagrossFormProps {
  nature: Nature
  onNatureChange: (nature: Nature) => void
  ivs: IVs
  onIvsChange: (ivs: IVs) => void
  evs: EVs
  onEvsChange: (evs: EVs) => void
}

export const CustomMetagrossForm = ({
  nature,
  onNatureChange,
  ivs,
  onIvsChange,
  evs,
  onEvsChange,
}: CustomMetagrossFormProps) => {
  const totalEvs = calculateTotalEVs(evs)
  const remainingEvs = 510 - totalEvs

  const updateEv = (stat: keyof EVs, value: number) => {
    const newEvs = { ...evs }
    newEvs[stat] = value
    onEvsChange(newEvs)
  }

  const stats = calculateStats('メタグロス', 50, nature, ivs, evs)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>調整メタグロス</CardTitle>
        <CardDescription>
          Lv.50 / 実数値: {stats.hp} - {stats.attack} - {stats.defense} - {stats.spAttack} - {stats.spDefense} - {stats.speed}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 性格 */}
        <div className="space-y-2">
          <Label htmlFor="metagross-nature">性格</Label>
          <NatureSelectWithGroups
            value={nature}
            onValueChange={(value) => {
              onNatureChange(value)
            }}
            id="metagross-nature"
          />
        </div>

        {/* 個体値 */}
        <div className="space-y-2">
          <Label>個体値</Label>
          <div className="grid grid-cols-6 gap-4">
            {STAT_KEYS.map((stat) => (
              <div key={stat} className="space-y-1">
                <div className="text-xs text-gray-600">{STAT_LABELS[stat]}</div>
                <div className="flex items-center gap-1">
                  <StatInput
                    value={ivs[stat]}
                    onChange={(newValue) => {
                      onIvsChange({ ...ivs, [stat]: newValue })
                    }}
                    min={0}
                    max={31}
                  />
                  <div className="flex flex-col gap-0.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        onIvsChange({ ...ivs, [stat]: 31 })
                      }}
                      className="h-6 px-1.5 text-xs"
                    >
                      V
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        onIvsChange({ ...ivs, [stat]: 30 })
                      }}
                      className="h-6 px-1.5 text-xs"
                    >
                      U
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 努力値 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>努力値</Label>
            <span className={`text-sm ${remainingEvs < 0 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
              残り: {remainingEvs} / 510
            </span>
          </div>
          <div className="space-y-3">
            {STAT_KEYS.map((stat) => {
              const hasWaste = evs[stat] % 4 !== 0 && evs[stat] !== 252
              const { min, max } = getStatRange('メタグロス', 50, nature, ivs[stat], stat)
              const currentStat = stats[stat]
              return (
                <div key={stat} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{STAT_LABELS[stat]}</span>
                    <div className="flex items-center gap-2">
                      <StatInput
                        value={evs[stat]}
                        onChange={(newValue) => {
                          updateEv(stat, newValue)
                        }}
                        min={0}
                        max={252}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          updateEv(stat, 252)
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        252
                      </Button>
                      <Button
                        type="button"
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
                  <Slider
                    value={[evs[stat]]}
                    onValueChange={(values) => {
                      updateEv(stat, values[0])
                    }}
                    max={252}
                    step={4}
                    className={`w-full ${hasWaste ? '[&_[role=slider]]:bg-orange-500' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>実数値: {currentStat} ({min}〜{max})</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}