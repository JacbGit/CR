export const SYMBOL_EMOJI_MAP: { [key: string]: string } = {
  'CHERRY': '🍒',
  'LEMON': '🍋',
  'ORANGE': '🍊',
  'GRAPE': '🍇',
  'STAR': '⭐',
  'DIAMOND': '💎',
  'SEVEN': '7'
};

export const CREDIT_AMOUNTS = [10, 50, 100, 500];

export const REEL_STOP_DELAYS = [1500, 2500, 3500]; // ms

export const PRIZE_TABLE = [
  { symbols: '7 7 7', multiplier: 100, label: 'JACKPOT!' },
  { symbols: '💎 💎 💎', multiplier: 50, label: '' },
  { symbols: '⭐ ⭐ ⭐', multiplier: 25, label: '' },
  { symbols: '🍇 🍇 🍇', multiplier: 15, label: '' },
  { symbols: '🍒 🍒 🍒', multiplier: 10, label: '' },
  { symbols: 'Dos Iguales', multiplier: 2, label: '' },
];
