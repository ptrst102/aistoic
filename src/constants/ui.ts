// UIに関する定数

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  spAttack: 'とくこう',
  spDefense: 'とくぼう',
  speed: 'すばやさ',
} as const

export const STAT_KEYS = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'] as const