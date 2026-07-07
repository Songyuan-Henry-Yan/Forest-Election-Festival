// Verifies the Teaching Example produces the expected winners.
// Run with: npx tsx scripts/verifyTeaching.ts

import { buildTeachingBallots } from '../src/data/sampleElection';
import { CANDIDATE_POOL, TEACHING_CANDIDATE_IDS } from '../src/data/candidates';
import { runAllSystems, runSystem } from '../src/lib/voting';
import { computeMetrics } from '../src/lib/metrics';
import { createGame } from '../src/lib/generateGame';
import type { ElectionSettings, VotingSystemId } from '../src/types/game';
import { DEFAULT_VOTER_MIX } from '../src/types/game';

const candidates = TEACHING_CANDIDATE_IDS.map((id) => {
  const c = CANDIDATE_POOL.find((x) => x.id === id)!;
  return { id: c.id, name: c.name };
});
const ballots = buildTeachingBallots();

const expected: Partial<Record<VotingSystemId, string>> = {
  plurality: 'flynn',
  irv: 'olive',
  borda: 'dolly',
  condorcet: 'dolly',
};

let failed = 0;
const all: VotingSystemId[] = [
  'plurality', 'runoff', 'irv', 'approval', 'score', 'star', 'borda', 'condorcet', 'council',
];
for (const r of runAllSystems(all, candidates, ballots)) {
  const exp = expected[r.systemId];
  const ok = exp === undefined || r.winnerIds[0] === exp;
  if (!ok) failed++;
  console.log(
    `${ok ? 'PASS' : 'FAIL'} ${r.systemId.padEnd(10)} winner: ${r.winnerLabel}` +
      (exp ? ` (expected ${exp})` : ''),
  );
  if (r.systemId === 'irv') {
    for (const round of r.rounds) console.log(`      ${round.title}`);
  }
  if (r.systemId === 'council') {
    console.log(`      seats: ${JSON.stringify(r.seats)}`);
  }
}

// Condorcet must NOT be a Copeland fallback in the teaching example.
const cond = runSystem('condorcet', candidates, ballots);
if (cond.copelandFallback) {
  console.log('FAIL condorcet used Copeland fallback (expected true Condorcet winner)');
  failed++;
}

// Metrics sanity: Dolly should be approved by 100% of teaching voters.
const metrics = computeMetrics(candidates, ballots);
const dolly = metrics.find((m) => m.candidateId === 'dolly')!;
console.log(`INFO dolly approval: ${dolly.approvalPct}% (expect 100)`);
if (Math.round(dolly.approvalPct) !== 100) failed++;

// Determinism: the same seed must generate identical ballots.
const settings: ElectionSettings = {
  ageMode: 'classroom',
  candidateCount: 5,
  issueCount: 6,
  voterCount: 80,
  polarization: 'medium',
  campaignEvents: true,
  budgetLimits: true,
  charterReminders: true,
  teacherMode: false,
  seed: 'maple-bridge-42',
  systems: all,
  voterMix: DEFAULT_VOTER_MIX,
};
const g1 = createGame(settings);
const g2 = createGame(settings);
const same =
  JSON.stringify(g1.ballots) === JSON.stringify(g2.ballots) &&
  JSON.stringify(g1.candidates.map((c) => c.id)) === JSON.stringify(g2.candidates.map((c) => c.id));
console.log(same ? 'PASS determinism: same seed -> same ballots' : 'FAIL determinism');
if (!same) failed++;

// All 9 systems must run without crashing on a generated election.
const results = runAllSystems(all, g1.candidates, g1.ballots);
console.log(`PASS all ${results.length} systems ran on a random election`);
for (const r of results) {
  console.log(`      ${r.systemId.padEnd(10)} -> ${r.winnerLabel}`);
}

// Story-mode-sized election with 3 candidates + high polarization edge case.
const g3 = createGame({ ...settings, candidateCount: 3, voterCount: 20, polarization: 'high', seed: 'tiny-test-7' });
runAllSystems(all, g3.candidates, g3.ballots);
console.log('PASS small high-polarization election ran');

if (failed > 0) {
  console.error(`\n${failed} check(s) FAILED`);
  process.exit(1);
}
console.log('\nAll teaching-example checks passed!');
