import type { Candidate, ClassPrivacy } from '../types/game';
import { studentTeamCandidates } from '../data/candidates';

export function ClassModePanel({ active, candidates, setCandidates, privacy }: { active: boolean; candidates: Candidate[]; setCandidates: (candidates: Candidate[]) => void; privacy: ClassPrivacy }) {
  if (!active) return null;
  const addCandidate = () => {
    const base = studentTeamCandidates[candidates.length % studentTeamCandidates.length];
    const safeName = privacy === 'Anonymous ballots' ? `Anonymous Team ${candidates.length + 1}` : privacy === 'Team names' ? base.name : `Student Candidate ${candidates.length + 1}`;
    setCandidates([...candidates, { ...base, id: `class-${Date.now()}-${candidates.length}`, name: safeName }]);
  };
  return <section className="panel"><p className="eyebrow">Class Mode</p><h2>Student teams and safe ballots</h2><p>The default class setup uses animal teams and can hide individual names so the activity does not feel like a popularity contest.</p><button onClick={() => setCandidates(studentTeamCandidates)}>Use animal team starter set</button><button onClick={addCandidate}>Add student/team candidate</button><div className="grid">{candidates.map(candidate=><article className="card" key={candidate.id}><h3>{candidate.name}</h3><p>{candidate.slogan}</p><small>{candidate.roleCard ?? candidate.perspective}</small></article>)}</div><p className="teacher">Students can vote between these teams. The same class preferences can be counted under plurality, ranked-choice, approval, score, and pairwise comparison.</p></section>;
}
