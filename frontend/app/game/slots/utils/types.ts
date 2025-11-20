export interface SlotsResult {
  won: boolean;
  symbols: string[];
  winAmount: number;
  winType?: string;
  multiplier?: number;
  betAmount?: number;
}
