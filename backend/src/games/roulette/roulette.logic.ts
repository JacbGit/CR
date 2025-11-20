import { RED_NUMBERS, BLACK_NUMBERS, RouletteBetType, BET_PAYOUTS } from './roulette.constants';

export interface BetDetail {
  betKey: string;
  amount: number;
}

export class RouletteLogic {
  /**
   * Gira la ruleta y devuelve el número ganador
   */
  static spin(): number {
    return Math.floor(Math.random() * 37);
  }

  /**
   * Verifica si una apuesta es ganadora
   */
  static isBetWinner(winningNumber: number, betKey: string): boolean {
    // Apuesta directa al número
    if (!isNaN(Number(betKey))) {
      return winningNumber === Number(betKey);
    }

    // Apuestas de color
    if (betKey === RouletteBetType.RED) {
      return RED_NUMBERS.includes(winningNumber);
    }
    if (betKey === RouletteBetType.BLACK) {
      return BLACK_NUMBERS.includes(winningNumber);
    }

    // Apuestas par/impar
    if (betKey === RouletteBetType.EVEN) {
      return winningNumber !== 0 && winningNumber % 2 === 0;
    }
    if (betKey === RouletteBetType.ODD) {
      return winningNumber % 2 === 1;
    }

    // Apuestas de rango
    if (betKey === RouletteBetType.FIRST_18) {
      return winningNumber >= 1 && winningNumber <= 18;
    }
    if (betKey === RouletteBetType.SECOND_18) {
      return winningNumber >= 19 && winningNumber <= 36;
    }

    // Apuestas de docenas
    if (betKey === RouletteBetType.FIRST_12) {
      return winningNumber >= 1 && winningNumber <= 12;
    }
    if (betKey === RouletteBetType.SECOND_12) {
      return winningNumber >= 13 && winningNumber <= 24;
    }
    if (betKey === RouletteBetType.THIRD_12) {
      return winningNumber >= 25 && winningNumber <= 36;
    }

    // Apuestas de columnas
    if (betKey === RouletteBetType.COLUMN_1) {
      return winningNumber > 0 && winningNumber % 3 === 1;
    }
    if (betKey === RouletteBetType.COLUMN_2) {
      return winningNumber > 0 && winningNumber % 3 === 2;
    }
    if (betKey === RouletteBetType.COLUMN_3) {
      return winningNumber > 0 && winningNumber % 3 === 0;
    }

    // Apuestas múltiples (Split, Street, Corner, Line)
    // Formato esperado: "1-2", "1-2-3", "1-2-4-5", etc.
    if (betKey.includes('-')) {
      const numbers = betKey.split('-').map(Number);
      // Verificar que todos sean números válidos
      if (numbers.every(n => !isNaN(n))) {
        return numbers.includes(winningNumber);
      }
    }

    return false;
  }

  /**
   * Calcula el multiplicador para un tipo de apuesta
   */
  static getMultiplier(betKey: string): number {
    // Apuesta directa al número
    if (!isNaN(Number(betKey))) {
      return 35;
    }

    // Apuestas múltiples (Split, Street, Corner, Line)
    if (betKey.includes('-')) {
      const numbers = betKey.split('-').map(Number);
      if (numbers.every(n => !isNaN(n))) {
        const count = numbers.length;
        if (count > 0) {
          // Fórmula estándar: (36 / n) - 1
          // 2 nums -> 17
          // 3 nums -> 11
          // 4 nums -> 8
          // 6 nums -> 5
          return Math.floor(36 / count) - 1;
        }
      }
    }

    // Buscar en los tipos de apuesta conocidos
    const betType = betKey as RouletteBetType;
    return BET_PAYOUTS[betType] || 0;
  }

  /**
   * Calcula las ganancias totales para todas las apuestas
   */
  static calculateWinnings(winningNumber: number, bets: BetDetail[]): {
    totalWinnings: number;
    winningBets: Array<{ betKey: string; amount: number; payout: number; winAmount: number }>;
  } {
    let totalWinnings = 0;
    const winningBets = [];

    for (const bet of bets) {
      const isWinner = this.isBetWinner(winningNumber, bet.betKey);
      
      if (isWinner) {
        const multiplier = this.getMultiplier(bet.betKey);
        const winAmount = bet.amount * (multiplier + 1); // multiplier + apuesta original
        totalWinnings += winAmount;
        
        winningBets.push({
          betKey: bet.betKey,
          amount: bet.amount,
          payout: multiplier,
          winAmount,
        });
      }
    }

    return { totalWinnings, winningBets };
  }

  /**
   * Calcula el total apostado
   */
  static calculateTotalBet(bets: BetDetail[]): number {
    return bets.reduce((total, bet) => total + bet.amount, 0);
  }

  /**
   * Valida que todas las apuestas sean válidas
   */
  static validateBets(bets: BetDetail[]): { valid: boolean; error?: string } {
    if (!bets || bets.length === 0) {
      return { valid: false, error: 'Debes realizar al menos una apuesta' };
    }

    for (const bet of bets) {
      if (bet.amount <= 0) {
        return { valid: false, error: 'Todas las apuestas deben ser mayores a 0' };
      }

      // Validar que el betKey sea válido
      const isNumber = !isNaN(Number(bet.betKey));
      const isValidBetType = Object.values(RouletteBetType).includes(bet.betKey as RouletteBetType);
      
      // Validar apuestas múltiples (Split, Street, etc.)
      let isMultiBet = false;
      if (bet.betKey.includes('-')) {
        const parts = bet.betKey.split('-');
        // Verificar que todas las partes sean números
        if (parts.every(p => !isNaN(Number(p)))) {
          isMultiBet = true;
        }
      }

      if (!isNumber && !isValidBetType && !isMultiBet) {
        return { valid: false, error: `Tipo de apuesta inválido: ${bet.betKey}` };
      }

      // Si es un número, validar que esté en el rango 0-36
      if (isNumber) {
        const num = Number(bet.betKey);
        if (num < 0 || num > 36) {
          return { valid: false, error: `Número de apuesta inválido: ${num}` };
        }
      }
    }

    return { valid: true };
  }
}
