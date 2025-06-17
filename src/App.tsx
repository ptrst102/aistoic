import {
  CustomMetagrossForm,
  ThunderForm,
  WinRateTable,
  HelpSection,
  DamageCalculation,
} from "@/components";
import { Button } from "@/components/ui/button";
import type {
  Metagross,
  MetagrossItem,
  MetagrossPreset,
  Thunder,
  Nature,
  IVs,
  EVs,
  ThunderItem,
} from "@/types";
import {
  calculateWinRateAgainstCustom,
  calculateWinRatesAgainstAllPresets,
  calculateStats,
} from "@/utils";
import { DEFAULT_EVS, DEFAULT_IVS } from "@/constants";
import { useState } from "react";

const App = () => {
  const [winRates, setWinRates] = useState<Record<
    MetagrossPreset,
    Record<MetagrossItem, number>
  > | null>(null);
  const [customWinRates, setCustomWinRates] = useState<Record<
    MetagrossItem,
    number
  > | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // サンダーの状態管理
  const [thunderNature, setThunderNature] = useState<Nature>("ひかえめ");
  const [thunderIvs, setThunderIvs] = useState<IVs>(DEFAULT_IVS);
  const [thunderEvs, setThunderEvs] = useState<EVs>({
    ...DEFAULT_EVS,
    hp: 252,
    spAttack: 252,
    speed: 4,
  });
  const [thunderItem, setThunderItem] = useState<ThunderItem>("もちものなし");
  const [electricMove, setElectricMove] = useState<"10まんボルト" | "かみなり">(
    "10まんボルト",
  );

  // メタグロスの状態管理
  // 一般的なHDメタグロスを初期値とする
  const [metagrossNature, setMetagrossNature] = useState<Nature>("いじっぱり");
  const [metagrossIvs, setMetagrossIvs] = useState<IVs>(DEFAULT_IVS);
  const [metagrossEvs, setMetagrossEvs] = useState<EVs>({
    ...DEFAULT_EVS,
    hp: 244,
    attack: 36,
    defense: 4,
    spAttack: 0,
    spDefense: 164,
    speed: 60,
  });

  const thunder: Thunder = {
    species: "サンダー",
    level: 50,
    nature: thunderNature,
    ivs: thunderIvs,
    evs: thunderEvs,
    item: thunderItem,
    electricMove,
    stats: calculateStats(
      "サンダー",
      50,
      thunderNature,
      thunderIvs,
      thunderEvs,
    ),
  };

  const metagross: Metagross = {
    species: "メタグロス",
    level: 50,
    nature: metagrossNature,
    ivs: metagrossIvs,
    evs: metagrossEvs,
    item: "もちものなし", // デフォルト値として仮セット
    stats: calculateStats(
      "メタグロス",
      50,
      metagrossNature,
      metagrossIvs,
      metagrossEvs,
    ),
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setWinRates(null);
    setCustomWinRates(null);

    // 非同期で計算を実行
    setTimeout(() => {
      const results = calculateWinRatesAgainstAllPresets(thunder);
      setWinRates(results);

      const customRates = calculateWinRateAgainstCustom(thunder, metagross);
      setCustomWinRates(customRates);

      setIsCalculating(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">AIstoic</h1>
          <p className=" text-gray-700">サンダー対メタグロス特化計算機</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* 上部: 入力フォーム（2列） */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ThunderForm
            nature={thunderNature}
            onNatureChange={setThunderNature}
            ivs={thunderIvs}
            onIvsChange={setThunderIvs}
            evs={thunderEvs}
            onEvsChange={setThunderEvs}
            item={thunderItem}
            onItemChange={setThunderItem}
            electricMove={electricMove}
            onElectricMoveChange={setElectricMove}
          />
          <div className="space-y-6">
            <CustomMetagrossForm
              nature={metagrossNature}
              onNatureChange={setMetagrossNature}
              ivs={metagrossIvs}
              onIvsChange={setMetagrossIvs}
              evs={metagrossEvs}
              onEvsChange={setMetagrossEvs}
            />
            <DamageCalculation thunder={thunder} metagross={metagross} />
          </div>
        </div>

        {/* 中央: 計算ボタン */}
        <div className="flex justify-center">
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            size="lg"
            className="w-full max-w-md"
          >
            {isCalculating ? "計算中..." : "勝率を計算する"}
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
          <p>
            連絡先→
            <a
              href="https://x.com/ptrst102"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              @ptrst102
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
