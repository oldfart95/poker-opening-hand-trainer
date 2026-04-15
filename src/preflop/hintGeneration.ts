import { describeCombo } from './handClassification';
import { RangeDecision, TrainingSpot } from './types';

export const getHints = (spot: TrainingSpot, decision: RangeDecision) => ({
  classHint: `${describeCombo(spot.cards)} is ${spot.handClass}. Start by naming the hand before judging it.`,
  positionHint:
    spot.facingAction === 'first-in'
      ? `${spot.position} is ${spot.position === 'BTN' || spot.position === 'CO' ? 'a steal seat, so you can open more hands.' : 'a tighter seat, so weak edges shrink fast.'}`
      : `${spot.position} is facing a raise${spot.openerPosition ? ` from ${spot.openerPosition}` : ''}. Continue less often when you may be dominated or out of position.`,
  actionHint: `Recommended action: ${decision.recommended.toUpperCase()}. ${decision.reason}`
});
