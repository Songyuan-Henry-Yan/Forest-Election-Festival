// The fixed Teaching Example: 100 voters in five ranking groups, designed so
// different voting rules reliably choose different winners.
//
// Expected outcomes (verified by the algorithms):
//   Choose-One / Plurality  -> Flynn Fox
//   Two-Round Runoff        -> Penny Panda
//   Ranked Choice / IRV     -> Olive Owl
//   Borda Count             -> Dolly Dolphin
//   Condorcet               -> Dolly Dolphin

import type {
  Ballot,
  Candidate,
  ElectionSettings,
  GameState,
} from '../types/game';
import { CANDIDATE_POOL, TEACHING_CANDIDATE_IDS } from './candidates';
import { ISSUE_POOL, TEACHING_ISSUE_IDS } from './issues';
import { VOTER_GROUPS } from './voterGroups';
import { generatePolicies } from '../lib/generatePolicies';
import { rngFromSeed } from '../lib/random';

export const TEACHING_SEED = 'classroom-example';

interface TeachingGroup {
  groupId: string;
  label: string;
  count: number;
  ranking: string[]; // candidate ids, favorite first
}

export const TEACHING_GROUPS: TeachingGroup[] = [
  {
    groupId: 'squirrels',
    label: 'Squirrel Shopkeepers',
    count: 28,
    ranking: ['flynn', 'leo', 'dolly', 'olive', 'penny'],
  },
  {
    groupId: 'bees',
    label: 'Bee Workers',
    count: 24,
    ranking: ['penny', 'olive', 'dolly', 'leo', 'flynn'],
  },
  {
    groupId: 'frogs',
    label: 'Frog Environment Club',
    count: 20,
    ranking: ['olive', 'dolly', 'penny', 'leo', 'flynn'],
  },
  {
    groupId: 'turtles',
    label: 'Turtle Safety Voters',
    count: 16,
    ranking: ['leo', 'dolly', 'flynn', 'olive', 'penny'],
  },
  {
    groupId: 'bunnies',
    label: 'Bunny Compromise Voters',
    count: 12,
    ranking: ['dolly', 'olive', 'penny', 'leo', 'flynn'],
  },
];

/** Rank position -> stars (rank 1 = favorite). Ranks 1-3 are approved. */
const RANK_TO_SCORE = [5, 4, 3, 1, 0];
const APPROVED_RANKS = 3;

export function buildTeachingBallots(): Ballot[] {
  const ballots: Ballot[] = [];
  let v = 0;
  for (const group of TEACHING_GROUPS) {
    for (let i = 0; i < group.count; i++) {
      const scores: Record<string, number> = {};
      group.ranking.forEach((id, rank) => {
        scores[id] = RANK_TO_SCORE[rank] ?? 0;
      });
      ballots.push({
        voterId: `t${v++}`,
        voterGroupId: group.groupId,
        ranking: group.ranking.slice(),
        approvals: group.ranking.slice(0, APPROVED_RANKS),
        scores,
        favoriteIssues: [],
      });
    }
  }
  return ballots;
}

export function buildTeachingGame(base: ElectionSettings): GameState {
  const rng = rngFromSeed(TEACHING_SEED);
  const issues = TEACHING_ISSUE_IDS.map(
    (id) => ISSUE_POOL.find((it) => it.id === id)!,
  );
  // Older age modes see a promise on every teaching issue.
  const promiseCount = base.ageMode === 'story' ? 3 : issues.length;
  const candidates: Candidate[] = TEACHING_CANDIDATE_IDS.map((id) => {
    const seed = CANDIDATE_POOL.find((c) => c.id === id)!;
    return { ...seed, policies: generatePolicies(seed, issues, rng, promiseCount) };
  });
  const ballots = buildTeachingBallots();
  const issueWeights: Record<string, number> = {};
  for (const it of issues) issueWeights[it.id] = 1;

  const settings: ElectionSettings = {
    ...base,
    candidateCount: candidates.length,
    issueCount: issues.length,
    voterCount: ballots.length,
    polarization: 'medium',
    campaignEvents: false,
    seed: TEACHING_SEED,
  };

  return {
    settings,
    candidates,
    issues,
    voterGroups: VOTER_GROUPS,
    voters: ballots.map((b) => ({
      id: b.voterId,
      groupId: b.voterGroupId,
      axes: {
        freedom: 0, support: 0, change: 0, global: 0,
        nature: 0, services: 0, facts: 0, compromise: 0,
      },
      favoriteIssues: [],
    })),
    ballots,
    drawnEvents: [],
    issueWeights,
    isTeaching: true,
  };
}
