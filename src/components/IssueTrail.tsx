import { useRef, useState } from 'react';
import type { GameState } from '../types/game';
import FlipLeafIssueCard from './FlipLeafIssueCard';

interface Props {
  game: GameState;
  teacherMode: boolean;
  onExplored: () => void;
  onNext: () => void;
}

export default function IssueTrail({ game, teacherMode, onExplored, onNext }: Props) {
  const [focus, setFocus] = useState<string[]>([]);
  const flipped = useRef(new Set<string>());
  const storyMode = game.settings.ageMode === 'story';

  const handleFlip = (id: string) => {
    flipped.current.add(id);
    if (flipped.current.size >= Math.min(3, game.issues.length)) onExplored();
  };

  const toggleFocus = (id: string) =>
    setFocus((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : f.length < 3 ? [...f, id] : f,
    );

  return (
    <section>
      <h2>🍃 Issue Trail</h2>
      <p className="page-intro">
        {storyMode
          ? 'The forest is talking about these big questions. Tap a leaf to peek at each one!'
          : 'These are the questions the forest is talking about this election. Flip each leaf to read the story behind it.'}
      </p>
      <p className="focus-note">
        🌟 You may place up to <strong>3 Focus Leaves</strong> on the issues
        that matter most to <em>you</em> ({focus.length}/3 placed). Focus Leaves
        are just for your own thinking — they never change the ballots.
      </p>
      <div className="leaf-grid">
        {game.issues.map((issue) => (
          <FlipLeafIssueCard
            key={issue.id}
            issue={issue}
            groups={game.voterGroups}
            teacherMode={teacherMode}
            storyMode={storyMode}
            weight={game.issueWeights[issue.id] ?? 1}
            focused={focus.includes(issue.id)}
            canFocus={focus.length < 3}
            onFlip={() => handleFlip(issue.id)}
            onToggleFocus={() => toggleFocus(issue.id)}
          />
        ))}
      </div>
      <div className="page-actions">
        <button className="btn btn-primary btn-big" onClick={onNext}>
          Walk to the Rally Stage →
        </button>
      </div>
    </section>
  );
}
