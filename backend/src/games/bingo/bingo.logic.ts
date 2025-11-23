import {
  BINGO_CONFIG,
  COLUMN_RANGES,
  BingoPattern,
  PATTERN_POSITIONS,
  PATTERN_PAYOUTS,
} from './bingo.constants';

export class BingoLogic {
  /**
   * Genera un cartón de bingo válido
   * Retorna un array de 25 números (5x5), con el centro como espacio libre (0)
   */
  static generateCard(): number[] {
    const card: number[] = [];
    
    // Generar números para cada columna
    const columns = [
      this.getRandomNumbers(COLUMN_RANGES.B.min, COLUMN_RANGES.B.max, 5),
      this.getRandomNumbers(COLUMN_RANGES.I.min, COLUMN_RANGES.I.max, 5),
      this.getRandomNumbers(COLUMN_RANGES.N.min, COLUMN_RANGES.N.max, 5),
      this.getRandomNumbers(COLUMN_RANGES.G.min, COLUMN_RANGES.G.max, 5),
      this.getRandomNumbers(COLUMN_RANGES.O.min, COLUMN_RANGES.O.max, 5),
    ];

    // Construir el cartón fila por fila
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        card.push(columns[col][row]);
      }
    }

    // Marcar el espacio libre en el centro (posición 12)
    card[BINGO_CONFIG.FREE_SPACE_POSITION] = 0;

    return card;
  }

  /**
   * Obtiene números aleatorios únicos dentro de un rango
   */
  private static getRandomNumbers(min: number, max: number, count: number): number[] {
    const numbers: number[] = [];
    const available = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      numbers.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    return numbers;
  }

  /**
   * Sortea bolas hasta que se complete un patrón o se alcance el límite
   * Retorna las bolas sorteadas
   */
  static drawBalls(card: number[], pattern: BingoPattern, maxBalls: number = 75): {
    drawnBalls: number[];
    markedPositions: number[];
    completedPattern: boolean;
    ballsDrawn: number;
  } {
    const drawnBalls: number[] = [];
    const markedPositions: number[] = [BINGO_CONFIG.FREE_SPACE_POSITION]; // El centro ya está marcado
    const availableBalls = Array.from(
      { length: BINGO_CONFIG.MAX_NUMBER },
      (_, i) => i + 1
    );

    // Sortear bolas hasta completar el patrón o alcanzar el límite
    while (drawnBalls.length < maxBalls) {
      // Sortear una bola
      const randomIndex = Math.floor(Math.random() * availableBalls.length);
      const ball = availableBalls[randomIndex];
      availableBalls.splice(randomIndex, 1);
      drawnBalls.push(ball);

      // Verificar si la bola está en el cartón
      const positionInCard = card.indexOf(ball);
      if (positionInCard !== -1 && !markedPositions.includes(positionInCard)) {
        markedPositions.push(positionInCard);
      }

      // Verificar si se completó el patrón
      if (this.checkPattern(markedPositions, pattern)) {
        return {
          drawnBalls,
          markedPositions,
          completedPattern: true,
          ballsDrawn: drawnBalls.length,
        };
      }
    }

    return {
      drawnBalls,
      markedPositions,
      completedPattern: false,
      ballsDrawn: drawnBalls.length,
    };
  }

  /**
   * Verifica si un patrón se ha completado
   * CORREGIDO: Ahora verifica correctamente cada patrón
   */
  static checkPattern(markedPositions: number[], pattern: BingoPattern): boolean {
    const patternVariants = PATTERN_POSITIONS[pattern];

    // CASO ESPECIAL: Patrón X requiere AMBAS diagonales
    if (pattern === BingoPattern.X_PATTERN) {
      const diagonal1 = [0, 6, 12, 18, 24]; // \
      const diagonal2 = [4, 8, 12, 16, 20]; // /
      
      const diagonal1Complete = diagonal1.every((pos) => markedPositions.includes(pos));
      const diagonal2Complete = diagonal2.every((pos) => markedPositions.includes(pos));
      
      return diagonal1Complete && diagonal2Complete;
    }

    // CASO ESPECIAL: Four Corners requiere las 4 esquinas
    if (pattern === BingoPattern.FOUR_CORNERS) {
      const corners = [0, 4, 20, 24];
      return corners.every((pos) => markedPositions.includes(pos));
    }

    // CASO ESPECIAL: Full Card requiere todas las 25 posiciones
    if (pattern === BingoPattern.FULL_CARD) {
      // Verificar que todas las 25 posiciones estén marcadas
      const allPositions = Array.from({ length: 25 }, (_, i) => i);
      return allPositions.every((pos) => markedPositions.includes(pos));
    }

    // Para LINE_HORIZONTAL, LINE_VERTICAL, LINE_DIAGONAL:
    // Verificar si AL MENOS UNA de las variantes está completa
    for (const variant of patternVariants) {
      const isComplete = variant.every((pos) => markedPositions.includes(pos));
      if (isComplete) {
        return true; // Basta con que UNA línea esté completa
      }
    }

    return false;
  }

  /**
   * Calcula las ganancias según el número de bolas sorteadas
   * Menos bolas = mayor premio
   */
  static calculateWinnings(
    betAmount: number,
    pattern: BingoPattern,
    ballsDrawn: number,
    completed: boolean
  ): number {
    if (!completed) {
      return 0;
    }

    const baseMultiplier = PATTERN_PAYOUTS[pattern];

    // Bonus por eficiencia (completar con pocas bolas)
    let efficiencyBonus = 1;
    if (ballsDrawn <= 20) {
      efficiencyBonus = 2.5; // 250% bonus
    } else if (ballsDrawn <= 30) {
      efficiencyBonus = 2; // 200% bonus
    } else if (ballsDrawn <= 40) {
      efficiencyBonus = 1.5; // 150% bonus
    } else if (ballsDrawn <= 50) {
      efficiencyBonus = 1.25; // 125% bonus
    }

    return betAmount * baseMultiplier * efficiencyBonus;
  }

  /**
   * Valida que un cartón sea válido
   */
  static validateCard(card: number[]): { valid: boolean; error?: string } {
    if (card.length !== 25) {
      return { valid: false, error: 'El cartón debe tener 25 números' };
    }

    // Verificar que el centro sea 0 (espacio libre)
    if (card[BINGO_CONFIG.FREE_SPACE_POSITION] !== 0) {
      return { valid: false, error: 'El centro debe ser un espacio libre (0)' };
    }

    // Verificar que todos los números estén en el rango correcto
    for (let i = 0; i < 25; i++) {
      if (i === BINGO_CONFIG.FREE_SPACE_POSITION) continue;

      const num = card[i];
      if (num < BINGO_CONFIG.MIN_NUMBER || num > BINGO_CONFIG.MAX_NUMBER) {
        return {
          valid: false,
          error: `Número inválido: ${num}. Debe estar entre ${BINGO_CONFIG.MIN_NUMBER} y ${BINGO_CONFIG.MAX_NUMBER}`,
        };
      }
    }

    // Verificar que no haya duplicados (excepto el 0 del centro)
    const numbers = card.filter((n) => n !== 0);
    const uniqueNumbers = new Set(numbers);
    if (numbers.length !== uniqueNumbers.size) {
      return { valid: false, error: 'El cartón tiene números duplicados' };
    }

    return { valid: true };
  }

  /**
   * Determina qué patrón(es) completó el jugador
   * CORREGIDO: Usa el mismo checkPattern mejorado
   */
  static getCompletedPatterns(markedPositions: number[]): BingoPattern[] {
    const completed: BingoPattern[] = [];

    for (const pattern of Object.values(BingoPattern)) {
      if (this.checkPattern(markedPositions, pattern)) {
        completed.push(pattern);
      }
    }

    return completed;
  }
}