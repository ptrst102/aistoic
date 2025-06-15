import { METAGROSS_ITEMS } from '@/constants'
import type { MetagrossItem, MetagrossPreset } from '@/types'
import { getItemDescription, getWinRateColorClass } from '@/utils'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface WinRateTableProps {
  winRates: Record<MetagrossPreset, Record<MetagrossItem, number>> | null
  customWinRate?: number | null
  isCalculating?: boolean
}

export const WinRateTable = ({ winRates, customWinRate, isCalculating = false }: WinRateTableProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  if (isCalculating) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>計算中...</CardTitle>
          <CardDescription>
            モンテカルロシミュレーション（10,000回）を実行中です
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!winRates) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>勝率計算結果</CardTitle>
          <CardDescription>
            サンダーの設定を入力して計算を実行してください
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const presetOrder: MetagrossPreset[] = ['いじっぱりHA', 'いじっぱりAS']
  const itemOrder = METAGROSS_ITEMS as readonly MetagrossItem[]

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>勝率計算結果</CardTitle>
          <CardDescription>
            各メタグロスに対するサンダーの勝率（%）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b">メタグロス</th>
                  {itemOrder.map((item) => (
                    <Tooltip key={item}>
                      <TooltipTrigger asChild>
                        <th 
                          className="text-center p-2 border-b cursor-help min-w-[80px]"
                          onMouseEnter={() => setHoveredItem(item)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className="text-xs">
                            {item === 'もちものなし' ? 'なし' : item.replace('のみ', '')}
                          </div>
                        </th>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{getItemDescription(item)}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </tr>
              </thead>
              <tbody>
                {presetOrder.map((preset) => (
                  <tr key={preset}>
                    <td className="p-2 border-b font-medium">{preset}</td>
                    {itemOrder.map((item) => {
                      const winRate = winRates[preset][item]
                      return (
                        <td 
                          key={item} 
                          className={`text-center p-2 border-b ${
                            hoveredItem === item ? 'bg-muted' : ''
                          }`}
                        >
                          <div className={`rounded px-2 py-1 font-semibold ${getWinRateColorClass(winRate)}`}>
                            {winRate.toFixed(1)}%
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customWinRate !== undefined && customWinRate !== null && (
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">カスタムメタグロス</h3>
              <div className="flex items-center gap-2">
                <span>勝率:</span>
                <div className={`rounded px-3 py-1 font-semibold ${getWinRateColorClass(customWinRate)}`}>
                  {customWinRate.toFixed(1)}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}