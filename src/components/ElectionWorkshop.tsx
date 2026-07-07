import { useState } from 'react';
import type { AgeMode, ElectionSettings, JobFamily, Polarization, VoterMix } from '../types/game';
import { defaultSettingsFor, defaultSystemsFor, VOTING_SYSTEMS } from '../data/votingSystems';
import { JOB_FAMILY_INFO, VOTER_GROUPS } from '../data/voterGroups';
import { mixFactor } from '../lib/generateBallots';
import { randomSeed } from '../lib/random';
import TeacherNotes, { NONPARTISAN_NOTE } from './TeacherNotes';

const MIX_DIALS: {
  key: 'generations' | 'pantries' | 'roots';
  question: string;
  neg: string;
  pos: string;
}[] = [
  {
    key: 'generations',
    question: '🎂 Ages in the forest',
    neg: '🧒 Lots of young cubs & students',
    pos: '🧓 Lots of wise elders',
  },
  {
    key: 'pantries',
    question: '🌰 Snack pantries at home',
    neg: '🍽️ Many nearly-empty pantries',
    pos: '🧺 Many full pantries',
  },
  {
    key: 'roots',
    question: '🏡 Forest roots',
    neg: '🌳 Mostly long-time families',
    pos: '🚚 Many new families moving in',
  },
];

interface Props {
  settings: ElectionSettings;
  onChange: (patch: Partial<ElectionSettings>) => void;
  onCreate: (settings: ElectionSettings) => void;
  hasGame: boolean;
  gameSeed: string | null;
}

const AGE_CARDS: { id: AgeMode; title: string; ages: string; blurb: string; emoji: string }[] = [
  {
    id: 'story',
    title: 'Story Mode',
    ages: 'Ages 6–8',
    blurb: 'Big cards, short sentences, three friendly candidates.',
    emoji: '🧸',
  },
  {
    id: 'classroom',
    title: 'Classroom Election',
    ages: 'Ages 9–11',
    blurb: 'The main festival: five candidates and five counting rules.',
    emoji: '🏫',
  },
  {
    id: 'lab',
    title: 'Voting Systems Lab',
    ages: 'Ages 12–14',
    blurb: 'More candidates, matchup grids, and a forest council.',
    emoji: '🔬',
  },
];

export default function ElectionWorkshop({
  settings,
  onChange,
  onCreate,
  hasGame,
  gameSeed,
}: Props) {
  const [copied, setCopied] = useState(false);

  const setAgeMode = (mode: AgeMode) => {
    const d = defaultSettingsFor(mode);
    onChange({ ageMode: mode, ...d, systems: defaultSystemsFor(mode) });
  };

  const setMix = (patch: Partial<VoterMix>) =>
    onChange({ voterMix: { ...settings.voterMix, ...patch } });

  const copySeed = async () => {
    try {
      await navigator.clipboard.writeText(settings.seed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const stagedChanges = hasGame && gameSeed !== null && gameSeed !== settings.seed;

  const audienceSize = Math.min(60, Math.max(6, Math.round(settings.voterCount / 3)));

  return (
    <section className="workshop">
      <h2>🛠️ Election Workshop</h2>
      <p className="page-intro">
        Welcome to the workshop! Hammer, saw, and stack your very own election.
        Nothing is decided until you open the festival gates.
      </p>

      <div className="workshop-block">
        <h3>Who is playing today?</h3>
        <div className="age-cards">
          {AGE_CARDS.map((c) => (
            <button
              key={c.id}
              className={`age-card ${settings.ageMode === c.id ? 'is-selected' : ''}`}
              onClick={() => setAgeMode(c.id)}
              aria-pressed={settings.ageMode === c.id}
            >
              <span className="age-emoji" aria-hidden="true">{c.emoji}</span>
              <strong>{c.title}</strong>
              <em>{c.ages}</em>
              <small>{c.blurb}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="workshop-grid">
        <div className="workshop-block">
          <h3>🎤 Candidates on stage: {settings.candidateCount}</h3>
          <input
            type="range"
            min={3}
            max={8}
            value={settings.candidateCount}
            onChange={(e) => onChange({ candidateCount: Number(e.target.value) })}
            aria-label="Number of candidates"
          />
          <div className="mini-stage" aria-hidden="true">
            <div className="mini-stage-floor" />
            {Array.from({ length: settings.candidateCount }).map((_, i) => (
              <span key={i} className="mini-badge" style={{ animationDelay: `${i * 0.05}s` }}>🐾</span>
            ))}
          </div>
        </div>

        <div className="workshop-block">
          <h3>🍃 Issue leaves on the branch: {settings.issueCount}</h3>
          <input
            type="range"
            min={3}
            max={10}
            value={settings.issueCount}
            onChange={(e) => onChange({ issueCount: Number(e.target.value) })}
            aria-label="Number of issues"
          />
          <div className="mini-branch" aria-hidden="true">
            <div className="branch-line" />
            {Array.from({ length: settings.issueCount }).map((_, i) => (
              <span key={i} className="mini-leaf">🍃</span>
            ))}
          </div>
        </div>

        <div className="workshop-block">
          <h3>🐾 Forest voters: {settings.voterCount}</h3>
          <input
            type="range"
            min={20}
            max={200}
            step={10}
            value={settings.voterCount}
            onChange={(e) => onChange({ voterCount: Number(e.target.value) })}
            aria-label="Number of simulated voters"
          />
          <div className="mini-audience" aria-hidden="true">
            {Array.from({ length: audienceSize }).map((_, i) => (
              <span key={i}>{['🐭', '🐿️', '🐸', '🐰', '🦔', '🐝', '🦉', '🦫', '🦌', '🐢'][i % 10]}</span>
            ))}
          </div>
        </div>

        <div className="workshop-block">
          <h3>🌬️ Strong feelings in the forest</h3>
          <div className="polarization-picker" role="radiogroup" aria-label="Polarization level">
            {(['low', 'medium', 'high'] as Polarization[]).map((p) => (
              <button
                key={p}
                role="radio"
                aria-checked={settings.polarization === p}
                className={`pol-option pol-${p} ${settings.polarization === p ? 'is-selected' : ''}`}
                onClick={() => onChange({ polarization: p })}
              >
                <span className="pol-vane" aria-hidden="true">
                  {p === 'low' ? '🍃' : p === 'medium' ? '🍃🍃' : '🍂🍃🍂'}
                </span>
                <strong>{p === 'low' ? 'Gentle breeze' : p === 'medium' ? 'Windy leaves' : 'Swirling leaves'}</strong>
                <small>
                  {p === 'low'
                    ? 'Voters are open to compromise.'
                    : p === 'medium'
                      ? 'A balanced forest.'
                      : 'Voters have very strong favorites.'}
                </small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="workshop-block">
        <h3>🏘️ Who lives in your forest?</h3>
        <p className="muted">
          Every animal family needs different things — that is <em>why</em> they
          vote differently. Change who lives in the forest, and the election can
          change too!
        </p>
        <div className="mix-mode" role="radiogroup" aria-label="How should the neighborhood be mixed?">
          <button
            role="radio"
            aria-checked={settings.voterMix.mode === 'random'}
            className={`source-option ${settings.voterMix.mode === 'random' ? 'is-selected' : ''}`}
            onClick={() => setMix({ mode: 'random' })}
          >
            🎲 Surprise mix
            <small>The magic seed decides which families are big or small.</small>
          </button>
          <button
            role="radio"
            aria-checked={settings.voterMix.mode === 'custom'}
            className={`source-option ${settings.voterMix.mode === 'custom' ? 'is-selected' : ''}`}
            onClick={() => setMix({ mode: 'custom' })}
          >
            🎨 Design the neighborhood
            <small>You choose the ages, pantries, roots, and jobs.</small>
          </button>
        </div>

        {settings.voterMix.mode === 'custom' && (
          <div className="mix-designer">
            {MIX_DIALS.map((dial) => (
              <div key={dial.key} className="dial-group" role="radiogroup" aria-label={dial.question}>
                <strong>{dial.question}</strong>
                <div className="dial-options">
                  {([-1, 0, 1] as const).map((v) => (
                    <button
                      key={v}
                      role="radio"
                      aria-checked={settings.voterMix[dial.key] === v}
                      className={`pol-option ${settings.voterMix[dial.key] === v ? 'is-selected' : ''}`}
                      onClick={() => setMix({ [dial.key]: v } as Partial<VoterMix>)}
                    >
                      {v === -1 ? dial.neg : v === 0 ? '⚖️ A balanced mix' : dial.pos}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="dial-group">
              <strong>💼 Jobs that are extra common</strong>
              <div className="chip-row">
                {(Object.keys(JOB_FAMILY_INFO) as JobFamily[]).map((job) => {
                  const on = settings.voterMix.jobs.includes(job);
                  return (
                    <button
                      key={job}
                      className={`chip ${on ? 'is-active' : ''}`}
                      aria-pressed={on}
                      onClick={() =>
                        setMix({
                          jobs: on
                            ? settings.voterMix.jobs.filter((j) => j !== job)
                            : [...settings.voterMix.jobs, job],
                        })
                      }
                    >
                      {JOB_FAMILY_INFO[job].emoji} {JOB_FAMILY_INFO[job].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mix-preview">
              <strong>🔭 Neighborhood preview</strong>
              <p className="muted">
                Roughly how big each family will be (the magic seed adds a
                little natural variety):
              </p>
              <div className="round-bars">
                {VOTER_GROUPS.map((g) => ({ g, w: mixFactor(g, settings.voterMix) }))
                  .sort((a, b) => b.w - a.w)
                  .map(({ g, w }, _, arr) => {
                    const total = arr.reduce((s, x) => s + x.w, 0);
                    const maxW = Math.max(...arr.map((x) => x.w));
                    return (
                      <div key={g.id} className="round-bar-row">
                        <span className="round-bar-name">{g.emoji} {g.name}</span>
                        <div className="round-bar-track">
                          <div
                            className="round-bar-fill"
                            style={{ width: `${(w / maxW) * 100}%`, background: 'var(--forest)' }}
                          />
                        </div>
                        <span className="round-bar-value">≈{Math.round((w / total) * 100)}%</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        <details className="neighbor-list">
          <summary>🐾 Meet the neighbors — what does each family need?</summary>
          <ul>
            {VOTER_GROUPS.map((g) => (
              <li key={g.id}>
                <strong>{g.emoji} {g.name}.</strong> {g.description}{' '}
                <em>What they need:</em> {g.needs}
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className="workshop-block">
        <h3>Festival extras</h3>
        <div className="toggle-row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.campaignEvents}
              onChange={(e) => onChange({ campaignEvents: e.target.checked })}
            />
            <span>🦜 Parrot News Stand (campaign events)</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.budgetLimits}
              onChange={(e) => onChange({ budgetLimits: e.target.checked })}
            />
            <span>🌰 Acorn budget limits</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.charterReminders}
              onChange={(e) => onChange({ charterReminders: e.target.checked })}
            />
            <span>📜 Forest Charter reminders</span>
          </label>
        </div>
        <div className="toggle-preview" aria-hidden="true">
          {settings.campaignEvents && <span title="News stand open">🦜📰</span>}
          {settings.budgetLimits && <span title="Acorn pouch ready">👝🌰</span>}
          {settings.charterReminders && <span title="Charter scroll ready">📜✨</span>}
        </div>
      </div>

      <div className="workshop-block">
        <h3>✨ Magic Election Seed</h3>
        <p className="muted">
          The same seed always grows the same election — same candidates, same
          voters, same ballots. Share a seed with a friend to compare results!
        </p>
        <div className="seed-row">
          <input
            className="seed-input"
            type="text"
            value={settings.seed}
            onChange={(e) => onChange({ seed: e.target.value })}
            aria-label="Magic election seed"
          />
          <button className="btn btn-secondary" onClick={copySeed}>
            {copied ? '✅ Copied!' : '📋 Copy Seed'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onChange({ seed: randomSeed() })}
          >
            🌱 Plant a New Seed
          </button>
        </div>
      </div>

      <div className="workshop-block">
        <h3>🗳️ Counting rules to compare</h3>
        <p className="muted">
          Pick the counting machines you want to try. You can also change these
          later at the Counting Machine Arcade — the ballots never change.
        </p>
        <div className="system-checks">
          {VOTING_SYSTEMS.map((sys) => (
            <label key={sys.id} className="toggle system-check">
              <input
                type="checkbox"
                checked={settings.systems.includes(sys.id)}
                onChange={(e) =>
                  onChange({
                    systems: e.target.checked
                      ? [...settings.systems, sys.id]
                      : settings.systems.filter((s) => s !== sys.id),
                  })
                }
              />
              <span>
                {sys.machineEmoji} {settings.teacherMode ? sys.teacherName : sys.kidName}
              </span>
            </label>
          ))}
        </div>
      </div>

      {settings.teacherMode && (
        <TeacherNotes>
          <p>{NONPARTISAN_NOTE}</p>
          <p>
            Tip: for a classroom demo, use the Teaching Example from the Welcome
            Gate — it guarantees that different rules choose different winners.
          </p>
        </TeacherNotes>
      )}

      {stagedChanges && (
        <p className="staged-note" role="status">
          🌱 You planted a new seed. Press the button below to grow a fresh
          election — until then, the current ballots stay exactly the same.
        </p>
      )}

      <div className="page-actions">
        <button
          className="btn btn-primary btn-big"
          onClick={() => onCreate({ ...settings })}
        >
          🎪 Open the Festival with These Settings!
        </button>
      </div>
    </section>
  );
}
