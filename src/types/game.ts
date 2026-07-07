export type AgeMode='little'|'trail'|'assembly';
export type Polarization='Low'|'Medium'|'High';
export type AxisScores=Record<'freedom'|'safety'|'care'|'fairness'|'change'|'tradition'|'environment'|'facts',number>;
export type GameMode='Solo'|'Small group'|'Full class';
export type CandidateType='Animal NPC candidates'|'Student candidates'|'Student teams'|'Mixed mode';
export type CompareMode='Single voting system only'|'Run same election under multiple voting systems';
export type CampaignTone='Friendly'|'Competitive'|'Debate-heavy';
export type RallyLength='Short'|'Standard'|'Full manifesto';
export type ApprovalStrictness='Strict'|'Balanced'|'Generous';
export type CandidateBalance='Same winner across systems'|'Different winners across systems'|'Surprise close election'|'Runoff lesson'|'Approval compromise lesson'|'Equal strength'|'Asymmetric'|'Surprise outcome';
export type ClassPrivacy='Named candidates'|'Team names'|'Animal avatars'|'Anonymous ballots';
export interface ElectionSettings{mode:GameMode;candidateType:CandidateType;compareMode:CompareMode;campaignTone:CampaignTone;rallyLength:RallyLength;approvalStrictness:ApprovalStrictness;candidateBalance:CandidateBalance;classPrivacy:ClassPrivacy;customIssueCount:boolean;issueCount:number;}
export interface Candidate{ id:string; name:string; species:string; slogan:string; values:string[]; strengths:string[]; tradeoffs:string[]; avatar:string; axis:AxisScores; perspective?:string; roleCard?:string; posterText?:string; }
export interface Issue{ id:string; title:string; icon:string; question:string; story:string; tags:(keyof AxisScores)[]; teacherConnection:string; simpleText:string; mediumText:string; advancedText:string; tradeOffText?:string; }
export interface VoterGroup{ id:string; name:string; description:string; axis:AxisScores; issueIds:string[]; }
export interface Ballot{ voterId:string; voterGroupId:string; ranking:string[]; approvals:string[]; scores:Record<string,number>; favoriteIssues:string[]; }
export interface Election{ seed:number; voterCount:number; polarization:Polarization; selectedIssueIds:string[]; candidates:Candidate[]; ballots:Ballot[]; }
export interface RoundInfo{ label:string; details:string; tallies?:Record<string,number>; eliminated?:string[]; }
export interface VotingResult{ systemId:string; systemName:string; winnerIds:string[]; rounds:RoundInfo[]; counts:Record<string,number>; explanationForKids:string; strengths:string[]; weaknesses:string[]; tieBreakInfo:string; }
export interface CandidateMetrics{ candidateId:string; firstChoices:number; approvalRate:number; averageScore:number; pairwiseWins:number; veryUnhappy:number; }
