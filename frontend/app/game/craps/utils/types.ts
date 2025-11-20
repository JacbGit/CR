export interface DiceResult {
  won: boolean;
  dice1: number;
  dice2: number;
  total: number;
  winAmount: number;
  winType: string;
  multiplier: number;
}

export type BetType = 'pass' | 'dont-pass' | 'field' | 'any-craps' | 'any-seven';
