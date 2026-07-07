import { useEffect, useState } from 'react';
import type { AxisId, Candidate, GameState } from '../types/game';
import AnimalAvatar from './AnimalAvatar';
import PolicyCard from './PolicyCard';
import AcornBudgetTray from './AcornBudgetTray';
import { acornBudgetFor, totalPromiseCost } from '../lib/generatePolicies';

interface Props {
  candidate: Candidate;
  game: GameState;
  onBudgetChecked: () => void;
  onCharterReminder: () => void;
}

/** Child-friendly names for each end of every value axis. */
const AXIS_WORDS: Record<AxisId, [string, string]> = {
  freedom: ['clear rules', 'free choice'],
  support: ['reward effort', 'share support'],
  change: ['keep traditions', 'try new things'],
  global: ['forest first', 'welcome neighbors'],
  nature: ['build things', 'protect nature'],
  services: ['own choices', 'shared services'],
  facts: ['big feelings', 'check the facts'],
  compromise: ['strong leader', 'team decisions'],
};

const QUESTION_CHIPS = [
  { id: 'helps', label: 'Who does this help?' },
  { id: 'cost', label: 'What does it cost?' },
  { id: 'worry', label: 'Who might worry?' },
  { id: 'facts', label: 'What facts should we check?' },
] as const;

export default function RallyCandidateCard({
  candidate,
  game,
  onBudgetChecked,
  onCharterReminder,
}: Props) {
  const [chip, setChip] = useState<string | null>(null);
  const storyMode = game.settings.ageMode === 'story';
  const cost = totalPromiseCost(candidate);
  const budget = acornBudgetFor(candidate.policies.length);
  const coversAll = candidate.policies.length >= game.issues.length;
  const hasRightsRisk = candidate.policies.some((p) => p.effects.rightsRisk > 0);

  useEffect(() => {
    setChip(null);
    if (hasRightsRisk && game.settings.charterReminders) onCharterReminder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate.id]);

  // Show the candidate's strongest value leanings as friendly bars.
  const axisEntries = (Object.entries(candidate.axes) as [AxisId, number][])
    .filter(([, v]) => v !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, storyMode ? 2 : 4);

  const chipAnswer = (id: string): string => {
    switch (id) {
      case 'helps':
        return `${candidate.name}'s promises help: ${candidate.policies
          .map((p) => p.helps)
          .join('; ')}.`;
      case 'cost':
        return `All ${candidate.policies.length} promises together would use ${cost} of the forest's ${budget} acorns.`;
      case 'worry':
        return candidate.policies.map((p) => p.concern).join('. ') + '.';
      case 'facts':
        return `Good things to check: Does the ${budget}-acorn budget cover ${cost} acorns of promises? What happened when other forests tried these ideas? What do the owl reporters say?`;
      default:
        return '';
    }
  };

  return (
    <article className="rally-card" aria-label={`Candidate ${candidate.name}`}>
      <div className="rally-card-top">
        <div className="rally-avatar" style={{ borderColor: candidate.color }}>
          <AnimalAvatar species={candidate.species} label={candidate.visual} size={110} />
        </div>
        <div className="rally-headline">
          <h3>{candidate.name}</h3>
          <p className="species-line">{candidate.species} • running for Forest President</p>
          <div className="speech-bubble" role="note">
            “{candidate.slogan}”
          </div>
          <div className="value-tags">
            {candidate.values.map((v) => (
              <span key={v} className="value-tag">{v}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="axis-bars">
        {axisEntries.map(([axis, v]) => {
          const [left, right] = AXIS_WORDS[axis];
          const pctPos = ((v + 3) / 6) * 100;
          return (
            <div key={axis} className="axis-bar-row">
              <span className="axis-word">{left}</span>
              <div
                className="axis-bar"
                role="img"
                aria-label={`${candidate.name} leans toward ${v > 0 ? right : left}`}
              >
                <span className="axis-dot" style={{ left: `${pctPos}%`, background: candidate.color }} />
              </div>
              <span className="axis-word">{right}</span>
            </div>
          );
        })}
      </div>

      <div className="strength-tradeoff">
        <p>💪 <strong>Strength:</strong> {candidate.strength}</p>
        <p>🤔 <strong>Tradeoff:</strong> {candidate.tradeoff}</p>
      </div>

      <h4 className="promises-title">
        🍂 Promise Cards ({candidate.policies.length})
        {coversAll && (
          <span className="covers-all-tag"> — a plan for every issue on the trail!</span>
        )}
      </h4>
      <div className="policy-grid">
        {candidate.policies.map((p, i) => {
          const issue = game.issues.find((it) => it.id === p.issueId);
          const decoys = candidate.policies
            .filter((other) => other.id !== p.id)
            .map((other) => other.tradeoff);
          return (
            <PolicyCard
              key={p.id}
              policy={p}
              issueTitle={issue?.title ?? 'Forest life'}
              issueEmoji={issue?.emoji ?? '🌲'}
              storyMode={storyMode}
              charterReminders={game.settings.charterReminders}
              decoyTradeoffs={decoys.length >= 2 ? decoys : [...decoys, 'The forest might run out of songs to sing.']}
              onFlipped={() => { if (i >= 0) onBudgetChecked(); }}
            />
          );
        })}
      </div>

      {game.settings.budgetLimits && <AcornBudgetTray cost={cost} budget={budget} />}

      {candidate.overPromiseRisk >= 2 && (
        <p className="owl-stamp" role="note">
          🦉 <strong>Owl Check:</strong> {candidate.name} makes big, exciting
          promises. Let’s compare them with the acorn budget before deciding.
        </p>
      )}

      <div className="question-chips">
        <strong>🙋 Ask a question:</strong>
        <div className="chip-row">
          {QUESTION_CHIPS.map((q) => (
            <button
              key={q.id}
              className={`chip ${chip === q.id ? 'is-active' : ''}`}
              onClick={() => setChip(chip === q.id ? null : q.id)}
              aria-expanded={chip === q.id}
            >
              {q.label}
            </button>
          ))}
        </div>
        {chip && (
          <p className="chip-answer" role="status">
            {chipAnswer(chip)}
          </p>
        )}
      </div>
    </article>
  );
}
