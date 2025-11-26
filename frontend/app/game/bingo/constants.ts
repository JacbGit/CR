import type { BingoPattern, PatternInfo } from './types';

export const PATTERN_INFO: Record<BingoPattern, PatternInfo> = {
  line_horizontal: {
    name: '📏 Línea Horizontal',
    description: 'Completa cualquier fila horizontal',
    multiplier: 5,
    difficulty: 'easy',
  },
  line_vertical: {
    name: '📏 Línea Vertical',
    description: 'Completa cualquier columna vertical',
    multiplier: 5,
    difficulty: 'easy',
  },
  line_diagonal: {
    name: '📐 Línea Diagonal',
    description: 'Completa cualquiera de las diagonales',
    multiplier: 8,
    difficulty: 'easy',
  },
  four_corners: {
    name: '⬜ Cuatro Esquinas',
    description: 'Marca las 4 esquinas del cartón',
    multiplier: 10,
    difficulty: 'medium',
  },
  x_pattern: {
    name: '❌ Patrón X',
    description: 'Completa ambas diagonales formando una X',
    multiplier: 15,
    difficulty: 'medium',
  },
  full_card: {
    name: '🎯 Cartón Completo',
    description: 'Marca todos los números del cartón (Blackout)',
    multiplier: 50,
    difficulty: 'hard',
  },
};

export const COLUMN_LETTERS = ['B', 'I', 'N', 'G', 'O'];

export const COLUMN_RANGES = {
  B: [1, 15],
  I: [16, 30],
  N: [31, 45],
  G: [46, 60],
  O: [61, 75],
};