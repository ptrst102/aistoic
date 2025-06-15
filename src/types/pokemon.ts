// ポケモンのステータス
export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

// 個体値（0-31）
export interface IVs {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

// 努力値配分（0-252、合計510まで）
export interface EVs {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

// 性格
export type Nature =
  | "がんばりや" // 無補正
  | "さみしがり" // 攻撃↑ 防御↓
  | "ゆうかん" // 攻撃↑ 素早さ↓
  | "いじっぱり" // 攻撃↑ 特攻↓
  | "やんちゃ" // 攻撃↑ 特防↓
  | "ずぶとい" // 防御↑ 攻撃↓
  | "わんぱく" // 防御↑ 特攻↓
  | "のうてんき" // 防御↑ 特防↓
  | "のんき" // 防御↑ 素早さ↓
  | "ひかえめ" // 特攻↑ 攻撃↓
  | "おっとり" // 特攻↑ 防御↓
  | "うっかりや" // 特攻↑ 特防↓
  | "れいせい" // 特攻↑ 素早さ↓
  | "おだやか" // 特防↑ 攻撃↓
  | "おとなしい" // 特防↑ 防御↓
  | "しんちょう" // 特防↑ 特攻↓
  | "なまいき" // 特防↑ 素早さ↓
  | "おくびょう" // 素早さ↑ 攻撃↓
  | "せっかち" // 素早さ↑ 防御↓
  | "ようき" // 素早さ↑ 特攻↓
  | "むじゃき" // 素早さ↑ 特防↓
  | "てれや" // 無補正
  | "すなお" // 無補正
  | "きまぐれ" // 無補正
  | "まじめ"; // 無補正

// 持ち物
export type ThunderItem =
  | "ラムのみ"
  | "オボンのみ"
  | "じしゃく"
  | "ひかりのこな"
  | "せんせいのツメ"
  | "たべのこし"
  | "もちものなし";

export type MetagrossItem =
  | "ラムのみ"
  | "オボンのみ"
  | "せんせいのツメ"
  | "こだわりハチマキ"
  | "たべのこし"
  | "ひかりのこな"
  | "かたいいし"
  | "もちものなし";

// ポケモンの種族
export type Species = "サンダー" | "メタグロス";

// ポケモンデータ
export interface Pokemon {
  species: Species;
  level: number;
  nature: Nature;
  ivs: IVs;
  evs: EVs;
  item: ThunderItem | MetagrossItem;
  moves?: string[];
  stats?: Stats; // 計算後のステータス
}

// サンダー専用の型
export interface Thunder extends Omit<Pokemon, "species" | "item"> {
  species: "サンダー";
  item: ThunderItem;
  electricMove: "10まんボルト" | "かみなり";
}

// メタグロス専用の型
export interface Metagross extends Omit<Pokemon, "species" | "item"> {
  species: "メタグロス";
  item: MetagrossItem;
}

// プリセットメタグロスの識別名
export type MetagrossPreset = "いじっぱりHA" | "いじっぱりAS";

// ステータスのキー
export type StatKey = keyof Stats;
