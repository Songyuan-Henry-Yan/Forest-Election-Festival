import { useState } from 'react';
import type { AgeMode } from '../types/game';

interface Props {
  ageMode: AgeMode;
  onAgeMode: (m: AgeMode) => void;
  onTeaching: () => void;
  onRandom: () => void;
}

const AGE_CHIPS: { id: AgeMode; label: string }[] = [
  { id: 'story', label: '🧸 Ages 6–8' },
  { id: 'classroom', label: '🏫 Ages 9–11' },
  { id: 'lab', label: '🔬 Ages 12–14' },
];

export default function WelcomeGate({ ageMode, onAgeMode, onTeaching, onRandom }: Props) {
  const [tip, setTip] = useState(false);

  return (
    <section className="welcome">
      <div className="gate-scene" aria-hidden="true">
        <div className="gate-banner">🎪 Forest Election Festival 🎪</div>
        <div className="gate-arch">
          <div className="gate-post gate-post-left" />
          <div className="gate-top" />
          <div className="gate-post gate-post-right" />
          <span className="gate-animal gate-animal-1">🦊</span>
          <span className="gate-animal gate-animal-2">🐼</span>
          <span className="gate-animal gate-animal-3">🦉</span>
          <span className="gate-animal gate-animal-4">🐢</span>
          <span className="gate-tree gate-tree-left">🌳</span>
          <span className="gate-tree gate-tree-right">🌲</span>
        </div>
      </div>

      <h2 className="welcome-title">Animal Kingdom Election Festival</h2>
      <p className="welcome-subtitle">
        Same voters. Same ballots. Different voting rules.
        <br />
        <strong>Will the same animal win?</strong>
      </p>
      <p className="welcome-intro">
        The animals of the forest are choosing a leader. But the way they count
        votes might change who wins. Walk through the election festival, meet
        the candidates, and try different voting rules.
      </p>

      <button
        className="ballot-box"
        onMouseEnter={() => setTip(true)}
        onMouseLeave={() => setTip(false)}
        onFocus={() => setTip(true)}
        onBlur={() => setTip(false)}
        onClick={() => setTip((t) => !t)}
        aria-label="Ballot box. The ballots stay the same. The counting rules can change."
      >
        <span aria-hidden="true">🗳️ 🍃🍃🍃</span>
        {tip && (
          <span className="ballot-tip" role="status">
            The ballots stay the same. The counting rules can change.
          </span>
        )}
      </button>

      <div className="age-chips" role="radiogroup" aria-label="Who is playing today?">
        <span className="age-chips-label">Who is playing today?</span>
        {AGE_CHIPS.map((c) => (
          <button
            key={c.id}
            role="radio"
            aria-checked={ageMode === c.id}
            className={`chip ${ageMode === c.id ? 'is-active' : ''}`}
            onClick={() => onAgeMode(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="welcome-buttons">
        <button className="btn btn-primary btn-big" onClick={onTeaching}>
          🏫 Start with Teaching Example
        </button>
        <button className="btn btn-secondary btn-big" onClick={onRandom}>
          🌱 Create a Random Election
        </button>
      </div>
      <p className="muted welcome-hint">
        The teaching example is a ready-made classroom election where different
        rules really do pick different winners — it works in every age mode,
        and all nine counting machines are switched on for it.
      </p>
    </section>
  );
}
