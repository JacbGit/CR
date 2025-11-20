import { RED_NUMBERS, BLACK_NUMBERS } from './constants';

/**
 * Calcula las ganancias basado en el número ganador y las apuestas realizadas
 */
export const calculateWinnings = (
  winningNumber: number,
  bets: Map<string, number>
): number => {
  let totalWinnings = 0;

  bets.forEach((betAmount, betKey) => {
    // Apuesta directa al número (35:1 + apuesta original = 36x)
    if (betKey === winningNumber.toString()) {
      totalWinnings += betAmount * 36;
    }
    
    // Rojo/Negro (1:1 + apuesta original = 2x)
    if (betKey === 'red' && RED_NUMBERS.includes(winningNumber)) {
      totalWinnings += betAmount * 2;
    }
    if (betKey === 'black' && BLACK_NUMBERS.includes(winningNumber)) {
      totalWinnings += betAmount * 2;
    }
    
    // Par/Impar (1:1 + apuesta original = 2x)
    if (betKey === 'even' && winningNumber !== 0 && winningNumber % 2 === 0) {
      totalWinnings += betAmount * 2;
    }
    if (betKey === 'odd' && winningNumber % 2 === 1) {
      totalWinnings += betAmount * 2;
    }
    
    // 1-18 / 19-36 (1:1 + apuesta original = 2x)
    if (betKey === 'first18' && winningNumber >= 1 && winningNumber <= 18) {
      totalWinnings += betAmount * 2;
    }
    if (betKey === 'second18' && winningNumber >= 19 && winningNumber <= 36) {
      totalWinnings += betAmount * 2;
    }
    
    // Docenas (2:1 + apuesta original = 3x)
    if (betKey === 'first12' && winningNumber >= 1 && winningNumber <= 12) {
      totalWinnings += betAmount * 3;
    }
    if (betKey === 'second12' && winningNumber >= 13 && winningNumber <= 24) {
      totalWinnings += betAmount * 3;
    }
    if (betKey === 'third12' && winningNumber >= 25 && winningNumber <= 36) {
      totalWinnings += betAmount * 3;
    }
    
    // Columnas (2:1 + apuesta original = 3x)
    if (betKey === 'column1' && winningNumber > 0 && winningNumber % 3 === 1) {
      totalWinnings += betAmount * 3;
    }
    if (betKey === 'column2' && winningNumber > 0 && winningNumber % 3 === 2) {
      totalWinnings += betAmount * 3;
    }
    if (betKey === 'column3' && winningNumber > 0 && winningNumber % 3 === 0) {
      totalWinnings += betAmount * 3;
    }
  });

  return totalWinnings;
};

/**
 * Calcula el total de apuestas realizadas
 */
export const getTotalBet = (bets: Map<string, number>): number => {
  let total = 0;
  bets.forEach((value) => {
    total += value;
  });
  return total;
};
