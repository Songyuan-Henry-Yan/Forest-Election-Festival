import { useRef, useState } from 'react';
import type { GameState } from '../types/game';
import AnimalAvatar from './AnimalAvatar';
import RallyCandidateCard from './RallyCandidateCard';
import TeacherNotes from './TeacherNotes';

interface Props {
  game: GameState;
  teacherMode: boolean;
  onListened: () => void;
  onBudgetChecked: () => void;
  onCharterReminder: () => void;
  onNext: () => void;
}

export default function RallyStage({
  game,
  teacherMode,
  onListened,
  onBudgetChecked,
  onCharterReminder,
  onNext,
}: Props) {
  const [selectedId, setSelectedId] = useState<string>(game.candidates[0]?.id ?? '');
  const listened = useRef(new Set<string>([game.candidates[0]?.id ?? '']));
  const selected = game.candidates.find((c) => c.id === selectedId) ?? game.candidates[0];

  const choose = (id: string) => {
    setSelectedId(id);
    listened.current.add(id);
    if (listened.current.size >= Math.min(2, game.candidates.length)) onListened();
  };

  return (
    <section>
      <h2>🎤 Candidate Rally Stage</h2>
      <p className="page-intro">
        Every candidate gets a turn on the wooden stage. Tap an animal to hear
        their speech and flip through their promise cards.
      </p>

      <div className="stage" role="tablist" aria-label="Candidates on stage">
        <div className="stage-curtain" aria-hidden="true" />
        <div className="stage-row">
          {game.candidates.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={selectedId === c.id}
              className={`stage-badge ${selectedId === c.id ? 'is-selected' : ''}`}
              style={{ borderColor: c.color }}
              onClick={() => choose(c.id)}
            >
              <AnimalAvatar species={c.species} label={c.visual} size={56} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
        <div className="stage-floor" aria-hidden="true" />
      </div>

      {selected && (
        <RallyCandidateCard
          candidate={selected}
          game={game}
          onBudgetChecked={onBudgetChecked}
          onCharterReminder={onCharterReminder}
        />
      )}

      {teacherMode && (
        <TeacherNotes>
          <p>
            Each candidate’s platform is generated from internal value axes
            (e.g., freedom vs. rules, building vs. environment). Ask students:
            which promises would <em>they</em> fact-check first, and what would
            each promise cost the shared budget?
          </p>
        </TeacherNotes>
      )}

      <div className="page-actions">
        <button className="btn btn-primary btn-big" onClick={onNext}>
          {game.settings.campaignEvents
            ? 'Visit the Parrot News Stand →'
            : 'Head to the Counting Arcade →'}
        </button>
      </div>
    </section>
  );
}
