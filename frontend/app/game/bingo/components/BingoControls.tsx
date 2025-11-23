import React from 'react';

interface BingoControlsProps {
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  onPlay: () => void;
  onNewCard: () => void;
  isPlaying: boolean;
  disabled: boolean;
  balance: number;
}

export const BingoControls: React.FC<BingoControlsProps> = ({
  betAmount,
  onBetAmountChange,
  onPlay,
  onNewCard,
  isPlaying,
  disabled,
  balance,
}) => {
  const betPresets = [10, 25, 50, 100, 250];

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Monto de Apuesta
        </label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => onBetAmountChange(Number(e.target.value))}
          disabled={disabled}
          min="1"
          max={balance}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {betPresets.map((amount) => (
          <button
            key={amount}
            onClick={() => onBetAmountChange(amount)}
            disabled={disabled || amount > balance}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ${amount}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <button
          onClick={onPlay}
          disabled={disabled || betAmount > balance || betAmount <= 0}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-black text-xl uppercase tracking-wide shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPlaying ? '🎱 JUGANDO...' : '🎱 JUGAR BINGO'}
        </button>

        <button
          onClick={onNewCard}
          disabled={disabled}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold uppercase tracking-wide shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔄 Nuevo Cartón
        </button>
      </div>

      <div className="pt-4 border-t border-gray-700 text-center">
        <div className="text-sm text-gray-400">Tu balance</div>
        <div className="text-2xl font-black text-yellow-400">${balance.toFixed(2)}</div>
      </div>
    </div>
  );
};