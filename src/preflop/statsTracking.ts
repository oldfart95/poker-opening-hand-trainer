import { AnswerRecord, SessionStats } from './types';

export const createStats = (): SessionStats => ({
  totalHands: 0,
  correctHands: 0,
  acceptableHands: 0,
  mistakes: 0,
  missedPositions: {},
  missedHandClasses: {}
});

const increment = (record: Record<string, number>, key: string) => ({
  ...record,
  [key]: (record[key] ?? 0) + 1
});

export const recordAnswer = (stats: SessionStats, answer: AnswerRecord): SessionStats => {
  const isCorrect = answer.verdict === 'correct';
  const isAcceptable = answer.verdict === 'acceptable';
  const missed = answer.verdict === 'mistake';

  return {
    totalHands: stats.totalHands + 1,
    correctHands: stats.correctHands + (isCorrect ? 1 : 0),
    acceptableHands: stats.acceptableHands + (isAcceptable ? 1 : 0),
    mistakes: stats.mistakes + (missed ? 1 : 0),
    missedPositions: missed ? increment(stats.missedPositions, answer.spot.position) : stats.missedPositions,
    missedHandClasses: missed ? increment(stats.missedHandClasses, answer.spot.handClass) : stats.missedHandClasses
  };
};

export const accuracy = (stats: SessionStats) => {
  if (!stats.totalHands) return 0;
  return Math.round(((stats.correctHands + stats.acceptableHands * 0.5) / stats.totalHands) * 100);
};

export const topMisses = (items: Record<string, number>) =>
  Object.entries(items)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
