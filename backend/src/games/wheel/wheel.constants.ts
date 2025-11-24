// wheel.constants.ts

export interface WheelSegment {
  id: number;
  multiplier: number;
  probability: number; // Peso para la probabilidad
  color: string;
  label: string;
}

export interface WheelConfig {
  TOTAL_SEGMENTS: number;
  ANGLE_PER_SEGMENT: number;
  MIN_SPINS: number;
  MAX_SPINS: number;
}

// Configuración de la rueda (12 segmentos)
export const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 0, multiplier: 1.2, probability: 15, color: '#3B82F6', label: '1.2x' },    // Azul - Ganas poco
  { id: 1, multiplier: 0.5, probability: 20, color: '#6B7280', label: '0.5x' },    // Gris - PIERDES 50%
  { id: 2, multiplier: 2, probability: 12, color: '#F59E0B', label: '2x' },        // Amarillo
  { id: 3, multiplier: 0, probability: 15, color: '#1F2937', label: '0x' },     // Negro - PIERDES TODO (¡Pérdida total!)
  { id: 4, multiplier: 3, probability: 10, color: '#8B5CF6', label: '3x' },        // Púrpura
  { id: 5, multiplier: 1.5, probability: 12, color: '#10B981', label: '1.5x' },    // Verde
  { id: 6, multiplier: 5, probability: 5, color: '#EC4899', label: '5x' },         // Rosa
  { id: 7, multiplier: 0.8, probability: 18, color: '#9CA3AF', label: '0.8x' },    // Gris claro - PIERDES 20%
  { id: 8, multiplier: 2, probability: 10, color: '#F59E0B', label: '2x' },        // Amarillo
  { id: 9, multiplier: 10, probability: 3, color: '#EF4444', label: '10x' },       // Rojo
  { id: 10, multiplier: 1.5, probability: 8, color: '#10B981', label: '1.5x' },    // Verde
  { id: 11, multiplier: 50, probability: 1, color: '#FCD34D', label: '50x' },   // Dorado (JACKPOT)
];

export const WHEEL_CONFIG: WheelConfig = {
  TOTAL_SEGMENTS: WHEEL_SEGMENTS.length,
  ANGLE_PER_SEGMENT: 360 / WHEEL_SEGMENTS.length,
  MIN_SPINS: 4,
  MAX_SPINS: 7,
};