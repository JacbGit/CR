import {
  WHEEL_SEGMENTS,
  WHEEL_CONFIG,
  WheelSegment,
} from './wheel.constants';

export class WheelLogic {
  /**
   * Selecciona un segmento ganador basado en probabilidades
   */
  static spin(): { segment: WheelSegment; rotation: number } {
    // Calcular probabilidad total
    const totalProbability = WHEEL_SEGMENTS.reduce(
      (sum, seg) => sum + seg.probability,
      0
    );

    // Generar número aleatorio ponderado
    let random = Math.random() * totalProbability;
    let selectedSegment = WHEEL_SEGMENTS[0];

    for (const segment of WHEEL_SEGMENTS) {
      random -= segment.probability;
      if (random <= 0) {
        selectedSegment = segment;
        break;
      }
    }

    // Calcular rotación final
    const baseRotation = WHEEL_CONFIG.MIN_SPINS * 360; // Mínimo de vueltas
    const randomSpins = Math.random() * (WHEEL_CONFIG.MAX_SPINS - WHEEL_CONFIG.MIN_SPINS) * 360;
    const segmentAngle = selectedSegment.id * WHEEL_CONFIG.ANGLE_PER_SEGMENT;
    const offsetAngle = Math.random() * WHEEL_CONFIG.ANGLE_PER_SEGMENT; // Variación dentro del segmento

    const totalRotation = baseRotation + randomSpins + segmentAngle + offsetAngle;

    return {
      segment: selectedSegment,
      rotation: totalRotation,
    };
  }

  /**
   * Calcula las ganancias
   */
  static calculateWinnings(betAmount: number, multiplier: number): number {
    return betAmount * multiplier;
  }
}