import { formatCard, suitName } from '../preflop/presentation';
import { Feedback, HintStack, TrainerAction, TrainingSpot } from '../preflop/types';

export const CardView = ({ card }: { card: TrainingSpot['cards'][number] }) => (
  <div className={`card ${card.suit === 'h' || card.suit === 'd' ? 'red' : 'black'}`} aria-label={`${card.rank} of ${suitName(card.suit)}`}>
    <strong>{card.rank}</strong>
    <span>{formatCard(card).slice(1)}</span>
  </div>
);

export const HeroHand = ({ spot, showDetails }: { spot: TrainingSpot; showDetails: boolean }) => (
  <section className={`hero-hand ${showDetails ? '' : 'quiz-mode'}`.trim()} aria-label="Hero hand">
    <div className="card-pair">
      {spot.cards.map((card) => (
        <CardView key={`${card.rank}${card.suit}`} card={card} />
      ))}
    </div>
    {showDetails && (
      <div className="spot-copy">
        <span className="eyebrow">Hero hand</span>
        <h2>{spot.cards.map(formatCard).join(' ')}</h2>
        <p>{spot.handClass}</p>
      </div>
    )}
  </section>
);

export const ActionButtons = ({
  facingOpen,
  disabled,
  onPick
}: {
  facingOpen: boolean;
  disabled: boolean;
  onPick: (action: TrainerAction) => void;
}) => {
  const actions: TrainerAction[] = facingOpen ? ['fold', 'call', 'three-bet'] : ['fold', 'open'];
  return (
    <div className="decision-grid">
      {actions.map((action) => (
        <button key={action} disabled={disabled} className={`decision ${action}`} onClick={() => onPick(action)}>
          {action === 'three-bet' ? '3-Bet' : action}
        </button>
      ))}
    </div>
  );
};

export const HintPanel = ({ hints, revealed }: { hints: HintStack; revealed: number }) => (
  <div className="hint-stack">
    <article className={revealed >= 1 ? 'shown' : ''}>
      <span>Hint 1</span>
      <p>{revealed >= 1 ? hints.classHint : 'Classify the hand.'}</p>
    </article>
    <article className={revealed >= 2 ? 'shown' : ''}>
      <span>Hint 2</span>
      <p>{revealed >= 2 ? hints.positionHint : 'Think about position.'}</p>
    </article>
    <article className={revealed >= 3 ? 'shown' : ''}>
      <span>Hint 3</span>
      <p>{revealed >= 3 ? hints.actionHint : 'Reveal the recommended action.'}</p>
    </article>
  </div>
);

export const FeedbackPanel = ({ feedback }: { feedback: Feedback }) => (
  <section className={`feedback ${feedback.verdict}`}>
    <span>{feedback.verdict}</span>
    <h3>{feedback.title}</h3>
    <p>{feedback.explanation}</p>
    <p>{feedback.practicalReason}</p>
  </section>
);
