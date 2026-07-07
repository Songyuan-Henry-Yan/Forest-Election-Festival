import type { AgeMode, Ballot, Candidate, RallyLength } from '../types/game';
import { ageRanges } from '../data/settings';
import { approval, irv, plurality } from './voting';

export const getDefaultIssueCount = (age: AgeMode) => ageRanges[age].defaultIssueCount;
export const clampCustomIssueCount = (count: number) => Math.max(5, Math.min(12, count));
export const requiredRallyIssueCount = (selectedIssueCount: number, age: AgeMode, rallyLength: RallyLength) => rallyLength === 'Full manifesto' || (age === 'little' && selectedIssueCount <= 5) ? selectedIssueCount : Math.max(5, rallyLength === 'Short' ? 5 : Math.min(selectedIssueCount, 7));
export function validateDefaultScenario(ballots: Ballot[], candidates: Candidate[]) {
  const pluralityWinner = plurality(ballots, candidates).winnerIds[0];
  const irvWinner = irv(ballots, candidates).winnerIds[0];
  const approvalResult = approval(ballots, candidates);
  const approvalWinner = approvalResult.winnerIds[0];
  const approvalTotals = approvalResult.counts;
  const sortedApprovals = Object.values(approvalTotals).sort((a, b) => b - a);
  return { pluralityWinner, irvWinner, approvalWinner, approvalTotals, approvalMargin: sortedApprovals[0] - sortedApprovals[1], viableCandidates: new Set([pluralityWinner, irvWinner, approvalWinner]).size };
}
export function makeAnonymousClassCandidate(index: number, base: Candidate): Candidate { return { ...base, id: `class-${index}`, name: `Anonymous Team ${index}` }; }
