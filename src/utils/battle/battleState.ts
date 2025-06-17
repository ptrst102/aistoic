// 状態異常の型定義
export type StatusCondition = "none" | "paralysis" | "sleep";

// ポケモンの戦闘状態
export interface PokemonBattleState {
  currentHP: number;
  maxHP: number;
  status: StatusCondition;
  sleepTurns: number;
  hasUsedLumBerry: boolean;
  hasUsedSitrusBerry: boolean;
  hasUsedPinchBerry: boolean;
  statBoosts: {
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
}

// バトル全体の状態
export interface BattleState {
  thunder: PokemonBattleState;
  metagross: PokemonBattleState;
}
