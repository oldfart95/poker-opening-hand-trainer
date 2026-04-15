import { Feedback, RangeDecision, TrainerAction, TrainingSpot } from './types';

const actionLabel: Record<TrainerAction, string> = {
  fold: 'Fold',
  call: 'Call',
  open: 'Open',
  'three-bet': '3-bet'
};

export const buildFeedback = (spot: TrainingSpot, action: TrainerAction, decision: RangeDecision): Feedback => {
  const verdict = action === decision.recommended ? 'correct' : decision.acceptable.includes(action) ? 'acceptable' : 'mistake';
  const recommended = actionLabel[decision.recommended];

  if (verdict === 'correct') {
    return {
      verdict,
      title: 'Correct',
      explanation: `${actionLabel[action]} is the clean choice here.`,
      practicalReason: decision.reason
    };
  }

  if (verdict === 'acceptable') {
    return {
      verdict,
      title: 'Acceptable',
      explanation: `${actionLabel[action]} is playable, but ${recommended} is the default I want you to remember.`,
      practicalReason:
        decision.confidence === 'close'
          ? `${spot.handClass} hands often live near the border. Use position and table texture to break the tie.`
          : decision.reason
    };
  }

  return {
    verdict,
    title: 'Mistake',
    explanation: `${actionLabel[action]} loses the main idea of this spot. The better default is ${recommended}.`,
    practicalReason: decision.trapActions.includes(action)
      ? `This is the common trap: ${actionLabel[action].toLowerCase()} feels active, but it puts money in with poor realization or misses value. ${decision.reason}`
      : decision.reason
  };
};
