import React from 'react';
import { PATTERN_INFO } from '../constants';
import type { BingoPattern } from '../types';

interface PatternSelectorProps {
  selectedPattern: BingoPattern;
  onSelectPattern: (pattern: BingoPattern) => void;
  disabled: boolean;
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  selectedPattern,
  onSelectPattern,
  disabled,
}) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-yellow-400">Selecciona Patrón</h3>
      <div className="space-y-2">
        {Object.entries(PATTERN_INFO).map(([key, info]) => (
          <button
            key={key}
            onClick={() => onSelectPattern(key as BingoPattern)}
            disabled={disabled}
            className={`w-full p-3 rounded-lg text-left transition-all font-semibold ${
              selectedPattern === key
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white border-2 border-yellow-400 shadow-lg'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex justify-between items-center">
              <span>{info.name}</span>
              <span className="text-sm bg-green-600 px-2 py-1 rounded-full">
                {info.multiplier}x
              </span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {info.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};