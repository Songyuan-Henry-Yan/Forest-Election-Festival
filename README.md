# Animal Kingdom Election Festival

Animal Kingdom Election Festival is a Vite + React + TypeScript educational web game for children in the United States.

## Educational goal

Core message: **Same voters. Same ballots. Different voting rules. Will the same animal win?** Students explore how one fixed set of ballots can produce different winners under different neutral counting rules.

## How to run

```bash
npm install
npm run dev
npm run build
```

## Age modes

- Ages 6–8, Little Forest Voters: 5 icon-friendly issues with simple wording.
- Ages 9–11, Trail Council Voters: 7 issues with short text and icons.
- Ages 12–14, Great Forest Assembly: 9 issues with more detailed tradeoffs.
- Teacher override: choose a custom issue count from 5 to 12.

## Voting systems implemented

1. Choose-One / Plurality
2. Two-Round Runoff
3. Ranked Choice / IRV
4. Approval Voting
5. Score Voting
6. STAR Voting
7. Borda Count
8. Condorcet Matchups
9. Proportional Forest Council

## Nonpartisan note

This game does not support any political party or real-world candidate. It does not mention real political parties, real politicians, or current elections. Animal stories are used to teach voting rules, public values, and tradeoffs in an age-appropriate way.

## No external APIs or images

The app uses local state, localStorage, CSS, emoji, inline SVG, and React components. It has no backend, no database, no login, no external APIs, and no external images.

## Tunable setup and Class Mode

The Election Workshop supports solo, small-group, and full-class modes; animal NPC candidates, student candidates, student teams, and mixed mode; rally length; campaign tone; approval strictness; candidate-balance lessons; class privacy; and single-system or multi-system comparison. Class Mode defaults to animal teams and anonymous/team-friendly choices to avoid popularity-contest dynamics.

## Teacher Mode and print summary

Teacher Mode adds formal voting-system names, real-world connection notes, longer strengths and weaknesses, classroom discussion prompts, and a nonpartisan reminder. The Results and Reflection steps include a Print Summary button for classroom handouts.

## Tests and validation

Run `npm test` for focused validation of age defaults, custom issue counts, rally issue counts, the default Pippa/Luna/Bruno scenario, approval margin guardrails, and anonymous class candidates. Run `npm run build` for the full TypeScript and Vite production build.

## Classroom use ideas

- Ask students to predict which rule will choose which animal before opening the results.
- Compare “favorite fans,” approval rate, average stars, pairwise wins, and unhappy voters.
- Discuss why private ballots and explained rules are part of the Forest Charter.
- Change polarization and seed values to see when rules agree or disagree.
