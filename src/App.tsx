import { CustomMetagrossForm, ThunderForm, WinRateTable, HelpSection, DamageCalculation } from '@/components'
import type { CustomMetagrossFormRef, ThunderFormRef } from '@/components'
import { Button } from '@/components/ui/button'
import type { Metagross, MetagrossItem, MetagrossPreset, Thunder } from '@/types'
import { calculateWinRateAgainstCustom, calculateWinRatesAgainstAllPresets } from '@/utils'
import { useState, useRef } from 'react'

const App = () => {
  const [winRates, setWinRates] = useState<Record<MetagrossPreset, Record<MetagrossItem, number>> | null>(null)
  const [customWinRates, setCustomWinRates] = useState<Record<MetagrossItem, number> | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [canCalculate, setCanCalculate] = useState(false)
  
  // ダメージ計算用のstate
  const [displayThunder, setDisplayThunder] = useState<Thunder | null>(null)
  const [displayMetagross, setDisplayMetagross] = useState<Metagross | null>(null)
  
  // フォームへの参照
  const thunderFormRef = useRef<ThunderFormRef>(null)
  const customMetagrossFormRef = useRef<CustomMetagrossFormRef>(null)

  const handleCalculate = () => {
    if (!thunderFormRef.current || !customMetagrossFormRef.current) return
    
    const thunder = thunderFormRef.current.getThunder()
    const customMetagross = customMetagrossFormRef.current.getMetagross()

    setIsCalculating(true)
    setWinRates(null)
    setCustomWinRates(null)
    
    // ダメージ計算用に現在の値を設定
    setDisplayThunder(thunder)
    setDisplayMetagross(customMetagross)

    // 非同期で計算を実行
    setTimeout(() => {
      const results = calculateWinRatesAgainstAllPresets(thunder)
      setWinRates(results)
      
      const customRates = calculateWinRateAgainstCustom(thunder, customMetagross)
      setCustomWinRates(customRates)
      
      setIsCalculating(false)
    }, 100)
  }
  
  const handleFormChange = () => {
    // フォームの値が変更されたら計算ボタンを有効化
    setCanCalculate(true)
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

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* 上部: 入力フォーム（2列） */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ThunderForm ref={thunderFormRef} onChange={handleFormChange} />
          <div className="space-y-6">
            <CustomMetagrossForm ref={customMetagrossFormRef} onChange={handleFormChange} />
            <DamageCalculation thunder={displayThunder} metagross={displayMetagross} />
          </div>
        </div>

        {/* 中央: 計算ボタン */}
        <div className="flex justify-center">
          <Button 
            onClick={handleCalculate} 
            disabled={!canCalculate || isCalculating}
            size="lg"
            className="w-full max-w-md"
          >
            {isCalculating ? '計算中...' : '勝率を計算する'}
          </Button>
        </div>

        {/* 下部: 勝率表 */}
        <div>
          <WinRateTable 
            winRates={winRates} 
            customWinRates={customWinRates}
            isCalculating={isCalculating}
          />
        </div>

        {/* ヘルプセクション */}
        <HelpSection />
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