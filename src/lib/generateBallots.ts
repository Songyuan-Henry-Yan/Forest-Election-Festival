// Generates rich ballots (ranking + approvals + 0-5 scores) for every
// simulated voter. Ballots are generated ONCE per election and stored in
// game state; every voting rule reuses the same ballots.
//
// The model is tuned so realistic elections often disagree across rules:
//  - Voter groups form blocs of different sizes (like real coalitions), so
//    a candidate can lead on first choices without broad support.
//  - Voters judge candidates mostly on the value axes they personally feel
//    strongly about, which keeps blocs distinct from each other.
//  - Team-player candidates earn a small "broad appeal" bonus from everyone:
//    rarely a favorite, often an okay choice — the classic compromise effect
//    that lets Borda/Condorcet/Approval disagree with Choose-One voting.
//  - Tolerant groups sticker and star more candidates; picky groups fewer.

import type {
  AxisId,
  AxisScores,
  Ballot,
  Candidate,
  Issue,
  Polarization,
  Voter,
  VoterGroup,
  VoterMix,
} from '../types/game';
import { noise, type Rng } from './random';
import { stanceOn } from './generatePolicies';

export const AXES: AxisId[] = [
  'freedom',
  'support',
  'change',
  'global',
  'nature',
  'services',
  'facts',
  'compromise',
];

export interface BallotContext {
  issues: Issue[];
  issueWeights: Record<string, number>;
  /** candidate id -> trust bonus/penalty from campaign events */
  trust: Record<string, number>;
  polarization: Polarization;
}

const POLARIZATION = {
  low: { align: 1.1, noise: 0.28, approve: 0.5, base: 0.15, sharpen: 1 },
  medium: { align: 2.0, noise: 0.15, approve: 0.62, base: 0.06, sharpen: 1.15 },
  high: { align: 2.5, noise: 0.11, approve: 0.75, base: 0, sharpen: 1.5 },
} as const;

/**
 * How much the Forest Neighborhood mixer grows or shrinks one group.
 * Pure function — the Election Workshop uses it for its live preview and
 * makeVoters uses it to build the electorate.
 */
export function mixFactor(group: VoterGroup, mix: VoterMix): number {
  if (mix.mode === 'random') return 1;
  let f = 1;
  if (mix.generations === 1)
    f *= group.generation === 'elder' ? 2.2 : group.generation === 'young' ? 0.55 : 1;
  if (mix.generations === -1)
    f *= group.generation === 'young' ? 2.2 : group.generation === 'elder' ? 0.55 : 1;
  if (mix.pantries === 1)
    f *= group.pantry === 'full' ? 2.0 : group.pantry === 'small' ? 0.55 : 1;
  if (mix.pantries === -1)
    f *= group.pantry === 'small' ? 2.2 : group.pantry === 'full' ? 0.5 : 1;
  if (mix.roots === 1) f *= group.roots === 'new' ? 3.2 : 0.9;
  if (mix.roots === -1) f *= group.roots === 'new' ? 0.3 : 1.05;
  if (mix.jobs.length > 0)
    f *= group.jobFamily && mix.jobs.includes(group.jobFamily) ? 1.9 : 0.85;
  return f;
}

/**
 * Voter blocs come in different sizes, like real communities: a few large
 * groups, several medium ones, and some small ones. In "surprise mix" mode
 * the sizes are drawn from the seed; in "design it" mode the neighborhood
 * dials decide, with a pinch of seeded variety. The same seed + the same
 * dials always build the same forest.
 */
export function makeVoters(
  count: number,
  groups: VoterGroup[],
  issues: Issue[],
  rng: Rng,
  mix: VoterMix,
): Voter[] {
  const weights = groups.map((g) =>
    mix.mode === 'random'
      ? 0.25 + Math.pow(rng(), 1.6) * 2.2
      : (0.7 + rng() * 0.6) * mixFactor(g, mix),
  );
  const totalW = weights.reduce((s, w) => s + w, 0);

  const pickGroup = (): VoterGroup => {
    let roll = rng() * totalW;
    for (let i = 0; i < groups.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return groups[i];
    }
    return groups[groups.length - 1];
  };

  const voters: Voter[] = [];
  for (let i = 0; i < count; i++) {
    const group = pickGroup();
    const axes = {} as AxisScores;
    for (const a of AXES) {
      axes[a] = clamp(group.axes[a] + noise(rng, 0.45), -3, 3);
    }
    // Favorite issues: prefer the group's issues among the selected ones.
    const groupIssues = issues.filter((it) => group.issueIds.includes(it.id));
    const otherIssues = issues.filter((it) => !group.issueIds.includes(it.id));
    const favCount = 2 + (rng() < 0.5 ? 1 : 0);
    const favorites: string[] = [];
    const pool = [...shuffleInPlace(groupIssues.slice(), rng), ...shuffleInPlace(otherIssues.slice(), rng)];
    for (const it of pool) {
      if (favorites.length >= favCount) break;
      favorites.push(it.id);
    }
    voters.push({ id: `v${i}`, groupId: group.id, axes, favoriteIssues: favorites });
  }
  return voters;
}

function shuffleInPlace<T>(arr: T[], rng: Rng): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Utility of a candidate for one voter. Higher = better liked. */
function utility(
  voter: Voter,
  cand: Candidate,
  ctx: BallotContext,
  rng: Rng,
): number {
  const p = POLARIZATION[ctx.polarization];

  // 1. Value alignment: each voter weighs the axes they feel strongly
  //    about the most (a squirrel votes on freedom and effort; a frog on
  //    nature and facts). This keeps voter blocs truly distinct.
  let align = 0;
  let wsum = 0;
  for (const a of AXES) {
    const w = 0.25 + Math.abs(voter.axes[a]) / 3;
    align += w * (voter.axes[a] / 3) * (cand.axes[a] / 3);
    wsum += w;
  }
  align /= wsum;

  // 2. Issue fit: candidates with promises on a voter's favorite issues,
  //    pointing the way the voter leans, earn a bonus.
  let issueFit = 0;
  for (const issueId of voter.favoriteIssues) {
    const issue = ctx.issues.find((it) => it.id === issueId);
    if (!issue) continue;
    const weight = ctx.issueWeights[issueId] ?? 1;
    const voterStance = stanceOn(voter.axes, issue);
    const candStance = stanceOn(cand.axes, issue);
    const agreement = voterStance * candStance; // -1..1
    const hasPromise = cand.policies.some((pol) => pol.issueId === issueId);
    issueFit += agreement * 0.15 * weight * (hasPromise ? 1.4 : 1);
  }

  // 3. Broad appeal: team-players are rarely a favorite but often feel
  //    "okay" to almost everyone — the classic compromise-candidate effect.
  const broadAppeal = 0.09 * (cand.axes.compromise / 3);

  // 4. Trust from campaign events (fact-checks, budget book, volunteers...).
  const trust = ctx.trust[cand.id] ?? 0;

  // 5. Fact-minded voters gently discount habitual over-promising.
  const factCare = Math.max(0, voter.axes.facts / 3);
  const overPromise = -0.04 * cand.overPromiseRisk * factCare;

  return (
    align * p.align + issueFit + broadAppeal + trust + overPromise + noise(rng, p.noise)
  );
}

export function makeBallots(
  voters: Voter[],
  candidates: Candidate[],
  groups: VoterGroup[],
  ctx: BallotContext,
  rng: Rng,
): Ballot[] {
  const p = POLARIZATION[ctx.polarization];
  return voters.map((voter) => {
    const group = groups.find((g) => g.id === voter.groupId);
    // Tolerant groups sticker more candidates; picky groups sticker fewer.
    const approveAt = clamp(
      p.approve - ((group?.tolerance ?? 0.5) - 0.5) * 0.35,
      0.3,
      0.9,
    );
    // Tolerant groups also hand out stars more generously.
    const generosity = 1.25 - (group?.tolerance ?? 0.5) * 0.7;

    const utils = candidates.map((c) => ({
      id: c.id,
      u: utility(voter, c, ctx, rng),
    }));
    // Rank by utility (stable, deterministic).
    const ranking = utils
      .slice()
      .sort((a, b) => b.u - a.u || (a.id < b.id ? -1 : 1))
      .map((x) => x.id);

    // Normalize utilities to 0..1 within this ballot.
    const max = Math.max(...utils.map((x) => x.u));
    const min = Math.min(...utils.map((x) => x.u));
    const span = Math.max(1e-9, max - min);

    const scores: Record<string, number> = {};
    const approvals: string[] = [];
    for (const { id, u } of utils) {
      let norm = (u - min) / span;
      norm = Math.pow(norm, p.sharpen * generosity);
      const score = clamp(Math.round(5 * (p.base + (1 - p.base) * norm)), 0, 5);
      scores[id] = score;
      if (norm >= approveAt || score >= 4) approvals.push(id);
    }
    // A voter always approves their favorite.
    if (!approvals.includes(ranking[0])) approvals.push(ranking[0]);

    return {
      voterId: voter.id,
      voterGroupId: voter.groupId,
      ranking,
      approvals,
      scores,
      favoriteIssues: voter.favoriteIssues,
    };
  });
}
