import { HandClass, Rank, TrainingCard } from './types';

export const rankOrder: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export const rankValue = (rank: Rank) => rankOrder.indexOf(rank) + 2;

export const sortCards = <T extends TrainingCard>(cards: [T, T]): [T, T] =>
  rankValue(cards[0].rank) >= rankValue(cards[1].rank) ? cards : [cards[1], cards[0]];

export const isSuited = (cards: [TrainingCard, TrainingCard]) => cards[0].suit === cards[1].suit;

export const handCode = (cards: [TrainingCard, TrainingCard]) => {
  const [high, low] = sortCards(cards);
  if (high.rank === low.rank) return `${high.rank}${low.rank}`;
  return `${high.rank}${low.rank}${isSuited(cards) ? 's' : 'o'}`;
};

export const classifyHand = (cards: [TrainingCard, TrainingCard]): HandClass => {
  const [high, low] = sortCards(cards);
  const suited = isSuited(cards);
  const gap = Math.abs(rankValue(high.rank) - rankValue(low.rank));
  const highValue = rankValue(high.rank);
  const lowValue = rankValue(low.rank);
  const hasAce = high.rank === 'A';
  const bothBroadway = highValue >= 10 && lowValue >= 10;

  if (high.rank === low.rank) {
    return highValue >= 11 ? 'premium pair' : 'pocket pair';
  }

  if (hasAce && lowValue >= 10) return 'strong ace';
  if (hasAce && lowValue <= 9) return 'weak ace';
  if (suited && bothBroadway) return 'suited broadway';
  if (!suited && bothBroadway) return 'offsuit broadway';
  if (suited && gap === 1 && highValue <= 12 && lowValue >= 5) return 'suited connector';
  if (suited && gap === 2 && highValue <= 12 && lowValue >= 5) return 'suited gapper';
  if (suited && highValue <= 9 && lowValue <= 6) return 'suited trash';
  if (!suited && !bothBroadway && highValue <= 11 && lowValue <= 8) return 'offsuit trash';

  return 'mixed playable';
};

export const describeCombo = (cards: [TrainingCard, TrainingCard]) => {
  const suitedWord = isSuited(cards) ? 'suited' : 'offsuit';
  return `${handCode(cards)} (${suitedWord})`;
};
