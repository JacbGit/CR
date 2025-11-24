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
  const isDraw = netProfit === 0;

  return (
    <div className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 text-center animate-fade-in-up border-4 mt-6 ${
      netProfit > 0 
        ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-700 border-green-300 animate-pulse-glow' // Color verde para ganancias
        : isDraw 
          ? 'bg-gradient-to-r from-gray-500 to-gray-700 border-gray-400' // Color gris para empate
          : 'bg-gradient-to-r from-red-600 to-red-800 border-red-900' // Color rojo para pérdida
    }`}>
      {netProfit > 0 && (
        <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
          ¡Ganaste {result.multiplier}x en {result.label}!
        </h2>
      )}
      <h3 className="text-4xl font-black text-white mb-3">
        {netProfit > 0 ? '🎉 ¡GANASTE! 🎉' : isDraw ? '🤝 EMPATE 🤝' : '😢 PERDISTE'}
      </h3>
      <p className="text-5xl font-black text-white drop-shadow-lg">
        {netProfit > 0 ? `+$${netProfit.toFixed(2)}` : `-$${(result.betAmount || betAmount).toFixed(2)}`}
      </p>
    </div>
  );
}