import type { Candidate, Election, Polarization } from '../types/game';
import { candidates, studentTeamCandidates } from '../data/candidates';
import { issues } from '../data/issues';
import { voterGroups } from '../data/voterGroups';
import { defaultScenarioBallots } from '../data/defaultScenario';
import { generateBallots } from './generateBallots';

export function generateGame(seed:number,polarization:Polarization='Medium',voterCount=120,selectedIssueIds?:string[],candidateBalance='Different winners across systems',activeCandidates:Candidate[]=candidates):Election{
 const issueIds=selectedIssueIds??issues.slice(0,7).map(x=>x.id); const selected=issues.filter(i=>issueIds.includes(i.id));
 const useDemo=candidateBalance==='Different winners across systems'&&activeCandidates.every(c=>['pippa','tika','bruno','luna','milo'].includes(c.id));
 const roster=activeCandidates.length?activeCandidates:(candidateBalance==='Different winners across systems'?candidates:studentTeamCandidates);
 return {seed,voterCount:useDemo?defaultScenarioBallots.length:voterCount,polarization,selectedIssueIds:selected.map(i=>i.id),candidates:roster,ballots:useDemo?defaultScenarioBallots:generateBallots(seed,voterCount,polarization,roster,voterGroups,selected)};
}
