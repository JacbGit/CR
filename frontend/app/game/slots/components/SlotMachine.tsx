import Reel from './Reel';

interface SlotMachineProps {
  displaySymbols: string[];
  stoppedReels: boolean[];
  betAmount: number;
  currentBalance: number;
  spinning: boolean;
  onBetAmountChange: (amount: number) => void;
  onSpin: () => void;
}

export default function SlotMachine({
  displaySymbols,
  stoppedReels,
  betAmount,
  currentBalance,
  spinning,
  onBetAmountChange,
  onSpin
}: SlotMachineProps) {
  return (
    <div 
      className="bg-gradient-to-b from-yellow-600 to-yellow-900 rounded-3xl shadow-2xl p-8 border-8 border-yellow-400 w-full max-w-xl"
      style={{boxShadow: '0 0 50px rgba(255,200,0,0.7), inset 0 0 30px rgba(0,0,0,0.3)'}}
    >
      <div className="text-center mb-6">
        <h2 className="casino-title text-3xl text-red-800 drop-shadow-lg">🎰 Tragamonedas Deluxe 🎰</h2>
      </div>

      {/* Rodillos */}
      <div className="flex justify-center gap-6 mb-8 bg-black/20 rounded-2xl p-6 border-4 border-red-600">
        {displaySymbols.map((symbol, index) => (
          <Reel 
            key={index}
            symbol={symbol}
            stopped={stoppedReels[index]}
            index={index}
          />
        ))}
      </div>

      {/* Apuesta y Botón */}
      <div className="space-y-4">
        <div className="bg-red-700/30 rounded-lg p-4 border-2 border-red-600">
          <label className="block text-white font-black mb-2 text-center text-lg">💵 APUESTA</label>
          <input
            type="number"
            min="0"
            max={currentBalance}
            value={betAmount === 0 ? '' : betAmount}
            onChange={(e) => {
              const val = e.target.value;
              onBetAmountChange(val === '' ? 0 : parseInt(val));
            }}
            className="w-full px-4 py-3 border-4 border-yellow-500 rounded-lg text-gray-900 font-black text-2xl text-center bg-yellow-100"
            disabled={spinning}
          />
        </div>

        <button
          onClick={onSpin}
          disabled={spinning || betAmount < 1 || betAmount > currentBalance}
          className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900 text-yellow-300 font-black py-6 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed text-3xl shadow-2xl border-4 border-yellow-400 transform hover:scale-105 active:scale-95 drop-shadow-lg"
          style={{textShadow: '0 0 10px rgba(0,0,0,0.8)'}}
        >
          {spinning ? '🎰 GIRANDO...' : '🎰 ¡GIRAR! 🎰'}
        </button>
      </div>
    </div>
  );
}
