import React from 'react';

interface BingoCardProps {
  card: number[];
  markedPositions: number[];
  highlightedPositions?: number[];
}

export const BingoCard: React.FC<BingoCardProps> = ({ 
  card, 
  markedPositions,
  highlightedPositions = []
}) => {
  const letters = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 border-8 border-yellow-600">
      {/* Header con letras BINGO */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {letters.map((letter, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-red-600 to-red-800 text-white text-3xl font-black rounded-lg py-3 text-center shadow-lg"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Cartón 5x5 */}
      <div className="grid grid-cols-5 gap-2">
        {card.map((num, index) => {
          const isMarked = markedPositions.includes(index);
          const isHighlighted = highlightedPositions.includes(index);
          const isFree = index === 12 && num === 0;

          return (
            <div
              key={index}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-2xl font-bold
                transition-all duration-300 shadow-md
                ${isFree 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-4 border-yellow-600' 
                  : isMarked
                    ? 'bg-gradient-to-br from-green-500 to-green-700 text-white scale-95 border-4 border-green-800'
                    : isHighlighted
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white animate-pulse'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border-2 border-gray-300'
                }
              `}
            >
              {isFree ? (
                <span className="text-sm">FREE</span>
              ) : (
                <span>{num}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex gap-4 text-xs text-gray-700 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-700 rounded"></div>
          <span>Marcado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded"></div>
          <span>Sin marcar</span>
        </div>
      </div>
    </div>
  );
};