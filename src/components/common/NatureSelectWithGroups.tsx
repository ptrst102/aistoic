import { NATURE_LIST } from '@/constants/pokemon'
import type { Nature } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '../ui/select'
import { NatureSelectItem } from './NatureSelectItem'

interface NatureSelectWithGroupsProps {
  value: Nature
  onValueChange: (value: Nature) => void
  id?: string
  className?: string
}

export const NatureSelectWithGroups = ({ value, onValueChange, id, className }: NatureSelectWithGroupsProps) => {
  // 性格をグループ分け
  const natureGroups = [
    { label: 'こうげき上昇', natures: NATURE_LIST.slice(0, 4) },
    { label: 'ぼうぎょ上昇', natures: NATURE_LIST.slice(4, 8) },
    { label: 'とくこう上昇', natures: NATURE_LIST.slice(8, 12) },
    { label: 'とくぼう上昇', natures: NATURE_LIST.slice(12, 16) },
    { label: 'すばやさ上昇', natures: NATURE_LIST.slice(16, 20) },
    { label: '無補正', natures: NATURE_LIST.slice(20) },
  ]

  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as Nature)}>
      <SelectTrigger id={id} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {natureGroups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel className="text-xs text-muted-foreground px-2">{group.label}</SelectLabel>
            {group.natures.map((n) => (
              <SelectItem key={n} value={n}>
                {group.label === '無補正' ? (
                  <div className="flex items-center justify-between w-full">
                    <span>{n}</span>
                    <span className="text-xs text-muted-foreground ml-2">無補正</span>
                  </div>
                ) : (
                  <NatureSelectItem nature={n} />
                )}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}