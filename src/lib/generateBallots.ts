import type { Ballot,Candidate,Issue,Polarization,VoterGroup } from '../types/game';
import { mulberry32, clamp } from './random';
const dot=(a:Record<string,number>,b:Record<string,number>)=>Object.keys(a).reduce((s,k)=>s+(a[k]??0)*(b[k]??0),0);
export function generateBallots(seed:number,count:number,polarization:Polarization,candidates:Candidate[],groups:VoterGroup[],issues:Issue[]):Ballot[]{
 const rand=mulberry32(seed); const noise={Low:2.2,Medium:1.2,High:.55}[polarization]; const approve={Low:2.7,Medium:3.2,High:3.75}[polarization];
 return Array.from({length:count},(_,i)=>{const g=groups[i%groups.length]; const selected=issues.filter(x=>g.issueIds.includes(x.id)).slice(0,2);
  const prefs=candidates.map(c=>{const issueBoost=selected.reduce((s,is)=>s+is.tags.reduce((t,tag)=>t+c.axis[tag]*.18,0),0); return {id:c.id,score:dot(g.axis,c.axis)+issueBoost+(rand()-.5)*noise*10};}).sort((a,b)=>b.score-a.score);
  const max=prefs[0].score,min=prefs[prefs.length-1].score; const scores:Record<string,number>={}; prefs.forEach(p=>scores[p.id]=Math.round(clamp(((p.score-min)/(max-min||1))*5,0,5)));
  return {voterId:`voter-${i+1}`,voterGroupId:g.id,ranking:prefs.map(p=>p.id),approvals:prefs.filter(p=>scores[p.id]>=approve).map(p=>p.id),scores,favoriteIssues:selected.map(x=>x.id)};
 });
}
