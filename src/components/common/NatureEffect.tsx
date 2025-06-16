import { NATURE_MODIFIERS } from '@/constants/pokemon'
import type { Nature } from '@/types'

interface NatureEffectProps {
  nature: Nature
}

const statNames: Record<string, string> = {
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  spAttack: 'とくこう',
  spDefense: 'とくぼう',
  speed: 'すばやさ',
}

export const NatureEffect = ({ nature }: NatureEffectProps) => {
  const modifier = NATURE_MODIFIERS[nature]
  
  if (!modifier.up || !modifier.down) {
    return null // 補正なしの性格の場合は何も表示しない
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {modifier.up && (
        <span className="text-red-600 font-medium">
          ↑{statNames[modifier.up]}
        </span>
      )}
      {modifier.down && (
        <span className="text-blue-600 font-medium">
          ↓{statNames[modifier.down]}
        </span>
      )}
    </div>
  )
}