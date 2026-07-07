import type { Ballot, Candidate, RoundInfo, VotingResult } from '../types/game';

const name = (id: string, cs: Candidate[]) => cs.find((c) => c.id === id)?.name ?? id;
const emptyCounts = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, 0])) as Record<string, number>;

function basic(ballots: Ballot[], ids: string[]) {
  const first = emptyCounts(ids);
  const appr = emptyCounts(ids);
  const avg = emptyCounts(ids);
  ballots.forEach((b) => {
    first[b.ranking[0]]++;
    b.approvals.forEach((id) => appr[id]++);
    ids.forEach((id) => { avg[id] += b.scores[id] ?? 0; });
  });
  ids.forEach((id) => { avg[id] /= ballots.length; });
  return { first, appr, avg };
}

function pick(t: Record<string, number>, ballots: Ballot[], ids: string[]) {
  const { first, appr, avg } = basic(ballots, ids);
  return [...ids].sort((a, b) => t[b] - t[a] || avg[b] - avg[a] || first[b] - first[a] || appr[b] - appr[a] || a.localeCompare(b))[0];
}

function topTwo(t: Record<string, number>, ballots: Ballot[], ids: string[]) {
  const first = pick(t, ballots, ids);
  const second = pick(t, ballots, ids.filter((id) => id !== first));
  return [first, second];
}

const defaultTie = 'Ties are settled by average stars, first-choice votes, approvals, then candidate id alphabetical order.';
const result = (systemId: string, systemName: string, winnerIds: string[], counts: Record<string, number>, rounds: RoundInfo[], kids: string, str: string[], weak: string[], tie = defaultTie): VotingResult => ({ systemId, systemName, winnerIds, counts, rounds, explanationForKids: kids, strengths: str, weaknesses: weak, tieBreakInfo: tie });

export function plurality(ballots: Ballot[], cs: Candidate[]) {
  const ids = cs.map((c) => c.id), counts = emptyCounts(ids);
  ballots.forEach((b) => counts[b.ranking[0]]++);
  const w = pick(counts, ballots, ids);
  return result('plurality', 'Choose-One / Plurality', [w], counts, [{ label: 'Only first choices count', details: `${name(w, cs)} had the most favorite-fan ballots.`, tallies: counts }], 'Count only each voter’s top choice. Most top choices wins.', ['Easy to understand', 'Simple ballot'], ['Ignores backup choices']);
}

export function twoRound(ballots: Ballot[], cs: Candidate[]) {
  const ids = cs.map((c) => c.id), firstCounts = emptyCounts(ids);
  ballots.forEach((b) => firstCounts[b.ranking[0]]++);
  const firstWinner = pick(firstCounts, ballots, ids);
  const rounds: RoundInfo[] = [{ label: 'Round 1: first choices', details: 'Count every voter’s favorite candidate. A candidate with more than 50% wins right away.', tallies: firstCounts }];
  if (firstCounts[firstWinner] > ballots.length / 2) {
    return result('twoRound', 'Two-Round Runoff', [firstWinner], firstCounts, rounds, 'If one candidate has a majority, they win. Otherwise, the top two meet at the bridge.', ['Majority check is easy to see'], ['Only two finalists remain after round one']);
  }
  const finalists = topTwo(firstCounts, ballots, ids);
  const runoffCounts = Object.fromEntries(finalists.map((id) => [id, 0])) as Record<string, number>;
  ballots.forEach((b) => {
    const choice = b.ranking.indexOf(finalists[0]) < b.ranking.indexOf(finalists[1]) ? finalists[0] : finalists[1];
    runoffCounts[choice]++;
  });
  const w = pick(runoffCounts, ballots, finalists);
  rounds.push({ label: `Round 2: ${name(finalists[0], cs)} vs ${name(finalists[1], cs)}`, details: 'Each ballot goes to whichever finalist is ranked higher.', tallies: runoffCounts });
  return result('twoRound', 'Two-Round Runoff', [w], runoffCounts, rounds, 'If nobody gets more than half, the top two candidates have a runoff.', ['Gives voters a majority runoff'], ['Voters whose favorites miss the top two have less choice in round two']);
}

export function approval(ballots: Ballot[], cs: Candidate[]) {
  const ids = cs.map((c) => c.id), counts = emptyCounts(ids);
  ballots.forEach((b) => b.approvals.forEach((id) => counts[id]++));
  const w = pick(counts, ballots, ids);
  return result('approval', 'Approval Voting', [w], counts, [{ label: 'Approved candidates count', details: `${name(w, cs)} was marked okay by the most animals.`, tallies: counts }], 'Voters mark every candidate they think is okay. Most okay marks wins.', ['Lets voters support more than one candidate'], ['Does not show exact ranking']);
}

export function score(ballots: Ballot[], cs: Candidate[]) {
  const ids = cs.map((c) => c.id), totals = emptyCounts(ids);
  ballots.forEach((b) => ids.forEach((id) => { totals[id] += b.scores[id] ?? 0; }));
  const averages = Object.fromEntries(ids.map((id) => [id, Number((totals[id] / ballots.length).toFixed(2))]));
  const w = pick(totals, ballots, ids);
  return result('score', 'Score Voting', [w], totals, [{ label: 'Total stars', details: 'Add every 0–5 star score for each candidate.', tallies: totals }, { label: 'Average stars', details: 'Average stars show about how many stars each voter gave.', tallies: averages }], 'Voters give 0 to 5 stars. The candidate with the most total stars wins.', ['Lets voters show strong, medium, or low support'], ['Voters may use stars differently']);
}

export function star(ballots: Ballot[], cs: Candidate[]) {
  const ids = cs.map((c) => c.id), totals = emptyCounts(ids);
  ballots.forEach((b) => ids.forEach((id) => { totals[id] += b.scores[id] ?? 0; }));
  const finalists = topTwo(totals, ballots, ids);
  const runoffCounts = Object.fromEntries(finalists.map((id) => [id, 0])) as Record<string, number>;
  let noPreference = 0;
  ballots.forEach((b) => {
    const [a, c] = finalists;
    const aScore = b.scores[a] ?? 0, cScore = b.scores[c] ?? 0;
    if (aScore > cScore) runoffCounts[a]++;
    else if (cScore > aScore) runoffCounts[c]++;
    else noPreference++;
  });
  const w = pick(runoffCounts, ballots, finalists);
  return result('star', 'STAR Voting', [w], runoffCounts, [{ label: 'Score round', details: 'Add every star. The top two star-getters become finalists.', tallies: totals }, { label: `Automatic runoff: ${name(finalists[0], cs)} vs ${name(finalists[1], cs)}`, details: `${noPreference} ballots gave the finalists equal scores and counted as no preference.`, tallies: runoffCounts }], 'STAR means Score Then Automatic Runoff: stars pick two finalists, then ballots choose between them.', ['Uses scores and a final head-to-head check'], ['Takes two steps to explain']);
}

export function borda(ballots: Ballot[], cs: Candidate[]) {
  const ids = cs.map((c) => c.id), n = ids.length, counts = emptyCounts(ids);
  ballots.forEach((b) => b.ranking.forEach((id, i) => counts[id] += n - 1 - i));
  const w = pick(counts, ballots, ids);
  return result('borda', 'Borda Count', [w], counts, [{ label: 'Rank points added', details: `Higher ranks earn more points. ${name(w, cs)} earned the most points.`, tallies: counts }], 'Candidates earn points from every ranking place. Most points wins.', ['Uses the whole ranking'], ['A lower ranking still changes points']);
}

export function irv(ballots: Ballot[], cs: Candidate[]) {
  let active = cs.map((c) => c.id); const rounds: RoundInfo[] = []; let counts: Record<string, number> = {};
  while (active.length > 1) {
    counts = emptyCounts(active);
    ballots.forEach((b) => { const top = b.ranking.find((id) => active.includes(id)); if (top) counts[top]++; });
    rounds.push({ label: `Round ${rounds.length + 1}`, details: 'Count top active choices. Last place is eliminated unless someone has a majority.', tallies: { ...counts } });
    const leader = pick(counts, ballots, active);
    if (counts[leader] > ballots.length / 2) return result('irv', 'Ranked Choice Voting / Instant Runoff Voting', [leader], counts, rounds, 'If your favorite cannot win, your ballot moves to your next choice.', ['Uses backup choices'], ['Rounds can take more explaining']);
    const loser = [...active].sort((a, b) => counts[a] - counts[b] || a.localeCompare(b))[0];
    rounds[rounds.length - 1].eliminated = [loser]; active = active.filter((id) => id !== loser);
  }
  return result('irv', 'Ranked Choice Voting / Instant Runoff Voting', [active[0]], counts, rounds, 'If your favorite cannot win, your ballot moves to your next choice.', ['Uses backup choices'], ['Rounds can take more explaining']);
}

export function condorcet(ballots: Ballot[], cs: Candidate[]) {
  const ids = cs.map((c) => c.id), wins = emptyCounts(ids), rounds: RoundInfo[] = [];
  ids.forEach((a) => ids.forEach((b) => { if (a >= b) return; let av = 0, bv = 0; ballots.forEach((x) => x.ranking.indexOf(a) < x.ranking.indexOf(b) ? av++ : bv++); const win = av > bv ? a : b; if (av !== bv) wins[win]++; rounds.push({ label: `${name(a, cs)} vs ${name(b, cs)}`, details: `${av} voters preferred ${name(a, cs)}; ${bv} preferred ${name(b, cs)}.` }); }));
  const perfect = ids.find((id) => wins[id] === ids.length - 1); const w = perfect ?? pick(wins, ballots, ids);
  return result('condorcet', 'Condorcet Matchups with Copeland fallback', [w], wins, rounds, perfect ? 'This winner beat every other candidate one-on-one.' : 'No one beat everyone, so friendly matchup wins decide.', ['Checks head-to-head agreement'], ['Many matchups to count']);
}

export function council(ballots: Ballot[], cs: Candidate[]) {
  const ids = cs.map((c) => c.id), firstCounts = emptyCounts(ids), seats = emptyCounts(ids), seatWinners: string[] = [], rounds: RoundInfo[] = [];
  ballots.forEach((b) => firstCounts[b.ranking[0]]++);
  for (let seat = 1; seat <= 7; seat++) {
    const quotients = Object.fromEntries(ids.map((id) => [id, firstCounts[id] / (seats[id] + 1)])) as Record<string, number>;
    const winner = pick(quotients, ballots, ids);
    seats[winner]++;
    seatWinners.push(winner);
    rounds.push({ label: `Council seat ${seat}`, details: `${name(winner, cs)} earns this council seat using the D’Hondt highest quotient.`, tallies: { ...quotients } });
  }
  rounds.unshift({ label: 'First-choice votes for council', details: 'Council seats start from first-choice support, then D’Hondt quotients assign seven seats.', tallies: firstCounts });
  return result('council', 'Proportional Forest Council', seatWinners, seats, rounds, 'This is not a single-president rule. It fills seven council seats from first-choice votes.', ['Can represent more than one group on a council'], ['It does not choose one single winner'], 'D’Hondt seat ties use the same tie-break order as other rules.');
}

export const systems = { plurality, twoRound, irv, approval, score, star, borda, condorcet, council };
