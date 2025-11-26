import { PRIZE_TABLE } from '../utils/constants';

export default function PrizeTable() {
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border-4 border-yellow-400 animate-fade-in-up">
      <h2 className="text-2xl font-black text-yellow-400 text-center mb-4">💎 TABLA DE PREMIOS 💎</h2>
      <div className="grid grid-cols-3 gap-4">
        {PRIZE_TABLE.map((prize, index) => (
          <div key={index} className="bg-yellow-700/50 rounded-lg p-3 text-center border-2 border-yellow-400">
            <div className="text-4xl mb-1">{prize.symbols}</div>
            <div className="text-yellow-300 font-black text-sm">
              x{prize.multiplier} {prize.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
