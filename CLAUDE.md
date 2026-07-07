# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                      # Vite dev server
npm run build                    # tsc --noEmit type-check THEN vite build
npm run preview                  # preview a production build
npx tsx scripts/verifyTeaching.ts  # algorithm test (winners, determinism, all 9 systems)
```

There is no lint step and no test runner. `verifyTeaching.ts` is the de-facto test suite: run it after touching anything in `src/lib/` or `src/data/sampleElection.ts`. It asserts the fixed Teaching Example winners, that Condorcet finds a true winner (no Copeland fallback), that Dolly's approval is 100%, and that the same seed produces byte-identical ballots.

React 18 + TypeScript + Vite, plain CSS in `src/styles/global.css`. No backend, no network calls at runtime, no external assets — all art is CSS/inline SVG/emoji and all sound is synthesized live via the Web Audio API (`src/lib/sound.ts`).

## The one architectural invariant

**Ballots are generated exactly once per election and every voting rule reads that same frozen stack.** This is the whole point of the game (same voters, same ballots, different rules → different winners). Ballots are created only inside `createGame` / `createTeachingGame` (`src/lib/generateGame.ts`) and stored in `GameState.ballots`. Switching voting systems, opening results, or changing anything downstream must NEVER regenerate ballots. Everything in `src/lib/voting.ts` and `src/lib/metrics.ts` is a pure function of `(candidates, ballots)`.

If you add a feature that needs new ballot data, add it to the ballot shape in `src/types/game.ts` and populate it in `src/lib/generateBallots.ts` — do not recompute per-rule.

## Data flow

The generation pipeline (`createGame` in `generateGame.ts`) runs strictly in order and is fully deterministic from `settings.seed`:

1. **Candidates** — shuffled from `data/candidates.ts` (`CANDIDATE_POOL`, 10 animals, each scored on 8 value axes).
2. **Issues** — shuffled from `data/issues.ts` (`ISSUE_POOL`, 12 issue cards).
3. **Campaign events** — drawn from `data/events.ts`; adjust `issueWeights` and a `trust` map *before* ballots exist.
4. **Policies** — `lib/generatePolicies.ts` builds promises per candidate from `data/policyTemplates.ts`. Promise count depends on age mode (story: 3, classroom: ≤5, lab: every issue).
5. **Voters** — `makeVoters` from `data/voterGroups.ts` (10 household blocs).
6. **Ballots** — `makeBallots` produces one rich ballot per voter (full ranking + approval list + 0–5 star scores). This is the frozen stack.

All randomness goes through a single seeded `Rng` (mulberry32, `lib/random.ts`). Do not introduce `Math.random()` / `Date.now()` into generation — it breaks determinism and the `verifyTeaching` determinism check.

`createTeachingGame` bypasses random generation and returns a hand-built fixed 100-voter election from `data/sampleElection.ts`, engineered so the rules reliably disagree. Editing `sampleElection.ts` or `voting.ts` can change the Teaching Example winners — re-run `verifyTeaching.ts` and update its `expected` map if the change is intentional.

## State & rendering

`src/App.tsx` is the single source of truth — all game state lives in `useState` there and flows down as props (no context, no store). Key points:

- `effectiveBallots` (a `useMemo`) selects which stack to count: forest simulated ballots, classroom ballots (`ballotSource === 'class'`), or forest + one guest ballot. `results` and `metrics` are memoized over `effectiveBallots`. This is the only indirection over the frozen ballots.
- Navigation is a linear `FestivalStep` sequence (`welcome → setup → issues → candidates → events → systems → results → reflection`); the `events` step is skipped when campaign events are off.
- Each step awards a Forest Passport sticker (`award`). Stickers are **motivational only and never affect election results** — keep it that way.
- Small preferences (age mode, seed, teacher mode, selected systems, passport) persist to `localStorage` via `lib/storage.ts`. Nothing else is persisted.

## Voting systems

Nine rules (`VotingSystemId` in `types/game.ts`), all implemented in `lib/voting.ts` and described for the UI in `data/votingSystems.ts`. `runSystem` / `runAllSystems` return `ElectionResult` objects carrying round-by-round breakdowns, per-candidate headline counts, kid + teacher explanations, and rule-specific extras (`pairwise` for Condorcet, `seats` for the council).

Ties are broken deterministically by a shared comparator (`tieBreakComparator`): higher average stars → more first-choice votes → more approvals → alphabetical id. When a tie-break was used, the result sets `tieBreakInfo` and the UI must surface it. Condorcet falls back to Copeland only on a cycle (sets `copelandFallback`).

## Audience & content constraints

This is a **nonpartisan civics game for children (ages 6–14)**. No real parties, politicians, logos, or campaigns — every candidate must have both strengths and tradeoffs. Content is age-gated three ways via `AgeMode` (`story` / `classroom` / `lab`); many components branch on `teacherMode` to add formal rule names and real-world notes. The internal 8 value axes (`AxisId`) are never shown to children — the UI translates them into friendly words. Keep copy calm and non-accusatory (the budget tray "flags over-promising gently — nobody is called a liar").
