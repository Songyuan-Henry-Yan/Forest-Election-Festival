// All voting rules as pure functions.
// Every rule consumes the SAME ballots — ballots are never regenerated here.

import type {
  Ballot,
  ElectionResult,
  RoundCount,
  VotingRound,
  VotingSystemId,
} from '../types/game';

export interface CandidateRef {
  id: string;
  name: string;
}

const TIE_MESSAGE =
  'There was a tie. The forest used its tie-break rule, which was explained before the election: ' +
  'higher average stars, then more first-choice votes, then more approvals, then alphabetical order.';

interface TieStats {
  avgScore: Record<string, number>;
  firstChoice: Record<string, number>;
  approvals: Record<string, number>;
}

function tieStats(candidates: CandidateRef[], ballots: Ballot[]): TieStats {
  const avgScore: Record<string, number> = {};
  const firstChoice: Record<string, number> = {};
  const approvals: Record<string, number> = {};
  for (const c of candidates) {
    avgScore[c.id] = 0;
    firstChoice[c.id] = 0;
    approvals[c.id] = 0;
  }
  for (const b of ballots) {
    if (b.ranking[0] !== undefined && firstChoice[b.ranking[0]] !== undefined) {
      firstChoice[b.ranking[0]] += 1;
    }
    for (const a of b.approvals) if (approvals[a] !== undefined) approvals[a] += 1;
    for (const c of candidates) avgScore[c.id] += b.scores[c.id] ?? 0;
  }
  const n = Math.max(1, ballots.length);
  for (const c of candidates) avgScore[c.id] /= n;
  return { avgScore, firstChoice, approvals };
}

/**
 * Deterministic tie-break comparator: "better" candidate sorts first.
 * Order: higher average score -> more first-choice votes -> more approvals -> id A-Z.
 */
export function tieBreakComparator(
  candidates: CandidateRef[],
  ballots: Ballot[],
): (a: string, b: string) => number {
  const s = tieStats(candidates, ballots);
  return (a, b) =>
    s.avgScore[b] - s.avgScore[a] ||
    s.firstChoice[b] - s.firstChoice[a] ||
    s.approvals[b] - s.approvals[a] ||
    (a < b ? -1 : a > b ? 1 : 0);
}

function nameOf(candidates: CandidateRef[], id: string): string {
  return candidates.find((c) => c.id === id)?.name ?? id;
}

/** Sort candidate ids by a numeric tally (descending), breaking ties deterministically. */
function sortByTally(
  ids: string[],
  tally: Record<string, number>,
  cmp: (a: string, b: string) => number,
): { sorted: string[]; tieAtTop: boolean } {
  const sorted = ids.slice().sort((a, b) => tally[b] - tally[a] || cmp(a, b));
  const tieAtTop =
    sorted.length > 1 && tally[sorted[0]] === tally[sorted[1]];
  return { sorted, tieAtTop };
}

function toCounts(
  ids: string[],
  tally: Record<string, number>,
  total: number,
  usePct = true,
): RoundCount[] {
  return ids
    .slice()
    .sort((a, b) => tally[b] - tally[a])
    .map((id) => ({
      candidateId: id,
      value: tally[id],
      pct: usePct && total > 0 ? (tally[id] / total) * 100 : undefined,
    }));
}

function firstChoiceTally(
  candidates: CandidateRef[],
  ballots: Ballot[],
  active?: Set<string>,
): Record<string, number> {
  const tally: Record<string, number> = {};
  const activeIds = active ?? new Set(candidates.map((c) => c.id));
  for (const id of activeIds) tally[id] = 0;
  for (const b of ballots) {
    const top = b.ranking.find((id) => activeIds.has(id));
    if (top !== undefined) tally[top] += 1;
  }
  return tally;
}

// ---------------------------------------------------------------------------
// 1. Choose-One Voting / Plurality
// ---------------------------------------------------------------------------
export function runPlurality(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const tally = firstChoiceTally(candidates, ballots);
  const cmp = tieBreakComparator(candidates, ballots);
  const { sorted, tieAtTop } = sortByTally(
    candidates.map((c) => c.id),
    tally,
    cmp,
  );
  const winner = sorted[0];
  return {
    systemId: 'plurality',
    systemName: 'Choose-One Voting',
    winnerIds: [winner],
    winnerLabel: nameOf(candidates, winner),
    rounds: [
      {
        title: 'Counting the acorn baskets',
        description:
          'Each ballot puts one acorn in its first-choice basket. The fullest basket wins.',
        counts: toCounts(candidates.map((c) => c.id), tally, ballots.length),
      },
    ],
    counts: tally,
    countLabel: 'first-choice votes',
    explanationForKids:
      'Each animal puts one acorn in one candidate’s basket. The basket with the most acorns wins.',
    strengths: ['Very simple to vote and to count.'],
    weaknesses: [
      'When many candidates run, the winner may have less than half the votes.',
      'Similar candidates can split support between them.',
    ],
    tieBreakInfo: tieAtTop ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// 2. Two-Round Runoff
// ---------------------------------------------------------------------------
export function runRunoff(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const total = ballots.length;
  const tally = firstChoiceTally(candidates, ballots);
  const cmp = tieBreakComparator(candidates, ballots);
  const { sorted, tieAtTop } = sortByTally(
    candidates.map((c) => c.id),
    tally,
    cmp,
  );
  const rounds: VotingRound[] = [
    {
      title: 'Round 1: Everyone races',
      description:
        'Count first choices. A candidate with more than half the votes wins right away.',
      counts: toCounts(candidates.map((c) => c.id), tally, total),
    },
  ];

  if (tally[sorted[0]] > total / 2 || candidates.length < 3) {
    const winner = sorted[0];
    rounds[0].description += ` ${nameOf(candidates, winner)} ${
      tally[winner] > total / 2
        ? 'won more than half the votes, so no second round was needed.'
        : 'had the most votes.'
    }`;
    return runoffResult(candidates, winner, rounds, tally, tieAtTop);
  }

  const [fin1, fin2] = [sorted[0], sorted[1]];
  const final: Record<string, number> = { [fin1]: 0, [fin2]: 0 };
  for (const b of ballots) {
    const i1 = b.ranking.indexOf(fin1);
    const i2 = b.ranking.indexOf(fin2);
    if (i1 === -1 && i2 === -1) continue;
    if (i2 === -1 || (i1 !== -1 && i1 < i2)) final[fin1] += 1;
    else final[fin2] += 1;
  }
  const finalTie = final[fin1] === final[fin2];
  const winner =
    final[fin1] > final[fin2] ? fin1 : final[fin2] > final[fin1] ? fin2 : [fin1, fin2].sort(cmp)[0];
  rounds.push({
    title: 'Round 2: The final bridge crossing',
    description: `Nobody had more than half, so the top two — ${nameOf(candidates, fin1)} and ${nameOf(
      candidates,
      fin2,
    )} — crossed the bridge for a final round. Each ballot went to whichever finalist it ranked higher.`,
    counts: toCounts([fin1, fin2], final, total),
  });
  return runoffResult(candidates, winner, rounds, final, tieAtTop || finalTie);
}

function runoffResult(
  candidates: CandidateRef[],
  winner: string,
  rounds: VotingRound[],
  counts: Record<string, number>,
  tie: boolean,
): ElectionResult {
  return {
    systemId: 'runoff',
    systemName: 'Two-Round Runoff',
    winnerIds: [winner],
    winnerLabel: nameOf(candidates, winner),
    rounds,
    counts,
    countLabel: 'final-round votes',
    explanationForKids:
      'First, everyone votes. If nobody has more than half, the top two animals have a final round.',
    strengths: ['The final winner gets majority support in the second round.'],
    weaknesses: [
      'A broadly liked candidate may be eliminated before the final round.',
    ],
    tieBreakInfo: tie ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// 3. Ranked Choice / Instant Runoff Voting
// ---------------------------------------------------------------------------
export function runIRV(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const cmp = tieBreakComparator(candidates, ballots);
  const active = new Set(candidates.map((c) => c.id));
  const rounds: VotingRound[] = [];
  let usedTieBreak = false;
  let winner: string | null = null;
  let roundNum = 1;
  let lastTally: Record<string, number> = {};

  while (winner === null) {
    const tally = firstChoiceTally(candidates, ballots, active);
    lastTally = tally;
    const activeIds = [...active];
    const votesCast = activeIds.reduce((s, id) => s + tally[id], 0);
    const { sorted } = sortByTally(activeIds, tally, cmp);
    const top = sorted[0];

    if (tally[top] > votesCast / 2 || active.size <= 1) {
      rounds.push({
        title: `Round ${roundNum}: ${nameOf(candidates, top)} reaches a majority`,
        description: `${nameOf(candidates, top)} now has more than half of the active votes and wins.`,
        counts: toCounts(activeIds, tally, votesCast),
      });
      winner = top;
      break;
    }

    // Eliminate the candidate with the fewest votes (loser of tie-break if tied).
    const minVotes = Math.min(...activeIds.map((id) => tally[id]));
    const lowest = activeIds.filter((id) => tally[id] === minVotes);
    if (lowest.length > 1) usedTieBreak = true;
    const eliminated = lowest.sort(cmp)[lowest.length - 1];

    rounds.push({
      title: `Round ${roundNum}: ${nameOf(candidates, eliminated)} is eliminated`,
      description: `Nobody had more than half. ${nameOf(candidates, eliminated)} had the fewest votes (${
        tally[eliminated]
      }), so those leaf ballots flew to each voter’s next favorite candidate still in the race.`,
      counts: toCounts(activeIds, tally, votesCast).map((c) => ({
        ...c,
        eliminated: c.candidateId === eliminated,
        note: c.candidateId === eliminated ? 'eliminated' : undefined,
      })),
    });
    active.delete(eliminated);
    roundNum += 1;
    if (roundNum > candidates.length + 2) break; // safety
  }

  const finalWinner = winner ?? [...active].sort(cmp)[0];
  return {
    systemId: 'irv',
    systemName: 'Ranked Choice Voting',
    winnerIds: [finalWinner],
    winnerLabel: nameOf(candidates, finalWinner),
    rounds,
    counts: lastTally,
    countLabel: 'final-round votes',
    explanationForKids:
      'If your favorite animal cannot win, your vote can move to your next favorite animal.',
    strengths: [
      'Lets voters rank choices and reduces fear of “wasting” a vote.',
    ],
    weaknesses: [
      'Counting is more complex.',
      'The winner is not always the candidate who would beat every other candidate one-on-one.',
    ],
    tieBreakInfo: usedTieBreak ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// 4. Approval Voting
// ---------------------------------------------------------------------------
export function runApproval(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const tally: Record<string, number> = {};
  for (const c of candidates) tally[c.id] = 0;
  for (const b of ballots)
    for (const id of b.approvals) if (tally[id] !== undefined) tally[id] += 1;
  const cmp = tieBreakComparator(candidates, ballots);
  const { sorted, tieAtTop } = sortByTally(
    candidates.map((c) => c.id),
    tally,
    cmp,
  );
  return {
    systemId: 'approval',
    systemName: 'Approval Voting',
    winnerIds: [sorted[0]],
    winnerLabel: nameOf(candidates, sorted[0]),
    rounds: [
      {
        title: 'Counting the smile stickers',
        description:
          'Every voter placed a smile sticker on each candidate they found okay. Count all the stickers.',
        counts: toCounts(candidates.map((c) => c.id), tally, ballots.length),
      },
    ],
    counts: tally,
    countLabel: 'approvals',
    explanationForKids:
      'You can put a smile sticker on every candidate you think would be okay. The most stickers wins.',
    strengths: ['Simple, and lets voters support more than one candidate.'],
    weaknesses: [
      'It does not show the difference between “my favorite” and “just okay.”',
    ],
    tieBreakInfo: tieAtTop ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// 5. Score Voting
// ---------------------------------------------------------------------------
export function runScore(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const tally: Record<string, number> = {};
  for (const c of candidates) tally[c.id] = 0;
  for (const b of ballots)
    for (const c of candidates) tally[c.id] += b.scores[c.id] ?? 0;
  const cmp = tieBreakComparator(candidates, ballots);
  const { sorted, tieAtTop } = sortByTally(
    candidates.map((c) => c.id),
    tally,
    cmp,
  );
  const n = Math.max(1, ballots.length);
  return {
    systemId: 'score',
    systemName: 'Score Voting',
    winnerIds: [sorted[0]],
    winnerLabel: nameOf(candidates, sorted[0]),
    rounds: [
      {
        title: 'Counting the star jars',
        description: 'Add up every 0–5 star rating. The fullest star jar wins.',
        counts: toCounts(candidates.map((c) => c.id), tally, 0, false).map(
          (c) => ({
            ...c,
            note: `average ${(c.value / n).toFixed(1)} stars`,
          }),
        ),
      },
    ],
    counts: tally,
    countLabel: 'total stars',
    explanationForKids:
      'Give each candidate a star rating from 0 to 5. The candidate with the most stars wins.',
    strengths: ['Shows how strongly voters feel about each candidate.'],
    weaknesses: [
      'Some voters may give 5 stars only to their favorite and 0 to everyone else.',
    ],
    tieBreakInfo: tieAtTop ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// 6. STAR Voting (Score Then Automatic Runoff)
// ---------------------------------------------------------------------------
export function runSTAR(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const totals: Record<string, number> = {};
  for (const c of candidates) totals[c.id] = 0;
  for (const b of ballots)
    for (const c of candidates) totals[c.id] += b.scores[c.id] ?? 0;
  const cmp = tieBreakComparator(candidates, ballots);
  const { sorted, tieAtTop } = sortByTally(
    candidates.map((c) => c.id),
    totals,
    cmp,
  );
  const [fin1, fin2] = [sorted[0], sorted[1]];

  const runoffTally: Record<string, number> = { [fin1]: 0, [fin2]: 0 };
  let noPreference = 0;
  for (const b of ballots) {
    const s1 = b.scores[fin1] ?? 0;
    const s2 = b.scores[fin2] ?? 0;
    if (s1 > s2) runoffTally[fin1] += 1;
    else if (s2 > s1) runoffTally[fin2] += 1;
    else noPreference += 1; // equal scores = no preference
  }
  const runoffTie = runoffTally[fin1] === runoffTally[fin2];
  const winner = runoffTie
    ? [fin1, fin2].sort(cmp)[0]
    : runoffTally[fin1] > runoffTally[fin2]
      ? fin1
      : fin2;

  const n = Math.max(1, ballots.length);
  return {
    systemId: 'star',
    systemName: 'STAR Voting',
    winnerIds: [winner],
    winnerLabel: nameOf(candidates, winner),
    rounds: [
      {
        title: 'Step 1: Count all the stars',
        description: `The two candidates with the most total stars become finalists: ${nameOf(
          candidates,
          fin1,
        )} and ${nameOf(candidates, fin2)}.`,
        counts: toCounts(candidates.map((c) => c.id), totals, 0, false).map(
          (c) => ({ ...c, note: `average ${(c.value / n).toFixed(1)} stars` }),
        ),
      },
      {
        title: 'Step 2: Automatic final round',
        description: `Each ballot goes to whichever finalist it scored higher. ${noPreference} ballot${
          noPreference === 1 ? '' : 's'
        } scored both finalists the same, so they counted as “no preference.”`,
        counts: toCounts([fin1, fin2], runoffTally, ballots.length),
      },
    ],
    counts: totals,
    countLabel: 'total stars',
    explanationForKids:
      'First, count the stars. Then the top two have an automatic final round.',
    strengths: [
      'Combines strength of support with a final head-to-head comparison.',
    ],
    weaknesses: ['More complex than approval voting.'],
    tieBreakInfo: tieAtTop || runoffTie ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// 7. Borda Count
// ---------------------------------------------------------------------------
export function runBorda(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const n = candidates.length;
  const tally: Record<string, number> = {};
  for (const c of candidates) tally[c.id] = 0;
  for (const b of ballots) {
    b.ranking.forEach((id, index) => {
      if (tally[id] !== undefined) tally[id] += n - 1 - index;
    });
  }
  const cmp = tieBreakComparator(candidates, ballots);
  const { sorted, tieAtTop } = sortByTally(
    candidates.map((c) => c.id),
    tally,
    cmp,
  );
  return {
    systemId: 'borda',
    systemName: 'Borda Count',
    winnerIds: [sorted[0]],
    winnerLabel: nameOf(candidates, sorted[0]),
    rounds: [
      {
        title: 'Climbing the ranking ladder',
        description: `With ${n} candidates, a 1st-place ranking earns ${n - 1} points, 2nd place earns ${
          n - 2
        }, and so on down to 0. Add up all the points.`,
        counts: toCounts(candidates.map((c) => c.id), tally, 0, false).map(
          (c) => ({ ...c, note: `${c.value} points` }),
        ),
      },
    ],
    counts: tally,
    countLabel: 'ladder points',
    explanationForKids:
      'Higher rankings earn more points. Add up all the points to find the winner.',
    strengths: ['Rewards candidates who are ranked well by many voters.'],
    weaknesses: ['Can be affected by strategic ranking.'],
    tieBreakInfo: tieAtTop ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// 8. Condorcet Matchups (with Copeland fallback)
// ---------------------------------------------------------------------------
export function runCondorcet(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const ids = candidates.map((c) => c.id);
  const pairwise: Record<string, Record<string, number>> = {};
  for (const a of ids) {
    pairwise[a] = {};
    for (const b of ids) if (a !== b) pairwise[a][b] = 0;
  }
  for (const ballot of ballots) {
    const rank: Record<string, number> = {};
    ballot.ranking.forEach((id, i) => (rank[id] = i));
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i];
        const b = ids[j];
        const ra = rank[a] ?? Number.MAX_SAFE_INTEGER;
        const rb = rank[b] ?? Number.MAX_SAFE_INTEGER;
        if (ra < rb) pairwise[a][b] += 1;
        else if (rb < ra) pairwise[b][a] += 1;
      }
    }
  }

  const wins: Record<string, number> = {};
  const copeland: Record<string, number> = {};
  for (const a of ids) {
    wins[a] = 0;
    copeland[a] = 0;
    for (const b of ids) {
      if (a === b) continue;
      if (pairwise[a][b] > pairwise[b][a]) {
        wins[a] += 1;
        copeland[a] += 1;
      } else if (pairwise[a][b] < pairwise[b][a]) {
        copeland[a] -= 1;
      }
    }
  }

  const condorcetWinner = ids.find((a) => wins[a] === ids.length - 1) ?? null;
  const cmp = tieBreakComparator(candidates, ballots);
  const { sorted, tieAtTop } = sortByTally(ids, copeland, cmp);
  const winner = condorcetWinner ?? sorted[0];

  const matchupRound: VotingRound = {
    title: 'Friendly matchup results',
    description: condorcetWinner
      ? `${nameOf(candidates, condorcetWinner)} won every one-on-one matchup, so ${nameOf(
          candidates,
          condorcetWinner,
        )} is the strongest majority choice.`
      : 'No single animal beat every other animal one-on-one. This is called a cycle. The forest used the Copeland fallback: +1 point for each matchup win and −1 for each loss.',
    counts: toCounts(ids, wins, 0, false).map((c) => ({
      ...c,
      note: `${c.value} matchup win${c.value === 1 ? '' : 's'} (Copeland score ${copeland[c.candidateId] >= 0 ? '+' : ''}${copeland[c.candidateId]})`,
    })),
  };

  return {
    systemId: 'condorcet',
    systemName: 'Condorcet Matchups',
    winnerIds: [winner],
    winnerLabel:
      nameOf(candidates, winner) +
      (condorcetWinner ? '' : ' (Copeland fallback winner)'),
    rounds: [matchupRound],
    counts: wins,
    countLabel: 'matchup wins',
    explanationForKids:
      'Every pair of animals has a friendly matchup. If one animal beats every other animal one-on-one, that animal is the strongest majority choice.',
    strengths: [
      'Finds a candidate who can beat every other candidate head-to-head, if one exists.',
    ],
    weaknesses: [
      'Sometimes voters create a cycle: A beats B, B beats C, and C beats A.',
    ],
    pairwise,
    copelandFallback: condorcetWinner === null,
    tieBreakInfo:
      condorcetWinner === null && tieAtTop ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// 9. Proportional Forest Council (D'Hondt, 7 seats)
// ---------------------------------------------------------------------------
export const COUNCIL_SEATS = 7;

export function runCouncil(
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  const tally = firstChoiceTally(candidates, ballots);
  const cmp = tieBreakComparator(candidates, ballots);
  const seats: Record<string, number> = {};
  for (const c of candidates) seats[c.id] = 0;
  let usedTieBreak = false;

  const allocation: string[] = [];
  for (let s = 0; s < COUNCIL_SEATS; s++) {
    let best: string | null = null;
    let bestQ = -1;
    let tie = false;
    for (const c of candidates) {
      const q = tally[c.id] / (seats[c.id] + 1);
      if (q > bestQ + 1e-9) {
        best = c.id;
        bestQ = q;
        tie = false;
      } else if (Math.abs(q - bestQ) <= 1e-9 && best !== null) {
        tie = true;
        if (cmp(c.id, best) < 0) best = c.id;
      }
    }
    if (tie) usedTieBreak = true;
    if (best === null) break;
    seats[best] += 1;
    allocation.push(
      `Seat ${s + 1} → ${nameOf(candidates, best)} (quotient ${bestQ.toFixed(1)})`,
    );
  }

  const winnerIds = candidates
    .map((c) => c.id)
    .filter((id) => seats[id] > 0)
    .sort((a, b) => seats[b] - seats[a] || cmp(a, b));
  const winnerLabel = winnerIds
    .map((id) => `${nameOf(candidates, id)} ×${seats[id]}`)
    .join(', ');

  return {
    systemId: 'council',
    systemName: 'Proportional Forest Council',
    winnerIds,
    winnerLabel,
    rounds: [
      {
        title: 'First-choice votes',
        description:
          'The council starts from first-choice votes, then shares 7 seats using the D’Hondt method: each seat goes to the candidate with the highest votes ÷ (seats already won + 1).',
        counts: toCounts(candidates.map((c) => c.id), tally, ballots.length),
      },
      {
        title: 'Seat-by-seat allocation',
        description: allocation.join(' • '),
        counts: toCounts(winnerIds, seats, 0, false).map((c) => ({
          ...c,
          note: `${c.value} seat${c.value === 1 ? '' : 's'}`,
        })),
      },
    ],
    counts: seats,
    countLabel: 'council seats',
    explanationForKids:
      'Instead of picking one president, the forest picks a council of 7 so more groups can have a voice.',
    strengths: ['Helps more groups be represented.'],
    weaknesses: [
      'The council may need to make deals, and decisions can be slower.',
    ],
    seats,
    tieBreakInfo: usedTieBreak ? TIE_MESSAGE : undefined,
  };
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------
export function runSystem(
  systemId: VotingSystemId,
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult {
  switch (systemId) {
    case 'plurality':
      return runPlurality(candidates, ballots);
    case 'runoff':
      return runRunoff(candidates, ballots);
    case 'irv':
      return runIRV(candidates, ballots);
    case 'approval':
      return runApproval(candidates, ballots);
    case 'score':
      return runScore(candidates, ballots);
    case 'star':
      return runSTAR(candidates, ballots);
    case 'borda':
      return runBorda(candidates, ballots);
    case 'condorcet':
      return runCondorcet(candidates, ballots);
    case 'council':
      return runCouncil(candidates, ballots);
  }
}

export function runAllSystems(
  systemIds: VotingSystemId[],
  candidates: CandidateRef[],
  ballots: Ballot[],
): ElectionResult[] {
  return systemIds.map((id) => runSystem(id, candidates, ballots));
}
