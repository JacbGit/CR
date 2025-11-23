import React from 'react';

interface BallDisplayProps {
  drawnBalls: number[];
  currentBall: number | null;
  totalBalls: number;
}

export const BallDisplay: React.FC<BallDisplayProps> = ({
  drawnBalls,
  currentBall,
  totalBalls,
}) => {
  const getBallColor = (ball: number): string => {
    if (ball >= 1 && ball <= 15) return 'from-red-500 to-red-700'; // B
    if (ball >= 16 && ball <= 30) return 'from-blue-500 to-blue-700'; // I
    if (ball >= 31 && ball <= 45) return 'from-white to-gray-200 text-gray-800'; // N
    if (ball >= 46 && ball <= 60) return 'from-green-500 to-green-700'; // G
    if (ball >= 61 && ball <= 75) return 'from-orange-500 to-orange-700'; // O
    return 'from-gray-500 to-gray-700';
  };

  const getLetter = (ball: number): string => {
    if (ball >= 1 && ball <= 15) return 'B';
    if (ball >= 16 && ball <= 30) return 'I';
    if (ball >= 31 && ball <= 45) return 'N';
    if (ball >= 46 && ball <= 60) return 'G';
    if (ball >= 61 && ball <= 75) return 'O';
    return '';
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-400">Bolas Sorteadas</h3>
        <div className="text-sm bg-gray-700 px-3 py-1 rounded-full">
          {drawnBalls.length} / {totalBalls || 75}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {drawnBalls.map((ball, index) => (
          <div
            key={index}
            className={`
              aspect-square rounded-full flex flex-col items-center justify-center
              text-white font-bold shadow-lg transition-all
              bg-gradient-to-br ${getBallColor(ball)}
              ${ball === currentBall ? 'scale-110 ring-4 ring-yellow-400 animate-pulse' : 'scale-100'}
            `}
          >
            <div className="text-xs">{getLetter(ball)}</div>
            <div className="text-lg">{ball}</div>
          </div>
        ))}
      </div>

      {drawnBalls.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-2">🎱</div>
          <div>Las bolas aparecerán aquí</div>
        </div>
      )}
    </div>
  );
};