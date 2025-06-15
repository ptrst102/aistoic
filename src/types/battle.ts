import type { Metagross, Thunder } from "./pokemon";

// バトル中のポケモンの状態
export interface BattlePokemon {
  pokemon: Thunder | Metagross;
  currentHp: number;
  maxHp: number;
  status: Status;
  statusTurns?: number; // ねむり・こおり用
  item: string | null; // 消費した場合null
  flinched: boolean; // ひるみ状態
}

// 状態異常
export type Status = "なし" | "まひ" | "ねむり";

// 技データ
export interface Move {
  name: string;
  power: number;
  accuracy: number;
  type: "でんき" | "いわ" | "エスパー";
  category: "物理" | "特殊" | "変化";
  additionalEffect?: {
    type: "paralysis" | "flinch";
    chance: number;
  };
}

// ターンの行動
export interface TurnAction {
  pokemon: "サンダー" | "メタグロス";
  move: string;
  damage?: number;
  hit?: boolean;
  critical?: boolean;
  additionalEffect?: boolean;
  itemUsed?: string;
}

// バトル結果
export interface BattleResult {
  winner: "サンダー" | "メタグロス";
  turns: number;
  thunderHpRemaining: number;
  metagrossHpRemaining: number;
}

// シミュレーション結果
export interface SimulationResult {
  thunder: Thunder;
  metagross: Metagross;
  winRate: number;
  totalBattles: number;
  wins: number;
  losses: number;
  averageTurns: number;
}

// 勝率テーブルの結果
export interface WinRateTable {
  thunder: Thunder;
  results: {
    preset: string;
    items: {
      item: string;
      winRate: number;
    }[];
  }[];
  customMetagross?: SimulationResult;
}
