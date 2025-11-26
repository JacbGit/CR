// Configuración de la ruleta europea
export const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// Tipos de apuestas y sus multiplicadores
export enum RouletteBetType {
  // Apuestas directas
  STRAIGHT = 'straight',           // Número directo (35:1)
  
  // Apuestas de color
  RED = 'red',                      // Rojo (1:1)
  BLACK = 'black',                  // Negro (1:1)
  
  // Apuestas par/impar
  EVEN = 'even',                    // Par (1:1)
  ODD = 'odd',                      // Impar (1:1)
  
  // Apuestas de rango
  FIRST_18 = 'first18',             // 1-18 (1:1)
  SECOND_18 = 'second18',           // 19-36 (1:1)
  
  // Apuestas de docenas
  FIRST_12 = 'first12',             // 1-12 (2:1)
  SECOND_12 = 'second12',           // 13-24 (2:1)
  THIRD_12 = 'third12',             // 25-36 (2:1)
  
  // Apuestas de columnas
  COLUMN_1 = 'column1',             // Columna 1 (2:1)
  COLUMN_2 = 'column2',             // Columna 2 (2:1)
  COLUMN_3 = 'column3',             // Columna 3 (2:1)
}

export const BET_PAYOUTS: Record<RouletteBetType, number> = {
  [RouletteBetType.STRAIGHT]: 35,
  [RouletteBetType.RED]: 1,
  [RouletteBetType.BLACK]: 1,
  [RouletteBetType.EVEN]: 1,
  [RouletteBetType.ODD]: 1,
  [RouletteBetType.FIRST_18]: 1,
  [RouletteBetType.SECOND_18]: 1,
  [RouletteBetType.FIRST_12]: 2,
  [RouletteBetType.SECOND_12]: 2,
  [RouletteBetType.THIRD_12]: 2,
  [RouletteBetType.COLUMN_1]: 2,
  [RouletteBetType.COLUMN_2]: 2,
  [RouletteBetType.COLUMN_3]: 2,
};
