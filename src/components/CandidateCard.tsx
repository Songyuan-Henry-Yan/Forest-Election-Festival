import { useState } from 'react';
import type { AgeMode, Candidate, Issue, RallyLength } from '../types/game';
import { moderatorChallenges } from '../data/settings';
import { AnimalAvatar } from './AnimalAvatar';

function issuePlan(candidate: Candidate, issue: Issue, index: number) {
  const topValue = candidate.values[index % candidate.values.length] ?? 'teamwork';
  return {
    position: `${candidate.name} looks at ${issue.title} through ${topValue}.`,
    benefits: `Animals who care about ${issue.tags[0]} get extra attention.`,
    tradeoff: issue.tradeOffText ?? 'The forest still has to choose what comes first.',
    action: `Start a small ${issue.icon} ${issue.title.toLowerCase()} plan and check it after one moon.`
  };
}

export function CandidateCard({ candidate, selectedIssues = [], ageMode = 'trail', rallyLength = 'Standard' }: { candidate: Candidate; selectedIssues?: Issue[]; ageMode?: AgeMode; rallyLength?: RallyLength }) {
  const [open, setOpen] = useState(false);
  const issueLimit = rallyLength === 'Full manifesto' || (ageMode === 'little' && selectedIssues.length <= 5) ? selectedIssues.length : Math.max(5, rallyLength === 'Short' ? 5 : Math.min(selectedIssues.length, 7));
  const issuesToAddress = selectedIssues.slice(0, issueLimit);
  const acorns = Math.max(2, Math.round((candidate.axis.care + candidate.axis.safety + candidate.axis.change) / 2));
  return (
    <article className={`rally-card ${open ? 'speaking' : ''}`}>
      <div className="stage-planks" aria-hidden="true" />
      <AnimalAvatar candidate={candidate} />
      <h3>{candidate.name}</h3>
      <p className="species">{candidate.species} candidate</p>
      <p><b>Perspective:</b> {candidate.perspective}</p>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Close rally speech' : 'Hear rally speech'}</button>
      {open && (
        <div className="rally-details">
          <p className="speech-bubble">“{candidate.slogan}”</p>
          <p><b>Opening identity:</b> I am {candidate.name}, and my role is {candidate.roleCard ?? 'forest helper'}.</p>
          <p className="acorn-budget"><span aria-hidden="true">🌰</span> Acorn budget display: {acorns} acorns of planning needed</p>
          <div className="issue-response-list">{issuesToAddress.map((issue, index) => { const plan = issuePlan(candidate, issue, index); return <section className="promise-card" key={issue.id}><h4>{issue.icon} {issue.title}</h4><p><b>Position:</b> {plan.position}</p><p><b>Who benefits:</b> {plan.benefits}</p><p><b>Trade-off:</b> {plan.tradeoff}</p><p><b>Concrete action:</b> {plan.action}</p></section>; })}</div>
          <p><b>Moderator challenge:</b> {moderatorChallenges[Math.abs(candidate.id.length + selectedIssues.length) % moderatorChallenges.length]}</p>
          <p><b>Audience question:</b> Which promise should be checked against the festival budget first?</p>
          <p><b>Closing promise:</b> {candidate.posterText ?? candidate.slogan}</p>
          <p><b>Strengths:</b> {candidate.strengths.join('; ')}</p><p><b>Tradeoffs:</b> {candidate.tradeoffs.join('; ')}</p>
        </div>
      )}
    </article>
  );
}
