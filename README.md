# Pocket Pixel Poker

Pocket Pixel Poker is now a focused **preflop trainer** for rapid repetition. It is not a solver clone and it is not trying to play full poker hands. The product loop is simple: see a hand, identify the class, account for position and action, choose a decision, get immediate feedback, then move to the next hand.

## What it trains

- Fast preflop recognition across full ring and 6-max contexts
- Practical hand classification: pocket pairs, suited connectors, weak aces, offsuit broadways, suited trash, and more
- Position-aware opening, calling, folding, and 3-betting defaults
- Hint-assisted learning with a three-step reveal
- Session stats that surface missed positions and missed hand classes

## Quick start

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test
```

## Training modes

- **Full Ring**: wider table context with earlier-position discipline.
- **6-Max**: default rapid trainer mode with modern short-handed positions.
- **Position Drill**: rotates positions aggressively so you can feel how the same hand changes by seat.
- **Hand-Class Drill**: keeps the focus on naming the hand class before acting.
- **Hints On/Off**: hint-assisted mode starts with hand classification visible; turning hints off makes the loop stricter.

## Architecture

The preflop trainer is separated by concern:

- `src/preflop/handGeneration.ts`: creates new preflop spots.
- `src/preflop/handClassification.ts`: labels hand types and formats combo codes.
- `src/preflop/rangeLogic.ts`: practical default action logic.
- `src/preflop/hintGeneration.ts`: layered hint stack.
- `src/preflop/feedbackText.ts`: immediate post-action feedback.
- `src/preflop/statsTracking.ts`: session totals, accuracy, and miss buckets.
- `src/components/TrainerComponents.tsx`: reusable trainer UI pieces.
- `src/App.tsx`: product composition and keyboard flow.

Older engine, AI, and postflop training files remain in the repo for future reuse, but the main app experience is now the preflop trainer.

## GitHub Pages deployment

This project is Vite-based and already uses a relative `base` in `vite.config.ts`, so the built app works on both local preview and project Pages URLs.

To publish with GitHub Pages:

1. Keep or add a workflow that runs `npm ci` and `npm run build`.
2. Upload the generated `dist/` directory as the Pages artifact.
3. In repository settings, set **Pages -> Source** to **GitHub Actions**.
4. Push to the deployment branch configured by your workflow, commonly `main`.

## Future extension points

- Add scenario packs for specific leaks, such as blind defense or button steals.
- Persist stats to localStorage and add session reset/export controls.
- Tune `rangeLogic.ts` with configurable pool assumptions.
- Add spaced repetition so frequently missed positions/classes appear more often.
- Add optional hotkey labels or audio feedback for speed training.
- Reintroduce postflop trainers as separate products instead of mixing them into the preflop loop.

## Design note

The trainer favors memorable rules and quick reps over exact equilibrium outputs. Feedback should stay plain-English and practical: what the hand is, why position changes it, and what default action a learner should remember.
