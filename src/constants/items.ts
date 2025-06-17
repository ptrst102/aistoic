// もちものの効果
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
    description: "電気タイプのわざの威力が1.1倍",
    type: "power",
    multiplier: 1.1,
    boostedType: "でんき",
  },
  ひかりのこな: {
    description: "相手のわざの命中率を0.9倍",
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
    description: "もちものなし",
    type: "none",
  },
  かたいいし: {
    description: "いわタイプのわざの威力が1.1倍",
    type: "power",
    multiplier: 1.1,
    boostedType: "いわ",
  },
  ヤタピのみ: {
    description: "HPが1/4以下になったとき、とくこうが1段階上がる（一度きり）",
    type: "pinch_berry",
    stat: "spAttack",
    hpThreshold: 0.25,
  },
  チイラのみ: {
    description: "HPが1/4以下になったとき、こうげきが1段階上がる（一度きり）",
    type: "pinch_berry",
    stat: "attack",
    hpThreshold: 0.25,
  },
  カムラのみ: {
    description: "HPが1/4以下になったとき、すばやさが1段階上がる（一度きり）",
    type: "pinch_berry",
    stat: "speed",
    hpThreshold: 0.25,
  },
} as const;

// サンダーが持てるもちもの
export const THUNDER_ITEMS = [
  "もちものなし",
  "ラムのみ",
  "オボンのみ",
  "ヤタピのみ",
  "カムラのみ",
  "せんせいのツメ",
  "たべのこし",
  "ひかりのこな",
  "じしゃく",
] as const;

// メタグロスが持てるもちもの
export const METAGROSS_ITEMS = [
  "もちものなし",
  "ラムのみ",
  "オボンのみ",
  "チイラのみ",
  "カムラのみ",
  "せんせいのツメ",
  "たべのこし",
  "ひかりのこな",
  "かたいいし",
  "こだわりハチマキ",
] as const;
