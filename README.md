# Animal Kingdom Election Festival

**Who Will Care for the Forest?**

A playable, nonpartisan civics web game for children. The animals of the
forest are electing a leader — and the player discovers that the *way votes
are counted* can change *who wins*, even when every voter and every ballot
stays exactly the same.

> **Core learning message:** Same voters. Same ballots. Different voting
> rules. Will the same animal win?

## Educational goal

The game teaches how voting systems shape democratic outcomes. Players walk
through a storybook election festival, meet animal candidates, read forest
news, practice filling out a secret ballot, and then send one shared stack of
leaf ballots through up to nine different counting machines. It also teaches
that democracy is more than majority rule: it needs fair rules, private
ballots, basic rights (the Forest Charter), fact-checking, budget honesty,
peaceful transfer of power, and respect for smaller groups.

This is **not** a game about which political side is correct. No real
parties, politicians, logos, or campaigns appear. Every candidate has
strengths *and* tradeoffs.

## How to run

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (tsc) + production build (vite)
```

Requires Node 18+. No backend, no database, no login, no external APIs, no
external images — all artwork is CSS, inline SVG, and emoji. Game preferences
(age mode, seed, voting systems, Teacher Mode, passport stickers) are saved in
`localStorage` only.

There is also a small algorithm test you can run with
[tsx](https://www.npmjs.com/package/tsx) or ts-node:

```bash
npx tsx scripts/verifyTeaching.ts
```

It asserts the Teaching Example winners, determinism (same seed → same
ballots), and that all nine voting systems run.

## Age modes

| Mode | Ages | Defaults |
| --- | --- | --- |
| Story Mode | 6–8 | 3 candidates, 4 issues, 40 voters, 3 simple rules, simplified results |
| Classroom Election | 9–11 | 5 candidates, 6 issues, 100 voters, 5 rules — the main experience |
| Voting Systems Lab | 12–14 | 7 candidates, 9 issues, 150 voters, all 9 rules, pairwise matrix + council seats |

## Voting systems implemented

All rules are pure functions in `src/lib/voting.ts`, and **all of them read
the same stored ballots** — switching rules never regenerates ballots.

1. **Choose-One Voting** (plurality)
2. **Two-Round Runoff**
3. **Ranked Choice Voting** (instant runoff, with round-by-round transfers)
4. **Approval Voting**
5. **Score Voting** (0–5 stars)
6. **STAR Voting** (score, then automatic runoff)
7. **Borda Count**
8. **Condorcet Matchups** (pairwise matrix, with Copeland fallback when a cycle occurs)
9. **Proportional Forest Council** (7 seats via the D'Hondt method)

Ties are broken deterministically (higher average stars → more first-choice
votes → more approvals → alphabetical id), and the UI says so whenever the
tie-break rule was used.

## Game flow

Welcome Gate → Election Workshop → Issue Trail → Candidate Rally Stage →
Parrot News Stand → Secret Ballot Booth + Classroom Vote + Counting Machine
Arcade → Counting Theater → Campfire Reflection Circle.

Each stop awards a Forest Passport sticker (motivational only — stickers
never change election results). The **Teaching Example** on the welcome page
works in every age mode, switches on all nine counting machines, and loads a
fixed 100-voter election where the rules reliably disagree:

- Choose-One / Plurality → **Flynn Fox**
- Two-Round Runoff → **Penny Panda**
- Ranked Choice / IRV → **Olive Owl**
- Borda Count → **Dolly Dolphin**
- Condorcet → **Dolly Dolphin**

Random elections are grown from a **Magic Election Seed** (mulberry32 PRNG):
the same seed always produces the same candidates, voters, events, and
ballots, so a whole classroom can compare identical elections.

## How an election is generated

1. Candidates are drawn from a pool of ten animals, each with scores on eight
   internal value axes (freedom↔rules, reward-effort↔shared-support,
   tradition↔change, local↔cooperation, building↔environment,
   individual-choice↔public-services, feelings↔facts, leader↔compromise).
2. Issues come from twelve child-friendly issue cards (snack sharing, the
   river and old trees, the Robot Parrot, big megaphone ads, and so on).
3. Each candidate generates campaign promises from local policy templates,
   with acorn costs, who it helps, tradeoffs, and concerns. Story Mode keeps
   3 flagship promises per candidate; Classroom Election covers up to 5
   issues; and in the Voting Systems Lab every candidate publishes a promise
   on **every** selected issue. The acorn budget tray scales with platform
   size (12 acorns for a 3-promise plan, +2 per extra promise) and flags
   over-promising (gently — nobody is called a liar).
4. Campaign events (if enabled) are drawn and shift issue importance and
   candidate trust *before* ballots are made.
5. Simulated voters from ten animal household groups each produce one rich
   ballot: a full ranking, an approval list, and 0–5 star scores. Voter blocs
   come in different sizes, voters weigh the value axes they personally care
   about most, and compromise-minded candidates earn broad-but-shallow
   support — so, as in real elections, the first-choice leader is often *not*
   the candidate most voters could accept, and different rules regularly
   crown different winners. Polarization (gentle breeze / windy / swirling
   leaves) widens or narrows how generous voters are to distant candidates.

   The **Forest Neighborhood mixer** in the Election Workshop decides *who*
   lives in the forest. Choose 🎲 Surprise mix (the seed sizes the families)
   or 🎨 Design the neighborhood: ages (young cubs ↔ wise elders), pantry
   size at home (nearly-empty ↔ full — the wealth dial), forest roots
   (long-time families ↔ new families moving in), and which job families are
   extra common (Builders & Traders, Helpers & Caretakers, Fact-Checkers &
   Nature Watchers). A live preview shows the family sizes, and a "Meet the
   neighbors" panel explains what each family needs and why. Because
   different families need different things, changing the neighborhood
   changes the election.
6. Ballots are stored in game state **once**. Every counting rule, metric,
   and visualization reads that same stack.

## Sound

All interaction sounds (wooden taps, leaf flips, smile stickers, acorn
plunks, ballot seals, winner fanfares) and the gentle forest background music
(soft pad chords, music-box plucks, occasional bird chirps) are **synthesized
live with the Web Audio API** — no audio files, no downloads, nothing
copyrighted. Toggle sounds and music from the header; preferences are saved.
Browsers unlock audio on the first tap or key press.

## Classroom Vote (students vote for real)

On the ballot-booth page, the **Classroom Vote** box lets a class run its own
election with the current candidates:

1. Students take turns at one screen. Each fills a full secret ballot —
   ranking ladder, smile stickers, 0–5 stars (or quick-fills from their
   ranking) — seals it, and passes to the next student. The form resets so
   every ballot stays private.
2. Optionally add **bot voters** (they copy ballots from the simulated forest
   animals) to reach any electorate size up to 500.
3. Flip the switch to have the Counting Theater count the **classroom
   ballots** instead of the forest's simulated ones — all nine rules re-count
   the same class ballot box.

## Classroom use

- **Teacher Mode** (toggle in the header) adds formal rule names, real-world
  connection notes on issues, a "Pass the Acorn" random discussion question
  picker, and a printable class summary (`Print Summary` uses the browser's
  print dialog).
- Project the Counting Theater and ask students to predict each rule's winner
  first (the game includes a prediction panel).
- The Campfire Reflection Circle has ten discussion cards, including "Can the
  majority decide everything?" and "Why does the Forest Charter matter?"
- The Forest Charter scroll (header button) lists eight basic rights that
  elections cannot erase, and policy cards that touch rights show a gentle
  charter reminder.

## Accessibility

- Keyboard operable: flips, tabs, ranking (up/down buttons — no drag-only
  interactions), star pickers, and accordions are all buttons/controls with
  visible focus states.
- SVG avatars have `role="img"` and descriptive labels; icons are paired with
  text so no information relies on color or emoji alone.
- `prefers-reduced-motion` replaces all animation with instant changes.
- Responsive card-based layout for phones, tablets, laptops, and projectors;
  tables scroll rather than squish on small screens.

## Known limitations and future ideas

- The practice ballot's "guest voter" toggle adds exactly one ballot; a fun
  extension would be a whole-class mode where every student adds one.
- The Condorcet machine uses Copeland as its only cycle fallback (no ranked
  pairs / Schulze yet).
- Voter groups use fixed weights; a future "design your own voter group"
  workshop could deepen the lesson.
- `npm run dev` hot-reload keeps game state only until the page reloads;
  elections themselves are reproducible from their seed.

## Project notes

- React 18 + TypeScript + Vite, plain CSS in `src/styles/global.css`.
- All voting algorithms: `src/lib/voting.ts` (pure functions).
- Ballot generation: `src/lib/generateBallots.ts`, `src/lib/generateGame.ts`.
- Fixed teaching election: `src/data/sampleElection.ts`.
- No analytics, no tracking, no network calls at runtime.

## Copyright

© 2026 Songyuan Yan. All rights reserved.

Animal Kingdom Election Festival — including its code, artwork, characters,
and text — was created as a nonpartisan educational project. If you would
like to use it in your classroom or build on it, please reach out to the
author.
