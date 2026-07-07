import type { Ballot } from '../types/game';
const orders:[number,string[]][]=[
[28,['flynn','leo','dolly','olive','penny']],[24,['penny','olive','dolly','leo','flynn']],[20,['olive','dolly','penny','leo','flynn']],[16,['leo','dolly','flynn','olive','penny']],[12,['dolly','olive','penny','leo','flynn']]
];
export const teachingBallots:Ballot[]=orders.flatMap(([n,ranking],gi)=>Array.from({length:n},(_,i)=>{const scores:Record<string,number>={}; ranking.forEach((id,idx)=>scores[id]=5-idx);return{voterId:`teach-${gi}-${i}`,voterGroupId:'teaching',ranking,approvals:ranking.slice(0,3),scores,favoriteIssues:['budget']};}));
export const teachingExpected={plurality:'flynn',irv:'olive',borda:'dolly',condorcet:'dolly'};
