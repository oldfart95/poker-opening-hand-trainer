import { handCode, rankValue, sortCards } from './handClassification';
import { Position, RangeDecision, Rank, TrainerAction, TrainingSpot } from './types';

const earlyPositions: Position[] = ['UTG', 'UTG+1', 'LJ'];
const latePositions: Position[] = ['CO', 'BTN'];
const blindPositions: Position[] = ['SB', 'BB'];

const premium = new Set(['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs']);
const strongOpens = new Set(['TT', '99', 'AQo', 'AJs', 'KQs', 'KJs', 'QJs']);
const lateOpens = new Set(['88', '77', '66', '55', '44', '33', '22', 'ATs', 'A9s', 'A8s', 'KTs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s', 'AJo', 'KQo']);
const buttonSteals = new Set(['A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'K9s', 'Q9s', 'J9s', 'T8s', '97s', '86s', '75s', '65s', 'KJo', 'QJo', 'JTo']);
const blindDefends = new Set(['A5s', 'A4s', 'A3s', 'A2s', 'K9s', 'Q9s', 'J9s', 'T9s', '98s', '87s', '76s', '65s', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo']);

const positionLabel = (position: Position) => {
  if (earlyPositions.includes(position)) return 'early position';
  if (latePositions.includes(position)) return 'late position';
  if (blindPositions.includes(position)) return 'the blinds';
  return 'middle position';
};

const pairValue = (code: string) => (code.length === 2 && code[0] === code[1] ? rankValue(code[0] as Rank) : 0);

const openingDecision = (spot: TrainingSpot, code: string): RangeDecision => {
  if (premium.has(code)) {
    return {
      recommended: 'open',
      acceptable: [],
      trapActions: ['fold', 'call'],
      confidence: 'clear',
      reason: `${code} is strong enough to raise from any seat. Build the pot while you are likely ahead.`
    };
  }

  if (strongOpens.has(code) || pairValue(code) >= 9) {
    const acceptable = earlyPositions.includes(spot.position) ? [] : ['open' as TrainerAction];
    return {
      recommended: 'open',
      acceptable,
      trapActions: ['call'],
      confidence: earlyPositions.includes(spot.position) ? 'clear' : 'close',
      reason: `${code} has enough raw strength and playability to enter by raising. Limping hides information but gives up initiative.`
    };
  }

  if (latePositions.includes(spot.position) && lateOpens.has(code)) {
    return {
      recommended: 'open',
      acceptable: spot.position === 'CO' ? ['fold'] : [],
      trapActions: ['call'],
      confidence: spot.position === 'BTN' ? 'clear' : 'close',
      reason: `${code} becomes profitable when fewer players are left behind. Late position lets you win blinds and play more pots in position.`
    };
  }

  if (spot.position === 'BTN' && buttonSteals.has(code)) {
    return {
      recommended: 'open',
      acceptable: ['fold'],
      trapActions: ['call'],
      confidence: 'close',
      reason: `${code} is a reasonable button steal, but it is not mandatory. Position makes the raise work more than card strength alone.`
    };
  }

  return {
    recommended: 'fold',
    acceptable: latePositions.includes(spot.position) ? ['open'] : [],
    trapActions: ['call'],
    confidence: earlyPositions.includes(spot.position) ? 'clear' : 'close',
    reason: `${code} is too thin from ${positionLabel(spot.position)}. Folding keeps the session clean and avoids dominated one-pair spots.`
  };
};

const facingOpenDecision = (spot: TrainingSpot, code: string): RangeDecision => {
  if (premium.has(code) || code === 'TT' || code === 'AQo') {
    return {
      recommended: 'three-bet',
      acceptable: code === 'TT' || code === 'AQo' ? ['call'] : [],
      trapActions: ['fold'],
      confidence: premium.has(code) ? 'clear' : 'close',
      reason: `${code} can punish the open. Three-betting isolates value and denies equity to the players behind.`
    };
  }

  if (spot.position === 'BB' && (blindDefends.has(code) || pairValue(code) >= 2)) {
    return {
      recommended: 'call',
      acceptable: pairValue(code) >= 11 ? ['three-bet'] : [],
      trapActions: ['fold'],
      confidence: 'close',
      reason: `${code} can defend from the big blind because you are closing action and getting a price. It still needs postflop discipline.`
    };
  }

  if (latePositions.includes(spot.position) && (strongOpens.has(code) || lateOpens.has(code))) {
    return {
      recommended: 'call',
      acceptable: ['three-bet'],
      trapActions: [],
      confidence: 'close',
      reason: `${code} has enough playability to continue in position. Calling keeps dominated hands in and avoids bloating a marginal spot.`
    };
  }

  return {
    recommended: 'fold',
    acceptable: [],
    trapActions: ['call'],
    confidence: 'clear',
    reason: `${code} does not realize enough equity against an open. Offsuit and dominated hands lose money by tagging along.`
  };
};

export const getRangeDecision = (spot: TrainingSpot): RangeDecision => {
  const code = handCode(sortCards(spot.cards));
  return spot.facingAction === 'facing-open' ? facingOpenDecision(spot, code) : openingDecision(spot, code);
};
