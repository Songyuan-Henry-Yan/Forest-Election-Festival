export type AgeMode='younger'|'older';
export type Polarization='Low'|'Medium'|'High';
export type AxisScores=Record<'freedom'|'safety'|'care'|'fairness'|'change'|'tradition'|'environment'|'facts',number>;
export interface Candidate{ id:string; name:string; species:string; slogan:string; values:string[]; strengths:string[]; tradeoffs:string[]; avatar:string; axis:AxisScores; }
export interface Issue{ id:string; title:string; icon:string; question:string; story:string; tags:(keyof AxisScores)[]; teacherConnection:string; }
export interface VoterGroup{ id:string; name:string; description:string; axis:AxisScores; issueIds:string[]; }
export interface Ballot{ voterId:string; voterGroupId:string; ranking:string[]; approvals:string[]; scores:Record<string,number>; favoriteIssues:string[]; }
export interface Election{ seed:number; voterCount:number; polarization:Polarization; selectedIssueIds:string[]; candidates:Candidate[]; ballots:Ballot[]; }
export interface RoundInfo{ label:string; details:string; tallies?:Record<string,number>; eliminated?:string[]; }
export interface VotingResult{ systemId:string; systemName:string; winnerIds:string[]; rounds:RoundInfo[]; counts:Record<string,number>; explanationForKids:string; strengths:string[]; weaknesses:string[]; tieBreakInfo:string; }
export interface CandidateMetrics{ candidateId:string; firstChoices:number; approvalRate:number; averageScore:number; pairwiseWins:number; veryUnhappy:number; }
