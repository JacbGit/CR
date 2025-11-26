import { useState, useEffect } from 'react';

interface DiceDisplayProps {
  dice1: number;
  dice2: number;
  total: number;
  rolling: boolean;
}

export default function DiceDisplay({ dice1, dice2, total, rolling }: DiceDisplayProps) {
  const [animDice1, setAnimDice1] = useState(dice1);
  const [animDice2, setAnimDice2] = useState(dice2);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (rolling) {
      interval = setInterval(() => {
        setAnimDice1(Math.floor(Math.random() * 6) + 1);
        setAnimDice2(Math.floor(Math.random() * 6) + 1);
      }, 80);
    } else {
      setAnimDice1(dice1);
      setAnimDice2(dice2);
    }
    return () => clearInterval(interval);
  }, [rolling, dice1, dice2]);

  const currentDice1 = rolling ? animDice1 : dice1;
  const currentDice2 = rolling ? animDice2 : dice2;

  return (
    <div className="mb-8 relative">
      {/* Mesa de fieltro */}
      <div className="bg-green-800 rounded-3xl p-10 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] border-[12px] border-yellow-900/80 relative overflow-hidden">
        
        {/* Textura de fieltro */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
        
        <div className="flex justify-center items-center gap-16 relative z-10">
          {/* Dado 1 */}
          <div className={`transform transition-all duration-100 ${rolling ? 'animate-bounce rotate-12' : 'hover:scale-110 hover:-rotate-6'}`}>
            <div className="w-32 h-32 bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden border border-gray-200">
              {/* Brillo especular */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/80 via-transparent to-transparent opacity-50"></div>
              
              <img 
                src={`/images/dice/dice-${currentDice1}.svg`} 
                alt={`Dice ${currentDice1}`}
                className="w-full h-full p-2 object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Dado 2 */}
          <div className={`transform transition-all duration-100 ${rolling ? 'animate-bounce -rotate-12 delay-75' : 'hover:scale-110 hover:rotate-6'}`}>
            <div className="w-32 h-32 bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden border border-gray-200">
              {/* Brillo especular */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/80 via-transparent to-transparent opacity-50"></div>
              
              <img 
                src={`/images/dice/dice-${currentDice2}.svg`} 
                alt={`Dice ${currentDice2}`}
                className="w-full h-full p-2 object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Total Badge */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="bg-black/80 backdrop-blur-md text-white px-6 py-2 rounded-full border-2 border-yellow-500 shadow-lg flex items-center gap-2">
            <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Total</span>
            <span className="text-2xl font-black text-white">{rolling ? '...' : (total || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
