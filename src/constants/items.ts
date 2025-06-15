// 持ち物の効果
export const ITEM_EFFECTS = {
  ラムのみ: {
    description: "状態異常を回復する（一度きり）",
    type: "berry",
  },
  オボンのみ: {
    description: "HPが半分以下になったとき、HPを30回復（一度きり）",
    type: "berry",
    healAmount: 30,
  },
  じしゃく: {
    description: "でんきタイプの技の威力が1.1倍",
    type: "power",
    multiplier: 1.1,
    boostedType: "でんき",
  },
  ひかりのこな: {
    description: "相手の技の命中率を0.9倍",
    type: "evasion",
    multiplier: 0.9,
  },
  せんせいのツメ: {
    description: "20%の確率で先制",
    type: "priority",
    chance: 0.2,
  },
  こだわりハチマキ: {
    description: "物理技の威力が1.5倍",
    type: "power",
    multiplier: 1.5,
    boostedCategory: "物理",
  },
  たべのこし: {
    description: "ターン終了時に最大HPの1/16を回復",
    type: "leftovers",
    healRatio: 1 / 16,
  },
  もちものなし: {
    description: "持ち物なし",
    type: "none",
  },
} as const;

// サンダーが持てる持ち物
export const THUNDER_ITEMS = [
  "ラムのみ",
  "オボンのみ",
  "じしゃく",
  "ひかりのこな",
  "もちものなし",
] as const;

// メタグロスが持てる持ち物
export const METAGROSS_ITEMS = [
  "ラムのみ",
  "オボンのみ",
  "せんせいのツメ",
  "こだわりハチマキ",
  "たべのこし",
  "ひかりのこな",
  "もちものなし",
] as const;
