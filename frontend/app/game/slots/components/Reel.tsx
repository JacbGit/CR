interface ReelProps {
  symbol: string;
  stopped: boolean;
  index: number;
}

export default function Reel({ symbol, stopped, index }: ReelProps) {
  return (
    <div 
      className={`bg-gradient-to-b from-white to-gray-200 rounded-2xl shadow-2xl overflow-hidden h-44 w-44 relative transition-all duration-300 border-4 flex items-center justify-center flex-col ${
        stopped 
          ? 'border-green-400 scale-110 shadow-green-500/70' 
          : 'border-red-600 animate-pulse'
      }`}
      style={stopped ? {boxShadow: '0 0 40px rgba(34,197,94,0.9), inset 0 0 20px rgba(34,197,94,0.3)'} : {}}
    >
      {stopped ? (
        <div className="text-8xl animate-fade-in-up font-bold drop-shadow-lg">
          {symbol}
        </div>
      ) : (
        <div className="animate-spin-slot absolute w-full h-full">
          {Array.from({ length: 4 }).flatMap((_, batch) => [
            <div key={`cherry-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">🍒</div>,
            <div key={`lemon-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">🍋</div>,
            <div key={`orange-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">🍊</div>,
            <div key={`grape-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">🍇</div>,
            <div key={`star-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">⭐</div>,
            <div key={`diamond-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">💎</div>,
            <div key={`seven-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">7</div>,
          ])}
        </div>
      )}
    </div>
  );
}
