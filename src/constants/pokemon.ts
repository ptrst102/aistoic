import type { EVs, Metagross, MetagrossPreset, Nature, Stats } from "@/types";

// 種族値
export const BASE_STATS = {
  サンダー: {
    hp: 90,
    attack: 90,
    defense: 85,
    spAttack: 125,
    spDefense: 90,
    speed: 100,
  },
  メタグロス: {
    hp: 80,
    attack: 135,
    defense: 130,
    spAttack: 95,
    spDefense: 90,
    speed: 70,
  },
} as const;

// 性格補正
export const NATURE_MODIFIERS: Record<
  Nature,
  { up: keyof Stats | null; down: keyof Stats | null }
> = {
  がんばりや: { up: null, down: null },
  さみしがり: { up: "attack", down: "defense" },
  ゆうかん: { up: "attack", down: "speed" },
  いじっぱり: { up: "attack", down: "spAttack" },
  やんちゃ: { up: "attack", down: "spDefense" },
  ずぶとい: { up: "defense", down: "attack" },
  わんぱく: { up: "defense", down: "spAttack" },
  のうてんき: { up: "defense", down: "spDefense" },
  のんき: { up: "defense", down: "speed" },
  ひかえめ: { up: "spAttack", down: "attack" },
  おっとり: { up: "spAttack", down: "defense" },
  うっかりや: { up: "spAttack", down: "spDefense" },
  れいせい: { up: "spAttack", down: "speed" },
  おだやか: { up: "spDefense", down: "attack" },
  おとなしい: { up: "spDefense", down: "defense" },
  しんちょう: { up: "spDefense", down: "spAttack" },
  なまいき: { up: "spDefense", down: "speed" },
  おくびょう: { up: "speed", down: "attack" },
  せっかち: { up: "speed", down: "defense" },
  ようき: { up: "speed", down: "spAttack" },
  むじゃき: { up: "speed", down: "spDefense" },
  てれや: { up: null, down: null },
  すなお: { up: null, down: null },
  きまぐれ: { up: null, down: null },
  まじめ: { up: null, down: null },
} as const;

// 性格リスト（上昇ステータスごとにグループ化、さらに下降ステータス順）
export const NATURE_LIST: Nature[] = [
  // こうげき上昇
  "さみしがり", // ぼうぎょ↓
  "いじっぱり", // とくこう↓
  "やんちゃ", // とくぼう↓
  "ゆうかん", // すばやさ↓
  // ぼうぎょ上昇
  "ずぶとい", // こうげき↓
  "わんぱく", // とくこう↓
  "のうてんき", // とくぼう↓
  "のんき", // すばやさ↓
  // とくこう上昇
  "ひかえめ", // こうげき↓
  "おっとり", // ぼうぎょ↓
  "うっかりや", // とくぼう↓
  "れいせい", // すばやさ↓
  // とくぼう上昇
  "おだやか", // こうげき↓
  "おとなしい", // ぼうぎょ↓
  "しんちょう", // とくこう↓
  "なまいき", // すばやさ↓
  // すばやさ上昇
  "おくびょう", // こうげき↓
  "せっかち", // ぼうぎょ↓
  "ようき", // とくこう↓
  "むじゃき", // とくぼう↓
  // 無補正
  "がんばりや",
  "すなお",
  "てれや",
  "きまぐれ",
  "まじめ",
];

// プリセットメタグロスの定義
export const METAGROSS_PRESETS: Record<
  MetagrossPreset,
  { nature: Nature; evs: EVs; stats: Stats }
> = {
  いじっぱりHA: {
    nature: "いじっぱり",
    evs: {
      hp: 252,
      attack: 252,
      defense: 0,
      spAttack: 0,
      spDefense: 0,
      speed: 4,
    },
    stats: {
      hp: 187,
      attack: 205,
      defense: 150,
      spAttack: 115,
      spDefense: 110,
      speed: 91,
    },
  },
  いじっぱりAS: {
    nature: "いじっぱり",
    evs: {
      hp: 4,
      attack: 252,
      defense: 0,
      spAttack: 0,
      spDefense: 0,
      speed: 252,
    },
    stats: {
      hp: 155,
      attack: 205,
      defense: 150,
      spAttack: 115,
      spDefense: 110,
      speed: 122,
    },
  },
} as const;

// デフォルト個体値（すべて31）
export const DEFAULT_IVS = {
  hp: 31,
  attack: 31,
  defense: 31,
  spAttack: 31,
  spDefense: 31,
  speed: 31,
} as const;

// デフォルト努力値（すべて0）
export const DEFAULT_EVS = {
  hp: 0,
  attack: 0,
  defense: 0,
  spAttack: 0,
  spDefense: 0,
  speed: 0,
} as const;
