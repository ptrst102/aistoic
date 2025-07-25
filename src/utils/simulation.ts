import { ITEM_EFFECTS, METAGROSS_ITEMS, METAGROSS_PRESETS } from "@/constants";
import type {
  Metagross,
  MetagrossItem,
  MetagrossPreset,
  Thunder,
} from "@/types";
import { simulateBattle } from "./battle";
import { calculateStats } from "./stats";

/**
 * モンテカルロシミュレーションで勝率を計算する
 * @param thunder サンダーのデータ
 * @param metagross メタグロスのデータ
 * @param iterations シミュレーション回数
 * @returns 勝率（0-100のパーセンテージ）
 */
export const calculateWinRate = (
  thunder: Thunder,
  metagross: Metagross,
  iterations = 10000,
): number => {
  // ステータスを計算
  const thunderWithStats: Thunder = {
    ...thunder,
    stats:
      thunder.stats ||
      calculateStats("サンダー", 50, thunder.nature, thunder.ivs, thunder.evs),
  };

  const metagrossWithStats: Metagross = {
    ...metagross,
    stats:
      metagross.stats ||
      calculateStats(
        "メタグロス",
        50,
        metagross.nature,
        metagross.ivs,
        metagross.evs,
      ),
  };

  const results = Array.from({ length: iterations }, () =>
    simulateBattle(thunderWithStats, metagrossWithStats),
  );

  const wins = results.filter((result) => result.winner === "thunder").length;

  return (wins / iterations) * 100;
};

/**
 * すべてのプリセットメタグロスに対する勝率を計算する
 * @param thunder サンダーのデータ
 * @returns プリセット名ともちものごとの勝率
 */
export const calculateWinRatesAgainstAllPresets = (
  thunder: Thunder,
): Record<MetagrossPreset, Record<MetagrossItem, number>> => {
  const results = {} as Record<MetagrossPreset, Record<MetagrossItem, number>>;

  for (const [presetName, preset] of Object.entries(METAGROSS_PRESETS)) {
    const itemResults = {} as Record<MetagrossItem, number>;

    for (const item of METAGROSS_ITEMS) {
      const metagross: Metagross = {
        species: "メタグロス",
        level: 50,
        nature: preset.nature,
        ivs: {
          hp: 31,
          attack: 31,
          defense: 31,
          spAttack: 31,
          spDefense: 31,
          speed: 31,
        },
        evs: preset.evs,
        item: item as MetagrossItem,
      };

      const winRate = calculateWinRate(thunder, metagross, 10000);
      itemResults[item] = winRate;
    }

    results[presetName as MetagrossPreset] = itemResults;
  }

  return results;
};

/**
 * 調整メタグロスに対する勝率を計算する（各もちものごと）
 * @param thunder サンダーのデータ
 * @param customMetagross 調整メタグロスのデータ（もちものなし）
 * @returns もちものごとの勝率
 */
export const calculateWinRateAgainstCustom = (
  thunder: Thunder,
  customMetagross: Omit<Metagross, "item">,
): Record<MetagrossItem, number> => {
  const results = {} as Record<MetagrossItem, number>;

  for (const item of METAGROSS_ITEMS) {
    const metagrossWithItem: Metagross = {
      ...customMetagross,
      item,
    } as Metagross;

    results[item] = calculateWinRate(thunder, metagrossWithItem, 10000);
  }

  return results;
};

/**
 * 勝率に基づいて色を返す（UIで使用）
 * @param winRate 勝率（0-100）
 * @returns Tailwind CSSのクラス名
 */
export const getWinRateColorClass = (winRate: number): string => {
  if (winRate >= 80) return "bg-green-100 text-green-900";
  if (winRate >= 60) return "bg-yellow-100 text-yellow-900";
  if (winRate >= 40) return "bg-orange-100 text-orange-900";
  return "bg-red-100 text-red-900";
};

/**
 * もちものの説明を取得する
 */
export const getItemDescription = (item: string): string => {
  return ITEM_EFFECTS[item as keyof typeof ITEM_EFFECTS]?.description || "";
};
