import { useState } from 'react';
import type { Candidate } from '../types/game';
import { AnimalAvatar } from './AnimalAvatar';

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const [open, setOpen] = useState(false);
  const promises = candidate.values.slice(0, 3);
  const acorns = Math.max(2, Math.round((candidate.axis.care + candidate.axis.safety + candidate.axis.change) / 2));
  return (
    <article className={`rally-card ${open ? 'speaking' : ''}`}>
      <div className="stage-planks" aria-hidden="true" />
      <AnimalAvatar candidate={candidate} />
      <h3>{candidate.name}</h3>
      <p className="species">{candidate.species} candidate</p>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? 'Close rally speech' : 'Hear rally speech'}
      </button>
      {open && (
        <div className="rally-details">
          <p className="speech-bubble">“{candidate.slogan}”</p>
          <div className="promise-row">
            {promises.map((promise) => <span className="promise-card" key={promise}>{promise}</span>)}
          </div>
          <p className="acorn-budget"><span aria-hidden="true">🌰</span> Acorn budget display: {acorns} acorns of planning needed</p>
          <p><b>Strengths:</b> {candidate.strengths.join('; ')}</p>
          <p><b>Tradeoffs:</b> {candidate.tradeoffs.join('; ')}</p>
        </div>
      )}
    </article>
  );
}
