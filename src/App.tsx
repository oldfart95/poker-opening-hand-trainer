import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { ActionButtons, FeedbackPanel, HeroHand, HintPanel } from './components/TrainerComponents';
import { buildFeedback } from './preflop/feedbackText';
import { generateSpot, modeLabels } from './preflop/handGeneration';
import { getHints } from './preflop/hintGeneration';
import { helpSections } from './preflop/helpContent';
import { getRangeDecision } from './preflop/rangeLogic';
import { accuracy, createStats, recordAnswer, topMisses } from './preflop/statsTracking';
import { DrillMode, Feedback, TrainerAction, TrainingSpot } from './preflop/types';

const modes: DrillMode[] = ['full-ring', 'six-max', 'position-drill', 'hand-class-drill'];

export default function App() {
  const [mode, setMode] = useState<DrillMode>('six-max');
  // Default to quiz mode: no hints or labels on first load.
  const [hintAssisted, setHintAssisted] = useState(false);
  const [spot, setSpot] = useState<TrainingSpot>(() => generateSpot('six-max'));
  const [revealedHints, setRevealedHints] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [stats, setStats] = useState(createStats);
  const [showHelp, setShowHelp] = useState(false);

  const decision = useMemo(() => getRangeDecision(spot), [spot]);
  const hints = useMemo(() => getHints(spot, decision), [spot, decision]);
  const statsAccuracy = accuracy(stats);
  const positionMisses = topMisses(stats.missedPositions);
  const classMisses = topMisses(stats.missedHandClasses);

  const nextHand = () => {
    setSpot((current) => generateSpot(mode, current));
    setFeedback(null);
    setRevealedHints(0);
  };

  const selectMode = (nextMode: DrillMode) => {
    setMode(nextMode);
    setSpot((current) => generateSpot(nextMode, current));
    setFeedback(null);
    setRevealedHints(0);
  };

  const answer = (action: TrainerAction) => {
    if (feedback) return;
    const result = buildFeedback(spot, action, decision);
    setFeedback(result);
    setStats((current) => recordAnswer(current, { spot, action, verdict: result.verdict }));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'n') nextHand();
      if (key === 'h' && hintAssisted) setRevealedHints((value) => Math.min(3, value + 1));
      if (!feedback) {
        if (key === 'f') answer('fold');
        if (key === 'c' && spot.facingAction === 'facing-open') answer('call');
        if (key === 'o' && spot.facingAction === 'first-in') answer('open');
        if (key === 't' && spot.facingAction === 'facing-open') answer('three-bet');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [feedback, spot, decision, mode, hintAssisted]);

  return (
    <main className="app-shell">
      <header className="trainer-header">
        <div>
          <p className="kicker">Preflop repetition trainer</p>
          <h1>Pocket Pixel Poker</h1>
        </div>
        <button className="icon-button" onClick={() => setShowHelp(true)} aria-label="Open help">
          ?
        </button>
      </header>

      <section className="trainer-layout">
        <div className="trainer-main">
          <nav className="mode-tabs" aria-label="Training modes">
            {modes.map((item) => (
              <button key={item} className={mode === item ? 'active' : ''} onClick={() => selectMode(item)}>
                {modeLabels[item]}
              </button>
            ))}
            <button
              className={hintAssisted ? 'active assist-toggle' : 'assist-toggle'}
              onClick={() => {
                setHintAssisted((value) => {
                  const nextValue = !value;
                  if (!nextValue) setRevealedHints(0);
                  return nextValue;
                });
              }}
            >
              Hints {hintAssisted ? 'On' : 'Off'}
            </button>
          </nav>

          <div className="training-stage">
            <div className="context-strip">
              <span>{spot.seatCount === 'full-ring' ? 'Full ring' : '6-max'}</span>
              <strong>{spot.position}</strong>
              <span>{spot.facingAction === 'first-in' ? 'First in' : `Facing ${spot.openerPosition ?? 'an'} open`}</span>
            </div>

            <HeroHand spot={spot} showDetails={!!feedback} />

            <section className="decision-panel">
              <p>{spot.prompt}</p>
              <ActionButtons facingOpen={spot.facingAction === 'facing-open'} disabled={!!feedback} onPick={answer} />
              <div className="quick-flow">
                <button disabled={!hintAssisted} onClick={() => setRevealedHints((value) => Math.min(3, value + 1))}>
                  Reveal Hint
                </button>
                <button className="next-hand" onClick={nextHand}>
                  Next Hand
                </button>
              </div>
            </section>

            {hintAssisted && revealedHints > 0 && <HintPanel hints={hints} revealed={revealedHints} />}

            {feedback && <FeedbackPanel feedback={feedback} />}
          </div>
        </div>

        <aside className="stats-panel">
          <section className="stat-hero">
            <span>Total hands</span>
            <strong>{stats.totalHands}</strong>
          </section>
          <section className="accuracy-ring" aria-label={`Accuracy ${statsAccuracy}%`}>
            <div style={{ '--accuracy': `${statsAccuracy}%` } as CSSProperties}>
              <strong>{statsAccuracy}%</strong>
              <span>accuracy</span>
            </div>
          </section>
          <section>
            <h2>Most-missed positions</h2>
            {positionMisses.length ? (
              positionMisses.map(([label, count]) => (
                <p className="miss-row" key={label}>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </p>
              ))
            ) : (
              <p className="empty-note">No position leaks yet.</p>
            )}
          </section>
          <section>
            <h2>Most-missed classes</h2>
            {classMisses.length ? (
              classMisses.map(([label, count]) => (
                <p className="miss-row" key={label}>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </p>
              ))
            ) : (
              <p className="empty-note">No hand-class leaks yet.</p>
            )}
          </section>
        </aside>
      </section>

      {showHelp && (
        <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
          <section className="help-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-head">
              <h2>Compact Preflop Guide</h2>
              <button onClick={() => setShowHelp(false)} aria-label="Close help">
                x
              </button>
            </div>
            {helpSections.map((section) => (
              <article key={section.title}>
                <h3>{section.title}</h3>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
