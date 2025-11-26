export type BingoPattern = 
  | 'line_horizontal'
  | 'line_vertical'
  | 'line_diagonal'
  | 'four_corners'
  | 'x_pattern'
  | 'full_card';

export interface BingoGameResult {
  won: boolean;
  card: number[];
  pattern: BingoPattern;
  drawnBalls: number[];
  markedPositions: number[];
  ballsDrawn: number;
  completedPattern: boolean;
  allCompletedPatterns: BingoPattern[];
  winAmount?: number;
}

export interface BingoPlayRequest {
  amount: number;
  pattern: BingoPattern;
  customCard?: number[];
}

export interface PatternInfo {
  name: string;
  description: string;
  multiplier: number;
  difficulty: 'easy' | 'medium' | 'hard';
}