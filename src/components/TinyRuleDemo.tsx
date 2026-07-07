// A tiny 5-ballot demonstration election, fully separate from the real
// generated election. It reuses the exact same counting functions, and the
// player clicks through the counting one step at a time.

import { useState } from 'react';
import type { Ballot, VotingSystemId } from '../types/game';
import { runSystem, type CandidateRef } from '../lib/voting';
import { systemInfo } from '../data/votingSystems';
import { playSticker, playTick } from '../lib/sound';

const TINY_CANDIDATES: (CandidateRef & { emoji: string })[] = [
  { id: 'sunny', name: 'Sunny Squirrel', emoji: '🐿️' },
  { id: 'maple', name: 'Maple Mouse', emoji: '🐭' },
  { id: 'berry', name: 'Berry Bear', emoji: '🐻' },
];

const TINY_RANKINGS: string[][] = [
  ['sunny', 'berry', 'maple'],
  ['sunny', 'berry', 'maple'],
  ['maple', 'berry', 'sunny'],
  ['maple', 'berry', 'sunny'],
  ['berry', 'maple', 'sunny'],
];

const RANK_SCORE = [5, 3, 0];

export const TINY_BALLOTS: Ballot[] = TINY_RANKINGS.map((ranking, i) => ({
  voterId: `demo${i}`,
  voterGroupId: 'demo',
  ranking,
  approvals: ranking.slice(0, 2),
  scores: Object.fromEntries(ranking.map((id, r) => [id, RANK_SCORE[r]])),
  favoriteIssues: [],
}));

interface Props {
  systemId: VotingSystemId;
  onClose: () => void;
}

export default function TinyRuleDemo({ systemId, onClose }: Props) {
  const info = systemInfo(systemId);
  const result = runSystem(systemId, TINY_CANDIDATES, TINY_BALLOTS);
  const name = (id: string) => TINY_CANDIDATES.find((c) => c.id === id);
  // Reveal the counting one step at a time.
  const [revealed, setRevealed] = useState(0);
  const totalSteps = result.rounds.length;
  const done = revealed >= totalSteps;

  const nextStep = () => {
    if (revealed + 1 >= totalSteps) playSticker();
    else playTick();
    setRevealed((r) => Math.min(totalSteps, r + 1));
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Tiny example: ${info.machineName}`}>
      <div className="modal tiny-demo">
        <div className="modal-head">
          <h3>
            {info.machineEmoji} Tiny Example: {info.machineName}
          </h3>
          <button className="btn btn-small" onClick={onClose} aria-label="Close tiny example">✕ Close</button>
        </div>
        <p className="muted">
          This mini election has just <strong>5 ballots</strong> and 3 pretend
          candidates. It is separate from your real forest election — it only
          shows how the machine counts.
        </p>
        <div className="tiny-ballots">
          {TINY_BALLOTS.map((b, i) => (
            <div key={i} className="tiny-ballot" aria-label={`Ballot ${i + 1}`}>
              <small>Ballot {i + 1}</small>
              <ol>
                {b.ranking.map((id) => (
                  <li key={id}>
                    {name(id)?.emoji} {name(id)?.name.split(' ')[0]}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="tiny-note muted">
          Stars from each ballot: 1st place = 5⭐, 2nd = 3⭐, 3rd = 0⭐. Smile
          stickers go to 1st and 2nd places.
        </p>
        {result.rounds.slice(0, revealed).map((round, i) => (
          <div key={i} className="tiny-round">
            <strong>{round.title}</strong>
            <p>{round.description}</p>
            <ul className="tiny-counts">
              {round.counts.map((c) => (
                <li key={c.candidateId} className={c.eliminated ? 'is-eliminated' : ''}>
                  {name(c.candidateId)?.emoji} {name(c.candidateId)?.name}:{' '}
                  <strong>{c.value}</strong>
                  {c.pct !== undefined && ` (${Math.round(c.pct)}%)`}
                  {c.note ? ` — ${c.note}` : ''}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!done ? (
          <div className="demo-controls">
            <button className="btn btn-primary" onClick={nextStep}>
              {revealed === 0
                ? '▶ Feed the 5 ballots into the machine!'
                : `▶ Count the next step (${revealed}/${totalSteps} done)`}
            </button>
          </div>
        ) : (
          <>
            {result.tieBreakInfo && <p className="tie-note" role="note">🎗️ {result.tieBreakInfo}</p>}
            <p className="tiny-winner" role="status">
              🏆 Winner with this rule: <strong>{result.winnerLabel}</strong>
            </p>
            <p className="muted">
              Fun fact: with these exact same 5 ballots, different machines can
              pick different winners. Try another machine!
            </p>
            <div className="demo-controls">
              <button className="btn btn-small btn-secondary" onClick={() => setRevealed(0)}>
                ↺ Run it again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
