import { SYMBOL_EMOJI_MAP } from './constants';

export const getSymbolEmoji = (symbol: string): string => {
  return SYMBOL_EMOJI_MAP[symbol] || symbol;
};

export const getWinMessage = (winType: string, multiplier: number): string => {
  if (winType === 'jackpot') return '💰 ¡JACKPOT! 💰';
  if (winType === 'triple') return `🎊 ¡TRIPLE! x${multiplier} 🎊`;
  if (winType === 'double') return `✨ ¡DOBLE! x${multiplier} ✨`;
  return '';
};
