// Builds a full election from settings + seed. The pipeline runs ONCE:
//   candidates -> issues -> events -> policies -> voters -> ballots
// After this, the ballots in GameState are frozen. Voting rules only read them.

import type {
  Candidate,
  DrawnEvent,
  ElectionSettings,
  EventChange,
  GameState,
} from '../types/game';
import { CANDIDATE_POOL } from '../data/candidates';
import { ISSUE_POOL } from '../data/issues';
import { VOTER_GROUPS } from '../data/voterGroups';
import { EVENT_POOL } from '../data/events';
import { rngFromSeed, shuffle } from './random';
import { generatePolicies } from './generatePolicies';
import { makeBallots, makeVoters, type BallotContext } from './generateBallots';
import { buildTeachingGame } from '../data/sampleElection';

export function createGame(settings: ElectionSettings): GameState {
  const rng = rngFromSeed(settings.seed);

  // 1. Candidates
  const seeds = shuffle(rng, CANDIDATE_POOL).slice(
    0,
    Math.max(3, Math.min(settings.candidateCount, CANDIDATE_POOL.length)),
  );

  // 2. Issues
  const issues = shuffle(rng, ISSUE_POOL).slice(
    0,
    Math.max(3, Math.min(settings.issueCount, ISSUE_POOL.length)),
  );

  // 3. Campaign events (drawn now, revealed later at the News Stand).
  const issueWeights: Record<string, number> = {};
  for (const it of issues) issueWeights[it.id] = 1;
  const trust: Record<string, number> = {};
  for (const s of seeds) trust[s.id] = 0;

  const drawnEvents: DrawnEvent[] = [];
  if (settings.campaignEvents) {
    const count = 2 + (rng() < 0.5 ? 1 : 0);
    const deck = shuffle(rng, EVENT_POOL).slice(0, count);
    for (const event of deck) {
      const changes: EventChange[] = [];
      if (event.issueBoost) {
        for (const [issueId, boost] of Object.entries(event.issueBoost)) {
          if (issueWeights[issueId] === undefined) continue;
          const before = issueWeights[issueId];
          issueWeights[issueId] = Math.round((before + boost) * 100) / 100;
          const issue = issues.find((it) => it.id === issueId)!;
          changes.push({
            label: `“${issue.title}” importance`,
            before,
            after: issueWeights[issueId],
          });
        }
      }
      switch (event.trustEffect) {
        case 'factCheck':
          for (const s of seeds) {
            if (s.overPromiseRisk >= 2) {
              trust[s.id] -= 0.12;
              changes.push({ label: `${s.name}: trust dips (big promises vs. the budget)` });
            } else if (s.axes.facts >= 2) {
              trust[s.id] += 0.08;
              changes.push({ label: `${s.name}: trust grows (checked facts)` });
            }
          }
          break;
        case 'budgetBook':
          for (const s of seeds) {
            if (s.budgetCare >= 2) {
              trust[s.id] += 0.08;
              changes.push({ label: `${s.name}: trust grows (careful budgeting)` });
            }
          }
          break;
        case 'randomBoost': {
          const lucky = seeds[Math.floor(rng() * seeds.length)];
          trust[lucky.id] += 0.1;
          changes.push({ label: `${lucky.name}: small popularity boost from friendly volunteers` });
          break;
        }
        case 'megaphone': {
          const loud = seeds[Math.floor(rng() * seeds.length)];
          trust[loud.id] += 0.07; // heard by more animals...
          changes.push({ label: `${loud.name}: louder ads reach more animals` });
          changes.push({ label: `${loud.name}: some voters feel annoyed by the noise` });
          trust[loud.id] -= 0.03; // ...but some are annoyed.
          break;
        }
      }
      drawnEvents.push({ event, changes });
    }
  }

  // 4. Policies. Story mode keeps 3 flagship promises per candidate;
  //    Classroom Election covers up to 5 issues; the Voting Systems Lab
  //    gives every candidate a promise on EVERY selected issue.
  const promiseCount =
    settings.ageMode === 'story'
      ? 3
      : settings.ageMode === 'classroom'
        ? Math.min(5, issues.length)
        : issues.length;
  const candidates: Candidate[] = seeds.map((s) => ({
    ...s,
    policies: generatePolicies(s, issues, rng, promiseCount),
  }));

  // 5. Voters and 6. Ballots — generated once, reused by every voting rule.
  const voters = makeVoters(
    settings.voterCount,
    VOTER_GROUPS,
    issues,
    rng,
    settings.voterMix,
  );
  const ctx: BallotContext = {
    issues,
    issueWeights,
    trust,
    polarization: settings.polarization,
  };
  const ballots = makeBallots(voters, candidates, VOTER_GROUPS, ctx, rng);

  return {
    settings,
    candidates,
    issues,
    voterGroups: VOTER_GROUPS,
    voters,
    ballots,
    drawnEvents,
    issueWeights,
    isTeaching: false,
  };
}

export function createTeachingGame(settings: ElectionSettings): GameState {
  return buildTeachingGame(settings);
}
