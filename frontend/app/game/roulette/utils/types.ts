// Tipos de apuestas
export type BetType = {
  type: 'number' | 'red' | 'black' | 'even' | 'odd' | 'first12' | 'second12' | 'third12' | 
        'first18' | 'second18' | 'column1' | 'column2' | 'column3' | 'twoToOne';
  numbers: number[];
  payout: number;
  position?: { row: number; col: number };
};
