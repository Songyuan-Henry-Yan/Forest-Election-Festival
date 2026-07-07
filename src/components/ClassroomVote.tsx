// Classroom Vote: real students take turns casting real secret ballots on
// one device, and the class can top up the electorate with bot voters who
// vote like the simulated forest animals. The Counting Theater can then
// count the CLASS ballots instead of the forest's simulated ballots.

import { useState } from 'react';
import type { Ballot, GameState } from '../types/game';
import AnimalAvatar from './AnimalAvatar';
import { playSeal, playStar, playSticker, playTick, playToggle } from '../lib/sound';

export type BallotSource = 'forest' | 'class';

interface Props {
  game: GameState;
  classBallots: Ballot[];
  onSubmitStudent: (ballot: Omit<Ballot, 'voterId' | 'voterGroupId'>) => void;
  onFillBots: (targetTotal: number) => void;
  onClear: () => void;
  ballotSource: BallotSource;
  onSource: (s: BallotSource) => void;
}

export default function ClassroomVote({
  game,
  classBallots,
  onSubmitStudent,
  onFillBots,
  onClear,
  ballotSource,
  onSource,
}: Props) {
  const candidates = game.candidates;
  const students = classBallots.filter((b) => b.voterGroupId === 'student').length;
  const bots = classBallots.filter((b) => b.voterGroupId === 'bot').length;

  const freshRanking = () => candidates.map((c) => c.id);
  const freshScores = () =>
    Object.fromEntries(candidates.map((c) => [c.id, 3])) as Record<string, number>;

  const [ranking, setRanking] = useState<string[]>(freshRanking);
  const [approvals, setApprovals] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number>>(freshScores);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [botTarget, setBotTarget] = useState(30);

  const name = (id: string) => candidates.find((c) => c.id === id)?.name ?? id;

  const move = (id: string, dir: -1 | 1) => {
    playTick();
    setJustSubmitted(false);
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
    setJustSubmitted(false);
    setApprovals((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  };

  const setScore = (id: string, s: number) => {
    playStar();
    setJustSubmitted(false);
    setScores((sc) => ({ ...sc, [id]: s }));
  };

  /** Fill stickers and stars from the ranking, like the teaching example. */
  const quickFill = () => {
    playSticker();
    const n = ranking.length;
    const newScores: Record<string, number> = {};
    const newApprovals: string[] = [];
    ranking.forEach((id, i) => {
      const s = n <= 1 ? 5 : Math.round(5 * ((n - 1 - i) / (n - 1)));
      newScores[id] = s;
      if (s >= 3) newApprovals.push(id);
    });
    setScores(newScores);
    setApprovals(newApprovals);
  };

  const submit = () => {
    playSeal();
    onSubmitStudent({
      ranking: ranking.slice(),
      approvals: approvals.length > 0 ? approvals.slice() : [ranking[0]],
      scores: { ...scores },
      favoriteIssues: [],
    });
    // Reset for the next student — their ballot stays secret!
    setRanking(freshRanking());
    setApprovals([]);
    setScores(freshScores());
    setJustSubmitted(true);
  };

  const totalClass = classBallots.length;

  return (
    <div className="classroom-vote">
      <h3>🏫 Classroom Vote</h3>
      <p className="muted">
        Take turns at the screen: each student fills out a real secret ballot,
        presses submit, and passes to the next voter. You can add bot voters
        (they vote like the simulated forest animals) to make the election as
        big as you like. Then choose whose ballots the Counting Theater counts!
      </p>

      <div className="class-status" role="status">
        🗳️ Ballots in the class box: <strong>{totalClass}</strong>
        {totalClass > 0 && (
          <>
            {' '}({students} student{students === 1 ? '' : 's'}
            {bots > 0 && <>, {bots} bot{bots === 1 ? '' : 's'}</>})
          </>
        )}
      </div>

      {justSubmitted && (
        <p className="class-sealed" role="status">
          ✅ Ballot sealed and dropped in the box! Pass the screen to the next
          student — the form is fresh and nobody can see the last vote.
        </p>
      )}

      <div className="class-form">
        <h4>
          🤫 Student ballot #{students + 1}
        </h4>
        <div className="class-columns">
          <div>
            <strong>1. Rank them (favorite first)</strong>
            <ol className="rank-ladder">
              {ranking.map((id, i) => {
                const c = candidates.find((x) => x.id === id)!;
                return (
                  <li key={id} className="rank-row">
                    <span className="rank-place">{i + 1}</span>
                    <AnimalAvatar species={c.species} label={c.visual} size={30} />
                    <span className="rank-name">{c.name.split(' ')[0]}</span>
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
          </div>
          <div>
            <strong>2. Sticker everyone who’d be okay</strong>
            <div className="class-approvals">
              {candidates.map((c) => {
                const on = approvals.includes(c.id);
                return (
                  <button
                    key={c.id}
                    className={`approve-card ${on ? 'is-approved' : ''}`}
                    onClick={() => toggleApproval(c.id)}
                    aria-pressed={on}
                  >
                    <span>{c.name.split(' ')[0]}</span>
                    <span className="approve-sticker" aria-hidden="true">{on ? '😊' : '＋'}</span>
                  </button>
                );
              })}
            </div>
            <strong>3. Give stars</strong>
            <div className="score-grid">
              {candidates.map((c) => (
                <div key={c.id} className="score-row score-row-compact">
                  <span className="rank-name">{c.name.split(' ')[0]}</span>
                  <div className="star-picker" role="radiogroup" aria-label={`Stars for ${c.name}`}>
                    {[0, 1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={scores[c.id] === s}
                        className={`star-btn ${scores[c.id] >= s && s > 0 ? 'is-lit' : ''} ${scores[c.id] === s ? 'is-chosen' : ''}`}
                        onClick={() => setScore(c.id, s)}
                        aria-label={`${s} star${s === 1 ? '' : 's'} for ${name(c.id)}`}
                      >
                        {s === 0 ? '0' : '★'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="class-form-actions">
          <button className="btn btn-small btn-secondary" onClick={quickFill}>
            ✨ Quick-fill stickers &amp; stars from my ranking
          </button>
          <button className="btn btn-primary" onClick={submit}>
            ✉️ Seal ballot &amp; pass to the next student
          </button>
        </div>
      </div>

      <div className="bot-panel">
        <strong>🤖 Bot voters</strong>
        <p className="muted">
          Bots copy ballots from the simulated forest animals, so the class can
          see how their votes mix into a bigger crowd.
        </p>
        <div className="bot-controls">
          <label>
            Total voters goal:{' '}
            <input
              type="number"
              min={totalClass}
              max={500}
              value={botTarget}
              onChange={(e) => setBotTarget(Number(e.target.value))}
              aria-label="Total number of voters including bots"
            />
          </label>
          <button
            className="btn btn-secondary"
            onClick={() => {
              playToggle(true);
              onFillBots(botTarget);
            }}
            disabled={botTarget <= totalClass}
          >
            Fill with bots up to {botTarget}
          </button>
          {totalClass > 0 && (
            <button
              className="btn btn-small"
              onClick={() => {
                playToggle(false);
                onClear();
              }}
            >
              🗑️ Empty the class ballot box
            </button>
          )}
        </div>
      </div>

      {totalClass > 0 && (
        <div className="source-switch" role="radiogroup" aria-label="Which ballots should the Counting Theater count?">
          <strong>Which ballots should the Counting Theater count?</strong>
          <div className="source-options">
            <button
              role="radio"
              aria-checked={ballotSource === 'forest'}
              className={`source-option ${ballotSource === 'forest' ? 'is-selected' : ''}`}
              onClick={() => onSource('forest')}
            >
              🌲 Forest ballots ({game.ballots.length} simulated animals)
            </button>
            <button
              role="radio"
              aria-checked={ballotSource === 'class'}
              className={`source-option ${ballotSource === 'class' ? 'is-selected' : ''}`}
              onClick={() => onSource('class')}
            >
              🏫 Classroom ballots ({students} students{bots > 0 ? ` + ${bots} bots` : ''})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
