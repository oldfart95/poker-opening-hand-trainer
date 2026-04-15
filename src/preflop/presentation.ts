import { Suit, TrainingCard } from './types';

const suitGlyph: Record<Suit, string> = {
  s: '\u2660',
  h: '\u2665',
  d: '\u2666',
  c: '\u2663'
};

export const suitName = (suit: Suit) => {
  if (suit === 's') return 'spades';
  if (suit === 'h') return 'hearts';
  if (suit === 'd') return 'diamonds';
  return 'clubs';
};

export const formatCard = (card: TrainingCard) => `${card.rank}${suitGlyph[card.suit]}`;
