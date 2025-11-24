export interface WheelSegment {
  id: number;
  multiplier: number;
  probability: number; // Peso para la probabilidad
  color: string;
  label: string;
}

// Configuración de la rueda (12 segmentos)
export const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 0, multiplier: 1.2, probability: 20, color: '#3B82F6', label: '1.2x' },    // Azul
  { id: 1, multiplier: 1.5, probability: 15, color: '#10B981', label: '1.5x' },    // Verde
  { id: 2, multiplier: 2, probability: 12, color: '#F59E0B', label: '2x' },        // Amarillo
  { id: 3, multiplier: 1.2, probability: 20, color: '#3B82F6', label: '1.2x' },    // Azul
  { id: 4, multiplier: 3, probability: 10, color: '#8B5CF6', label: '3x' },        // Púrpura
  { id: 5, multiplier: 1.5, probability: 15, color: '#10B981', label: '1.5x' },    // Verde
  { id: 6, multiplier: 5, probability: 5, color: '#EC4899', label: '5x' },         // Rosa
  { id: 7, multiplier: 1.2, probability: 20, color: '#3B82F6', label: '1.2x' },    // Azul
  { id: 8, multiplier: 2, probability: 12, color: '#F59E0B', label: '2x' },        // Amarillo
  { id: 9, multiplier: 10, probability: 3, color: '#EF4444', label: '10x' },       // Rojo
  { id: 10, multiplier: 1.5, probability: 15, color: '#10B981', label: '1.5x' },   // Verde
  { id: 11, multiplier: 50, probability: 1, color: '#FCD34D', label: '🎰 50x' },   // Dorado (JACKPOT)
];

export const WHEEL_CONFIG = {
  TOTAL_SEGMENTS: 12,
  ANGLE_PER_SEGMENT: 360 / 12, // 30 grados por segmento
  MIN_SPINS: 3, // Mínimo 3 vueltas completas
  MAX_SPINS: 5, // Máximo 5 vueltas completas
};
