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

    // ✅ CORRECCIÓN: La rueda debe girar en sentido ANTIHORARIO para que el puntero superior caiga en el segmento correcto
    
    // 1. Vueltas base (mínimo de giros completos para efecto dramático)
    const baseRotation = WHEEL_CONFIG.MIN_SPINS * 360;
    
    // 2. Vueltas extra aleatorias (completas)
    const extraSpins = Math.floor(Math.random() * (WHEEL_CONFIG.MAX_SPINS - WHEEL_CONFIG.MIN_SPINS + 1)) * 360;
    
    // 3. Ángulo del segmento seleccionado
    const segmentAngle = selectedSegment.id * WHEEL_CONFIG.ANGLE_PER_SEGMENT;
    
    // 4. Offset aleatorio dentro del segmento (centrado)
    const offsetAngle = WHEEL_CONFIG.ANGLE_PER_SEGMENT / 2 + (Math.random() * 10 - 5);
    
    // 5. ✅ CLAVE: Restar en lugar de sumar para compensar el sentido de rotación CSS
    // La rueda gira en sentido horario visualmente, pero queremos que el puntero apunte al segmento
    const finalAngle = 360 - segmentAngle - offsetAngle;
    
    // 6. Rotación total (siempre positiva)
    const totalRotation = baseRotation + extraSpins + finalAngle;

    return {
      segment: selectedSegment,
      rotation: totalRotation,
    };
  }

  /**
   * Calcula las ganancias (Total devuelto)
   */
  static calculateWinAmount(betAmount: number, multiplier: number): number {
    return betAmount * multiplier;
  }
}