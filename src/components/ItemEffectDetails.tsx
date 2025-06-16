import { ITEM_EFFECTS } from '@/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

export const ItemEffectDetails = () => {
  const thunderItems = ['じしゃく', 'たべのこし', 'ラムのみ', 'オボンのみ', 'せんせいのツメ', 'もちものなし'] as const
  const metagrossItems = ['こだわりハチマキ', 'ラムのみ', 'たべのこし', 'オボンのみ', 'かたいいし', 'せんせいのツメ', 'もちものなし'] as const

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">サンダーのもちもの効果</CardTitle>
          <CardDescription>
            各もちものの効果と計算への影響
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {thunderItems.map((item) => {
            const effect = ITEM_EFFECTS[item]
            if (!effect || item === 'もちものなし') return null
            
            return (
              <div key={item} className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{item}</h4>
                  {effect.type === 'power' && (
                    <Badge variant="default" className="text-xs">ダメージ補正</Badge>
                  )}
                  {effect.type === 'berry' && (
                    <Badge variant="secondary" className="text-xs">きのみ</Badge>
                  )}
                  {effect.type === 'leftovers' && (
                    <Badge variant="secondary" className="text-xs">回復</Badge>
                  )}
                  {item === 'せんせいのツメ' && (
                    <Badge variant="outline" className="text-xs">先制</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{effect.description}</p>
                {effect.type === 'power' && 'multiplier' in effect && (
                  <p className="text-xs text-muted-foreground">
                    威力 ×{effect.multiplier.toFixed(1)}
                  </p>
                )}
                {effect.type === 'berry' && 'healAmount' in effect && (
                  <p className="text-xs text-muted-foreground">
                    HP半分以下で {effect.healAmount}回復
                  </p>
                )}
                {effect.type === 'leftovers' && (
                  <p className="text-xs text-muted-foreground">
                    ターン終了時に最大HPの1/16回復
                  </p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">メタグロスのもちもの効果</CardTitle>
          <CardDescription>
            各もちものの効果と計算への影響
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {metagrossItems.map((item) => {
            const effect = ITEM_EFFECTS[item]
            if (!effect || item === 'もちものなし') return null
            
            return (
              <div key={item} className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{item}</h4>
                  {effect.type === 'power' && (
                    <Badge variant="default" className="text-xs">ダメージ補正</Badge>
                  )}
                  {effect.type === 'berry' && (
                    <Badge variant="secondary" className="text-xs">きのみ</Badge>
                  )}
                  {effect.type === 'leftovers' && (
                    <Badge variant="secondary" className="text-xs">回復</Badge>
                  )}
                  {item === 'せんせいのツメ' && (
                    <Badge variant="outline" className="text-xs">先制</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{effect.description}</p>
                {effect.type === 'power' && 'multiplier' in effect && (
                  <p className="text-xs text-muted-foreground">
                    {'boostedType' in effect && effect.boostedType ? `${effect.boostedType}わざ` : '物理技'}
                    威力 ×{effect.multiplier.toFixed(1)}
                  </p>
                )}
                {effect.type === 'berry' && 'healAmount' in effect && (
                  <p className="text-xs text-muted-foreground">
                    HP半分以下で {effect.healAmount}回復
                  </p>
                )}
                {effect.type === 'leftovers' && (
                  <p className="text-xs text-muted-foreground">
                    ターン終了時に最大HPの1/16回復
                  </p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}