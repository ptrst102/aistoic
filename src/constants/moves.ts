import type { Move } from "@/types";

// 技データ
export const MOVES: Record<string, Move> = {
  "10まんボルト": {
    name: "10まんボルト",
    power: 95,
    accuracy: 100,
    type: "でんき",
    category: "特殊",
    additionalEffect: {
      type: "paralysis",
      chance: 10,
    },
  },
  かみなり: {
    name: "かみなり",
    power: 120,
    accuracy: 70,
    type: "でんき",
    category: "特殊",
    additionalEffect: {
      type: "paralysis",
      chance: 30,
    },
  },
  いわなだれ: {
    name: "いわなだれ",
    power: 75,
    accuracy: 90,
    type: "いわ",
    category: "物理",
    additionalEffect: {
      type: "flinch",
      chance: 30,
    },
  },
  ねむる: {
    name: "ねむる",
    power: 0,
    accuracy: 100,
    type: "エスパー",
    category: "変化",
  },
} as const;

// タイプ相性（攻撃側のタイプ → 防御側のタイプ）
export const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  でんき: {
    でんき: 0.5,
    じめん: 0,
    ひこう: 2,
    みず: 2,
    くさ: 0.5,
    ドラゴン: 0.5,
    はがね: 1, // 第三世代では等倍
    エスパー: 1,
  },
  いわ: {
    かくとう: 0.5,
    じめん: 0.5,
    ひこう: 2,
    むし: 2,
    ほのお: 2,
    こおり: 2,
    はがね: 0.5,
    エスパー: 1,
    でんき: 1,
  },
} as const;

// サンダーのタイプ
export const THUNDER_TYPES = ["でんき", "ひこう"] as const;

// メタグロスのタイプ
export const METAGROSS_TYPES = ["はがね", "エスパー"] as const;

// タイプ一致ボーナス
export const STAB_MULTIPLIER = 1.5;

// 急所率
export const CRITICAL_HIT_RATE = 1 / 16;

// 急所ダメージ倍率
export const CRITICAL_HIT_MULTIPLIER = 2;
