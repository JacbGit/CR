'use client';

import React from 'react';
import { RED_NUMBERS } from '../utils/constants';

interface BettingTableProps {
  bets: Map<string, number>;
  onPlaceBet: (betKey: string, amount: number) => void;
  selectedChip: number;
}

export const BettingTable: React.FC<BettingTableProps> = ({ bets, onPlaceBet, selectedChip }) => {
  
  const handleCellClick = (betKey: string) => {
    onPlaceBet(betKey, selectedChip);
  };

  const getCellColor = (num: number) => {
    if (num === 0) return 'bg-green-600 hover:bg-green-500';
    return RED_NUMBERS.includes(num) ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-900 hover:bg-gray-800';
  };

  const renderBetChips = (betKey: string) => {
    const amount = bets.get(betKey) || 0;
    if (amount === 0) return null;
    
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 border-yellow-600">
          ${amount}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-green-800 p-6 rounded-lg shadow-2xl">
      <div className="grid grid-cols-13 gap-1">
        {/* Número 0 */}
        <div 
          className="col-span-1 row-span-3 relative cursor-pointer"
          onClick={() => handleCellClick('0')}
        >
          <div className={`${getCellColor(0)} h-32 flex items-center justify-center rounded text-white font-bold text-xl transition-colors`}>
            0
          </div>
          {renderBetChips('0')}
        </div>

        {/* Números principales 1-36 */}
        <div className="col-span-12 grid grid-cols-12 gap-1">
          {[
            [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
            [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
            [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
          ].map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((num) => (
                <div 
                  key={num}
                  className="relative cursor-pointer"
                  onClick={() => handleCellClick(num.toString())}
                >
                  <div className={`${getCellColor(num)} h-10 flex items-center justify-center rounded text-white font-bold transition-colors`}>
                    {num}
                  </div>
                  {renderBetChips(num.toString())}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Apuestas 2:1 (columnas) */}
        <div className="col-span-12 grid grid-cols-12 gap-1 mt-2">
          {[1, 2, 3].map((col) => (
            <div 
              key={`col${col}`}
              className="col-span-4 relative cursor-pointer"
              onClick={() => handleCellClick(`column${col}`)}
            >
              <div className="bg-green-700 hover:bg-green-600 h-8 flex items-center justify-center rounded text-white font-bold transition-colors">
                2:1
              </div>
              {renderBetChips(`column${col}`)}
            </div>
          ))}
        </div>

        {/* Apuestas de docenas */}
        <div className="col-span-12 grid grid-cols-12 gap-1 mt-2">
          <div 
            className="col-span-4 relative cursor-pointer"
            onClick={() => handleCellClick('first12')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              1st 12
            </div>
            {renderBetChips('first12')}
          </div>
          <div 
            className="col-span-4 relative cursor-pointer"
            onClick={() => handleCellClick('second12')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              2nd 12
            </div>
            {renderBetChips('second12')}
          </div>
          <div 
            className="col-span-4 relative cursor-pointer"
            onClick={() => handleCellClick('third12')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              3rd 12
            </div>
            {renderBetChips('third12')}
          </div>
        </div>

        {/* Apuestas de money bets */}
        <div className="col-span-12 grid grid-cols-6 gap-1 mt-2">
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('first18')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              1-18
            </div>
            {renderBetChips('first18')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('even')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              EVEN
            </div>
            {renderBetChips('even')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('red')}
          >
            <div className="bg-red-700 hover:bg-red-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              RED
            </div>
            {renderBetChips('red')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('black')}
          >
            <div className="bg-gray-800 hover:bg-gray-700 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              BLACK
            </div>
            {renderBetChips('black')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('odd')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              ODD
            </div>
            {renderBetChips('odd')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('second18')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              19-36
            </div>
            {renderBetChips('second18')}
          </div>
        </div>
      </div>
    </div>
  );
};
