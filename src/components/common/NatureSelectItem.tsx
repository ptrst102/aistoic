import { NATURE_MODIFIERS } from '@/constants/pokemon'
import type { Nature } from '@/types'

interface NatureSelectItemProps {
  nature: Nature
}

const statNames: Record<string, string> = {
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  spAttack: 'とくこう',
  spDefense: 'とくぼう',
  speed: 'すばやさ',
}

export const NatureSelectItem = ({ nature }: NatureSelectItemProps) => {
  const modifier = NATURE_MODIFIERS[nature]
  
  return (
    <div className="flex items-center justify-between w-full">
      <span>{nature}</span>
      {modifier.up && modifier.down && (
        <span className="text-xs ml-2">
          <span className="text-red-600">↑{statNames[modifier.up]}</span>
          {' '}
          <span className="text-blue-600">↓{statNames[modifier.down]}</span>
        </span>
      )}
    </div>
  )
}