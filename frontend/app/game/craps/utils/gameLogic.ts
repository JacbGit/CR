import { DICE_EMOJI_MAP } from './constants';

export const getDiceEmoji = (number: number): string => {
  return DICE_EMOJI_MAP[number] || '🎲';
};

export const getRandomDice = (): number => {
  return Math.floor(Math.random() * 6) + 1;
};
