import { METAGROSS_ITEMS } from "@/constants";
import type { MetagrossItem, MetagrossPreset } from "@/types";
import { getItemDescription, getWinRateColorClass } from "@/utils";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WinRateTableProps {
  winRates: Record<MetagrossPreset, Record<MetagrossItem, number>> | null;
  customWinRates?: Record<MetagrossItem, number> | null;
  isCalculating?: boolean;
}

export const WinRateTable = ({
  winRates,
  customWinRates,
  isCalculating = false,
}: WinRateTableProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
    );
  }

  if (!winRates) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>勝率計算結果</CardTitle>
          <CardDescription>計算を実行してください</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const presetOrder: MetagrossPreset[] = ["いじっぱりHA", "いじっぱりAS"];
  const itemOrder = METAGROSS_ITEMS as readonly MetagrossItem[];

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>勝率計算結果</CardTitle>
          <CardDescription>
            努力値配分、もちものごとのメタグロスに対するサンダーの勝率（%）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b">
                    努力値配分＼もちもの
                  </th>
                  {itemOrder.map((item) => (
                    <th
                      key={item}
                      className="text-center p-2 border-b min-w-[80px]"
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs cursor-help inline-block">
                            {item}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="z-50">
                          <p className="text-sm">{getItemDescription(item)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {presetOrder.map((preset) => (
                  <tr key={preset}>
                    <td className="p-2 border-b font-medium">{preset}</td>
                    {itemOrder.map((item) => {
                      const winRate = winRates[preset][item];
                      return (
                        <td
                          key={item}
                          className={`text-center p-2 border-b ${
                            hoveredItem === item ? "bg-muted" : ""
                          }`}
                        >
                          <div
                            className={`rounded px-2 py-1 font-semibold ${getWinRateColorClass(winRate)}`}
                          >
                            {winRate.toFixed(1)}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* 調整メタグロスの行 */}
                {customWinRates && (
                  <tr>
                    <td className="p-2 border-b font-medium">調整</td>
                    {itemOrder.map((item) => {
                      const winRate = customWinRates[item];
                      return (
                        <td
                          key={item}
                          className={`text-center p-2 border-b ${hoveredItem === item ? "bg-muted" : ""}`}
                        >
                          <div
                            className={`rounded px-2 py-1 font-semibold ${getWinRateColorClass(winRate)}`}
                          >
                            {winRate.toFixed(1)}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
