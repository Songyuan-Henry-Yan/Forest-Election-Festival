import type { Ballot } from '../types/game';
export const defaultScenarioGroups = [
  { name: 'Adventure Voters', size: 30, ranking: ['pippa','bruno','luna','milo','tika'], approvals: ['pippa'] },
  { name: 'Green Voters', size: 25, ranking: ['tika','bruno','luna','milo','pippa'], approvals: ['tika','bruno'] },
  { name: 'Careful Planners', size: 20, ranking: ['luna','bruno','tika','pippa','milo'], approvals: ['luna'] },
  { name: 'Safety Voters', size: 15, ranking: ['bruno','luna','tika','pippa','milo'], approvals: ['bruno','luna'] },
  { name: 'Fun Voters', size: 10, ranking: ['milo','luna','pippa','bruno','tika'], approvals: ['milo'] }
];
export const defaultScenarioBallots: Ballot[] = defaultScenarioGroups.flatMap((group, groupIndex) => Array.from({ length: group.size }, (_, index) => {
  const scores: Record<string, number> = {};
  group.ranking.forEach((id, rank) => { scores[id] = Math.max(1, 5 - rank); });
  return { voterId: `demo-${groupIndex + 1}-${index + 1}`, voterGroupId: group.name.toLowerCase().replace(/ /g, '-'), ranking: group.ranking, approvals: group.approvals, scores, favoriteIssues: ['forest-safety','food-sharing','river-cleanliness'] };
}));
export const expectedDefaultWinners = { plurality: 'pippa', irv: 'luna', approval: 'bruno' };
