import { DiceResult } from '../utils/types';

interface ResultPanelProps {
  result: DiceResult | null;
  betAmount: number;
}

export default function ResultPanel({ result, betAmount }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="bg-gray-800/70 rounded-2xl p-5 border-4 border-gray-600 text-center shadow-lg">
        <div className="text-3xl font-black text-gray-300 mb-2">🎲</div>
        <div className="text-gray-300 font-bold">
          Presiona LANZAR para comenzar
        </div>
        <div className="text-xs text-gray-400 mt-2">
          El destino te llama...
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-5 border-4 text-center space-y-3 transition-all ${
      result.won
        ? 'bg-gradient-to-b from-green-800/70 to-emerald-900/70 border-green-300 shadow-lg shadow-green-500/50'
        : 'bg-gradient-to-b from-red-800/70 to-rose-900/70 border-red-300 shadow-lg shadow-red-500/50'
    }`}>
      <div className={`text-5xl font-bold ${result.won ? 'animate-bounce' : ''}`}>
        {result.won ? '🎉' : '😢'}
      </div>
      <div className={`text-3xl font-black drop-shadow-lg ${result.won ? 'text-green-300' : 'text-red-300'}`}>
        {result.won ? '¡GANASTE!' : 'PERDISTE'}
      </div>
      <div className="text-sm text-gray-200 font-semibold uppercase tracking-wider">
        {result.winType?.replace(/_/g, ' ')}
      </div>
      <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent my-3"></div>
      <div className={`text-4xl font-black drop-shadow-lg ${result.won ? 'text-green-200' : 'text-red-200'}`}>
        {result.won ? (
          <span>+${(result.winAmount || 0).toFixed(2)}</span>
        ) : (
          <span>-${betAmount.toFixed(2)}</span>
        )}
      </div>
      {result.multiplier && result.multiplier > 1 && (
        <div className="bg-yellow-500/30 border-2 border-yellow-400 rounded-lg py-2 mt-2">
          <div className="text-2xl font-black text-yellow-200" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
            ×{result.multiplier}
          </div>
          <div className="text-xs text-yellow-100">MULTIPLICADOR</div>
        </div>
      )}
      <div className="text-sm text-gray-300 pt-3">
        {result.won ? (
          <span className="font-bold text-green-200">¡Excelente predicción!</span>
        ) : (
          <span className="font-bold text-red-200">Intenta nuevamente</span>
        )}
      </div>
    </div>
  );
}
