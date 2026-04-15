export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type Suit = 's' | 'h' | 'd' | 'c';

export interface TrainingCard {
  rank: Rank;
  suit: Suit;
}

export type SeatCount = 'full-ring' | 'six-max';
export type DrillMode = SeatCount | 'position-drill' | 'hand-class-drill';
export type TrainerAction = 'fold' | 'call' | 'open' | 'three-bet';
export type TrainerVerdict = 'correct' | 'acceptable' | 'mistake';

export type Position =
  | 'UTG'
  | 'UTG+1'
  | 'LJ'
  | 'HJ'
  | 'CO'
  | 'BTN'
  | 'SB'
  | 'BB';

export type HandClass =
  | 'premium pair'
  | 'pocket pair'
  | 'suited trash'
  | 'suited connector'
  | 'suited gapper'
  | 'offsuit broadway'
  | 'suited broadway'
  | 'weak ace'
  | 'strong ace'
  | 'offsuit trash'
  | 'mixed playable';

export interface TrainingSpot {
  id: number;
  cards: [TrainingCard, TrainingCard];
  position: Position;
  seatCount: SeatCount;
  facingAction: 'first-in' | 'facing-open';
  openerPosition?: Position;
  handClass: HandClass;
  prompt: string;
}

export interface RangeDecision {
  recommended: TrainerAction;
  acceptable: TrainerAction[];
  trapActions: TrainerAction[];
  confidence: 'clear' | 'close';
  reason: string;
}

export interface HintStack {
  classHint: string;
  positionHint: string;
  actionHint: string;
}

export interface Feedback {
  verdict: TrainerVerdict;
  title: string;
  explanation: string;
  practicalReason: string;
}

export interface AnswerRecord {
  spot: TrainingSpot;
  action: TrainerAction;
  verdict: TrainerVerdict;
}

export interface SessionStats {
  totalHands: number;
  correctHands: number;
  acceptableHands: number;
  mistakes: number;
  missedPositions: Record<string, number>;
  missedHandClasses: Record<string, number>;
}
