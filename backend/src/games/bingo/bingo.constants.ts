// Configuración del Bingo

export const BINGO_CONFIG = {
  CARD_SIZE: 5,
  MIN_NUMBER: 1,
  MAX_NUMBER: 75,
  BALLS_PER_DRAW: 1,
  FREE_SPACE_POSITION: 12, // Centro del cartón (index en array de 25)
};

// Rangos de números por columna (Bingo Americano)
export const COLUMN_RANGES = {
  B: { min: 1, max: 15 },   // B: 1-15
  I: { min: 16, max: 30 },  // I: 16-30
  N: { min: 31, max: 45 },  // N: 31-45
  G: { min: 46, max: 60 },  // G: 46-60
  O: { min: 61, max: 75 },  // O: 61-75
};

// Patrones ganadores (en orden de dificultad y pago)
export enum BingoPattern {
  // Básicos (más fáciles)
  LINE_HORIZONTAL = 'line_horizontal',  // Cualquier línea horizontal
  LINE_VERTICAL = 'line_vertical',      // Cualquier línea vertical
  LINE_DIAGONAL = 'line_diagonal',      // Cualquier diagonal
  
  // Intermedios
  FOUR_CORNERS = 'four_corners',        // Las 4 esquinas
  X_PATTERN = 'x_pattern',              // Las dos diagonales
  
  // Avanzados
  FULL_CARD = 'full_card',              // Cartón completo (blackout)
}

// Multiplicadores de pago según el patrón
export const PATTERN_PAYOUTS: Record<BingoPattern, number> = {
  [BingoPattern.LINE_HORIZONTAL]: 5,
  [BingoPattern.LINE_VERTICAL]: 5,
  [BingoPattern.LINE_DIAGONAL]: 8,
  [BingoPattern.FOUR_CORNERS]: 10,
  [BingoPattern.X_PATTERN]: 15,
  [BingoPattern.FULL_CARD]: 50,
};

// Definición de cada patrón (posiciones en el cartón de 25 espacios)
export const PATTERN_POSITIONS: Record<BingoPattern, number[][]> = {
  [BingoPattern.LINE_HORIZONTAL]: [
    [0, 1, 2, 3, 4],     // Fila 1
    [5, 6, 7, 8, 9],     // Fila 2
    [10, 11, 12, 13, 14], // Fila 3
    [15, 16, 17, 18, 19], // Fila 4
    [20, 21, 22, 23, 24], // Fila 5
  ],
  [BingoPattern.LINE_VERTICAL]: [
    [0, 5, 10, 15, 20],   // Columna B
    [1, 6, 11, 16, 21],   // Columna I
    [2, 7, 12, 17, 22],   // Columna N
    [3, 8, 13, 18, 23],   // Columna G
    [4, 9, 14, 19, 24],   // Columna O
  ],
  [BingoPattern.LINE_DIAGONAL]: [
    [0, 6, 12, 18, 24],   // Diagonal \
    [4, 8, 12, 16, 20],   // Diagonal /
  ],
  [BingoPattern.FOUR_CORNERS]: [
    [0, 4, 20, 24],       // Las 4 esquinas
  ],
  [BingoPattern.X_PATTERN]: [
    // Para X_PATTERN la lógica está en checkPattern()
    // Requiere AMBAS diagonales: [0,6,12,18,24] Y [4,8,12,16,20]
    [0, 6, 12, 18, 24, 4, 8, 16, 20], // Placeholder (no se usa en la lógica)
  ],
  [BingoPattern.FULL_CARD]: [
    Array.from({ length: 25 }, (_, i) => i), // Todos los números
  ],
};