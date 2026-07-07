// Candidate support metrics computed from the shared ballots.

import type { Ballot, CandidateMetrics } from '../types/game';
import type { CandidateRef } from './voting';

export function computeMetrics(
  candidates: CandidateRef[],
  ballots: Ballot[],
): CandidateMetrics[] {
  const n = Math.max(1, ballots.length);
  const ids = candidates.map((c) => c.id);

  // Pairwise wins
  const pair: Record<string, Record<string, number>> = {};
  for (const a of ids) {
    pair[a] = {};
    for (const b of ids) if (a !== b) pair[a][b] = 0;
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
        if (ra < rb) pair[a][b] += 1;
        else if (rb < ra) pair[b][a] += 1;
      }
    }
  }

  return candidates.map((c) => {
    let first = 0;
    let approvals = 0;
    let scoreSum = 0;
    let unhappy = 0;
    for (const b of ballots) {
      if (b.ranking[0] === c.id) first += 1;
      if (b.approvals.includes(c.id)) approvals += 1;
      const s = b.scores[c.id] ?? 0;
      scoreSum += s;
      const rankedLast =
        b.ranking.length > 1 && b.ranking[b.ranking.length - 1] === c.id;
      if (s <= 1 || rankedLast) unhappy += 1;
    }
    let pairWins = 0;
    for (const other of ids) {
      if (other === c.id) continue;
      if (pair[c.id][other] > pair[other][c.id]) pairWins += 1;
    }
    return {
      candidateId: c.id,
      firstChoicePct: (first / n) * 100,
      approvalPct: (approvals / n) * 100,
      avgScore: scoreSum / n,
      pairwiseWins: pairWins,
      minorityDissatisfactionPct: (unhappy / n) * 100,
    };
  });
}
