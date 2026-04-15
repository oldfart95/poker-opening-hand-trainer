import { classifyHand, sortCards } from './handClassification';
import { DrillMode, Position, SeatCount, Suit, TrainingCard, TrainingSpot } from './types';

const ranks: TrainingCard['rank'][] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits: Suit[] = ['s', 'h', 'd', 'c'];
const fullRingPositions: Position[] = ['UTG', 'UTG+1', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const sixMaxPositions: Position[] = ['LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

const createDeck = (): TrainingCard[] => suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })));

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const drawHand = (): [TrainingCard, TrainingCard] => {
  const deck = createDeck();
  const firstIndex = Math.floor(Math.random() * deck.length);
  const first = deck.splice(firstIndex, 1)[0];
  const second = deck[Math.floor(Math.random() * deck.length)];
  return sortCards([first, second]);
};

const seatCountForMode = (mode: DrillMode): SeatCount => (mode === 'full-ring' ? 'full-ring' : 'six-max');

const positionsForSeatCount = (seatCount: SeatCount) => (seatCount === 'full-ring' ? fullRingPositions : sixMaxPositions);

const openerBefore = (position: Position, seatCount: SeatCount): Position | undefined => {
  const positions = positionsForSeatCount(seatCount);
  const index = positions.indexOf(position);
  if (index <= 0) return undefined;
  return pick(positions.slice(0, index));
};

export const generateSpot = (mode: DrillMode, previous?: TrainingSpot): TrainingSpot => {
  const seatCount = seatCountForMode(mode);
  const positions = positionsForSeatCount(seatCount);
  const position =
    mode === 'position-drill'
      ? pick(['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as Position[])
      : pick(positions);
  const cards = drawHand();
  const canFaceOpen = position !== 'UTG' && position !== 'UTG+1' && Math.random() > 0.55;
  const facingAction = canFaceOpen ? 'facing-open' : 'first-in';
  const openerPosition = facingAction === 'facing-open' ? openerBefore(position, seatCount) : undefined;
  const handClass = classifyHand(cards);
  const versus = openerPosition ? ` facing a ${openerPosition} open` : ' first in';

  return {
    id: (previous?.id ?? 0) + 1,
    cards,
    position,
    seatCount,
    facingAction,
    openerPosition,
    handClass,
    prompt: `${position}${versus}. What is your preflop action?`
  };
};

export const modeLabels: Record<DrillMode, string> = {
  'full-ring': 'Full Ring',
  'six-max': '6-Max',
  'position-drill': 'Position Drill',
  'hand-class-drill': 'Hand-Class Drill'
};
