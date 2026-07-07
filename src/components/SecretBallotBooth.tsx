import { useState } from 'react';
import type { Candidate } from '../types/game';
import type { PracticeBallot } from '../App';
import AnimalAvatar from './AnimalAvatar';
import { playSeal, playStar, playSticker, playTick } from '../lib/sound';
import { VOTING_SYSTEMS } from '../data/votingSystems';

interface Props {
  candidates: Candidate[];
  practiceBallot: PracticeBallot | null;
  onPracticeBallot: (b: PracticeBallot) => void;
  guestVoter: boolean;
  onGuestVoter: (on: boolean) => void;
  onPracticeDone: () => void;
}

export default function SecretBallotBooth({
  candidates,
  practiceBallot,
  onPracticeBallot,
  guestVoter,
  onGuestVoter,
  onPracticeDone,
}: Props) {
  const [ranking, setRanking] = useState<string[]>(
    practiceBallot?.ranking.length === candidates.length
      ? practiceBallot.ranking
      : candidates.map((c) => c.id),
  );
  const [approvals, setApprovals] = useState<string[]>(practiceBallot?.approvals ?? []);
  const [scores, setScores] = useState<Record<string, number>>(
    practiceBallot?.scores ?? Object.fromEntries(candidates.map((c) => [c.id, 3])),
  );
  const [sealed, setSealed] = useState(practiceBallot !== null);
  const [tab, setTab] = useState<'rank' | 'approve' | 'score'>('rank');

  const move = (id: string, dir: -1 | 1) => {
    playTick();
    setSealed(false);
    setRanking((r) => {
      const i = r.indexOf(id);
      const j = i + dir;
      if (j < 0 || j >= r.length) return r;
      const next = r.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const toggleApproval = (id: string) => {
    if (!approvals.includes(id)) playSticker();
    else playTick();
    setSealed(false);
    setApprovals((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  };

  const setScore = (id: string, s: number) => {
    playStar();
    setSealed(false);
    setScores((sc) => ({ ...sc, [id]: s }));
  };

  const seal = () => {
    playSeal();
    onPracticeBallot({ ranking, approvals, scores });
    setSealed(true);
    onPracticeDone();
  };

  const name = (id: string) => candidates.find((c) => c.id === id)?.name ?? id;
  const firstName = (id: string) => name(id).split(' ')[0];

  /** What each counting machine would read from this practice ballot. */
  const machineReads: Record<string, string> = {
    plurality: `Your one acorn goes to ${firstName(ranking[0])}.`,
    runoff: `Round 1: your acorn goes to ${firstName(ranking[0])}. If two finalists remain, your ballot backs whichever one you ranked higher.`,
    irv: `Your leaf starts on ${firstName(ranking[0])}. If they are eliminated, it flies to ${ranking
      .slice(1, 3)
      .map(firstName)
      .join(', then ')}${ranking.length > 3 ? ', and so on' : ''}.`,
    approval: approvals.length > 0
      ? `Your smile stickers go to ${approvals.map(firstName).join(', ')}.`
      : 'You placed no smile stickers yet — the sticker machine would read an empty card.',
    score: `Your star jar entries: ${ranking.map((id) => `${firstName(id)} ${scores[id] ?? 0}★`).join(', ')}.`,
    star: 'Your stars are counted first; then your ballot backs whichever finalist you starred higher.',
    borda: `Your ladder gives ${candidates.length - 1} points to ${firstName(ranking[0])}, ${
      candidates.length - 2
    } to ${firstName(ranking[1] ?? ranking[0])}, and so on down to 0.`,
    condorcet: `In every one-on-one matchup, your ballot backs whichever animal you ranked higher — so ${firstName(
      ranking[0],
    )} gets your support against everyone.`,
    council: `Your first choice, ${firstName(ranking[0])}, counts toward sharing the 7 council seats.`,
  };

  return (
    <div className="booth">
      <div className="booth-frame">
        <div className="booth-curtain" aria-hidden="true" />
        <h3>🤫 Secret Ballot Booth</h3>
        <p className="booth-sign">
          Practice ballot only. The forest’s simulated ballots are already ready.
        </p>
        <p className="muted">
          In a real democracy your ballot is <strong>private</strong> — nobody
          can peek! Try all three ways of voting:
        </p>

        <div className="booth-tabs" role="tablist" aria-label="Practice ballot types">
          {(
            [
              ['rank', '🪜 Rank them'],
              ['approve', '😊 Sticker the okay ones'],
              ['score', '⭐ Give stars'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              className={`booth-tab ${tab === id ? 'is-active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'rank' && (
          <ol className="rank-ladder" aria-label="Your ranking, favorite first">
            {ranking.map((id, i) => {
              const c = candidates.find((x) => x.id === id)!;
              return (
                <li key={id} className="rank-row">
                  <span className="rank-place">{i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}</span>
                  <AnimalAvatar species={c.species} label={c.visual} size={36} />
                  <span className="rank-name">{c.name}</span>
                  <span className="rank-controls">
                    <button
                      className="btn btn-tiny"
                      onClick={() => move(id, -1)}
                      disabled={i === 0}
                      aria-label={`Move ${c.name} up`}
                    >
                      ▲
                    </button>
                    <button
                      className="btn btn-tiny"
                      onClick={() => move(id, 1)}
                      disabled={i === ranking.length - 1}
                      aria-label={`Move ${c.name} down`}
                    >
                      ▼
                    </button>
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {tab === 'approve' && (
          <div className="approve-grid">
            {candidates.map((c) => {
              const on = approvals.includes(c.id);
              return (
                <button
                  key={c.id}
                  className={`approve-card ${on ? 'is-approved' : ''}`}
                  onClick={() => toggleApproval(c.id)}
                  aria-pressed={on}
                >
                  <AnimalAvatar species={c.species} label={c.visual} size={44} />
                  <span>{c.name}</span>
                  <span className="approve-sticker" aria-hidden="true">{on ? '😊' : '＋'}</span>
                </button>
              );
            })}
            <p className="muted approve-hint">
              Sticker <em>every</em> candidate who would be okay with you — one,
              some, or all!
            </p>
          </div>
        )}

        {tab === 'score' && (
          <div className="score-grid">
            {candidates.map((c) => (
              <div key={c.id} className="score-row">
                <AnimalAvatar species={c.species} label={c.visual} size={36} />
                <span className="rank-name">{c.name}</span>
                <div className="star-picker" role="radiogroup" aria-label={`Stars for ${c.name}`}>
                  {[0, 1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      role="radio"
                      aria-checked={scores[c.id] === s}
                      className={`star-btn ${scores[c.id] >= s && s > 0 ? 'is-lit' : ''} ${scores[c.id] === s ? 'is-chosen' : ''}`}
                      onClick={() => setScore(c.id, s)}
                      aria-label={`${s} star${s === 1 ? '' : 's'}`}
                    >
                      {s === 0 ? '0' : '★'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="booth-actions">
          <button className="btn btn-primary" onClick={seal}>
            {sealed ? '✅ Practice ballot sealed!' : '✉️ Seal my practice ballot'}
          </button>
        </div>

        {sealed && (
          <div className="machine-reads">
            <h4>🔎 How each counting machine reads YOUR ballot</h4>
            <p className="muted">
              One ballot, nine machines — each one notices something different:
            </p>
            <ul>
              {VOTING_SYSTEMS.map((sys) => (
                <li key={sys.id}>
                  <strong>
                    {sys.machineEmoji} {sys.machineName}:
                  </strong>{' '}
                  {machineReads[sys.id]}
                </li>
              ))}
            </ul>
          </div>
        )}

        <details className="guest-toggle">
          <summary>Advanced: add my ballot to the election</summary>
          <label className="toggle">
            <input
              type="checkbox"
              checked={guestVoter}
              onChange={(e) => onGuestVoter(e.target.checked)}
              disabled={!sealed}
            />
            <span>Add my ballot as one guest voter</span>
          </label>
          <p className="muted">
            {sealed
              ? 'If you turn this on, your sealed practice ballot is counted as ONE extra voter in every counting rule. The simulated forest ballots themselves never change.'
              : 'Seal your practice ballot first, then you can join the election as one guest voter.'}
            {' '}Rank every candidate so your guest ballot is complete.
          </p>
        </details>
      </div>
    </div>
  );
}
