import { CustomMetagrossForm, ThunderForm, WinRateTable } from '@/components'
import type { Metagross, MetagrossItem, MetagrossPreset, Thunder } from '@/types'
import { calculateWinRateAgainstCustom, calculateWinRatesAgainstAllPresets } from '@/utils'
import { useState } from 'react'

const App = () => {
  const [thunder, setThunder] = useState<Thunder | null>(null)
  const [winRates, setWinRates] = useState<Record<MetagrossPreset, Record<MetagrossItem, number>> | null>(null)
  const [customMetagross, setCustomMetagross] = useState<Metagross | null>(null)
  const [customWinRate, setCustomWinRate] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleThunderSubmit = async (newThunder: Thunder) => {
    setThunder(newThunder)
    setIsCalculating(true)
    setCustomWinRate(null)

    // 非同期で計算を実行
    setTimeout(() => {
      const results = calculateWinRatesAgainstAllPresets(newThunder)
      setWinRates(results)
      
      // カスタムメタグロスが設定されている場合はその勝率も計算
      if (customMetagross) {
        const customRate = calculateWinRateAgainstCustom(newThunder, customMetagross)
        setCustomWinRate(customRate)
      }
      
      setIsCalculating(false)
    }, 100)
  }

  const handleCustomMetagrossChange = (metagross: Metagross) => {
    setCustomMetagross(metagross)
    
    // サンダーが設定されている場合は勝率を計算
    if (thunder) {
      setIsCalculating(true)
      setTimeout(() => {
        const winRate = calculateWinRateAgainstCustom(thunder, metagross)
        setCustomWinRate(winRate)
        setIsCalculating(false)
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            AIstoic - サンダー対メタグロス特化計算機
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            第三世代対戦環境における1対1勝率計算ツール
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左側: 入力フォーム */}
          <div className="space-y-6">
            <ThunderForm onSubmit={handleThunderSubmit} />
            <CustomMetagrossForm onSubmit={handleCustomMetagrossChange} thunder={thunder} />
          </div>

          {/* 右側: 勝率表 */}
          <div>
            <WinRateTable 
              winRates={winRates} 
              customWinRate={customWinRate}
              isCalculating={isCalculating}
            />
          </div>
        </div>
      </main>

      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>計算式は第三世代（ルビー・サファイア・エメラルド・FRLG）の仕様に準拠</p>
          <p className="mt-1">モンテカルロ法（10,000回試行）による確率計算</p>
        </div>
      </footer>
    </div>
  )
}

export default App