// Asumo que tienes una interfaz para el resultado de la rueda
interface WheelResult {
  won: boolean;
  winAmount: number;
  multiplier: number;
  label: string;
  betAmount: number;
}

interface WheelResultDisplayProps {
  result: WheelResult | null;
  showingResult: boolean;
  betAmount: number;
}

export default function WheelResultDisplay({ result, showingResult, betAmount }: WheelResultDisplayProps) {
  if (!result || !showingResult) {
    return null;
  }
  
  const netProfit = result.winAmount - (result.betAmount || betAmount);
  
  // Condición simplificada: es Ganancia si netProfit > 0. Si es 0 o menos, es Pérdida.
  const isWin = netProfit > 0;
  const isLossOrDraw = netProfit <= 0; // Incluye empate (netProfit = 0) y pérdida (netProfit < 0)

  return (
    <div className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 text-center animate-fade-in-up border-4 mt-6 ${
      isWin 
        ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-700 border-green-300 animate-pulse-glow' // Color verde para ganancias
        : 'bg-gradient-to-r from-red-600 to-red-800 border-red-900' // Color rojo para pérdida (incluye empate)
    }`}>
      
      {/* Mensaje detallado (Solo si hay ganancia neta) */}
      {isWin && (
        <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
          ¡Ganaste {result.multiplier}x en {result.label}!
        </h2>
      )}
      
      {/* Título principal: GANASTE o PERDISTE */}
      <h3 className="text-4xl font-black text-white mb-3">
        {isWin ? '🎉 ¡GANASTE! 🎉' : '😢 PERDISTE'}
      </h3>
      
      {/* Mostrar el MONTO. Si el netProfit es 0, sigue mostrando $0.00. */}
      <p className="text-5xl font-black text-white drop-shadow-lg">
        {isWin 
          ? `+$${netProfit.toFixed(2)}` // Ganancia: +$X.XX
          : isLossOrDraw 
            ? `-$${Math.abs(netProfit).toFixed(2)}` // Pérdida (o $0.00 si es empate)
            : `$0.00` // (Este caso nunca debería darse con la lógica anterior, pero se mantiene como seguro)
        }
      </p>
    </div>
  );
}