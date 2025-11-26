export const DICE_EMOJI_MAP: { [key: number]: string } = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅'
};

export const BET_TYPES = {
  PASS: 'pass',
  DONT_PASS: 'dont-pass',
  FIELD: 'field',
  ANY_CRAPS: 'any-craps',
  ANY_SEVEN: 'any-seven'
} as const;

export const CREDIT_AMOUNTS = [10, 50, 100, 500];

export const ANIMATION_DURATION = 1000; // ms
export const DICE_SWAP_INTERVAL = 80; // ms
