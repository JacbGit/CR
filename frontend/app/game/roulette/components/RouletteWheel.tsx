'use client';

import React, { useState, useEffect } from 'react';
import { ROULETTE_NUMBERS, RED_NUMBERS } from '../utils/constants';

interface RouletteWheelProps {
  isSpinning: boolean;
  winningNumber: number | null;
  onSpinEnd: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ 
  isSpinning, 
  winningNumber, 
  onSpinEnd 
}) => {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      const numberIndex = ROULETTE_NUMBERS.indexOf(winningNumber);
      const anglePerNumber = 360 / 37;
      const targetAngle = numberIndex * anglePerNumber;
      const extraSpins = 5; // Vueltas adicionales para efecto
      const finalRotation = 360 * extraSpins + targetAngle + (Math.random() * 5 - 2.5);
      
      setRotation(finalRotation);
      
      setTimeout(() => {
        onSpinEnd();
      }, 4000);
    }
  }, [isSpinning, winningNumber, onSpinEnd]);

  return (
    <div className="relative w-80 h-80">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 shadow-2xl"></div>
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-800">
        <div 
          className={`relative w-full h-full rounded-full transition-transform ${isSpinning ? 'duration-[4000ms] ease-out' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {ROULETTE_NUMBERS.map((num, index) => {
            const angle = (index * 360) / 37;
            const isRed = RED_NUMBERS.includes(num);
            
            return (
              <div
                key={index}
                className="absolute w-full h-full"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-8 h-32 ${
                  num === 0 ? 'bg-green-600' : isRed ? 'bg-red-600' : 'bg-gray-900'
                } clip-path-triangle`}>
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-sm">
                    {num}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-900"></div>
      <div className="absolute inset-20 rounded-full bg-blue-900"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-500"></div>
      
      {/* Indicador de la bola */}
      {isSpinning && (
        <div 
          className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-lg animate-bounce"
          style={{ animationDuration: '0.5s' }}
        ></div>
      )}
    </div>
  );
};
