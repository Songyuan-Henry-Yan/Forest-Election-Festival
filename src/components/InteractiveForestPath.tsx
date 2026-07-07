import type { FestivalStep } from '../types/game';

interface Stop {
  id: FestivalStep;
  label: string;
  emoji: string;
}

const STOPS: Stop[] = [
  { id: 'welcome', label: 'Welcome Gate', emoji: '🚪' },
  { id: 'setup', label: 'Election Workshop', emoji: '🛠️' },
  { id: 'issues', label: 'Issue Trail', emoji: '🍃' },
  { id: 'candidates', label: 'Rally Stage', emoji: '🎤' },
  { id: 'events', label: 'Parrot News Stand', emoji: '🦜' },
  { id: 'systems', label: 'Counting Arcade', emoji: '🗳️' },
  { id: 'results', label: 'Counting Theater', emoji: '🎭' },
  { id: 'reflection', label: 'Campfire Circle', emoji: '🔥' },
];

interface Props {
  current: FestivalStep;
  hasGame: boolean;
  eventsOpen: boolean;
  completed: string[];
  onGo: (s: FestivalStep) => void;
}

export default function InteractiveForestPath({
  current,
  hasGame,
  eventsOpen,
  onGo,
}: Props) {
  return (
    <nav className="forest-path" aria-label="Festival path">
      <ol>
        {STOPS.map((stop, i) => {
          const needsGame = !['welcome', 'setup', 'reflection'].includes(stop.id);
          const closed = stop.id === 'events' && !eventsOpen;
          const locked = (needsGame && !hasGame) || closed;
          const isCurrent = current === stop.id;
          return (
            <li key={stop.id}>
              {i > 0 && <span className="path-arrow" aria-hidden="true">→</span>}
              <button
                className={`path-stop ${isCurrent ? 'is-current' : ''} ${locked ? 'is-locked' : ''}`}
                onClick={() => !locked && onGo(stop.id)}
                disabled={locked}
                aria-current={isCurrent ? 'step' : undefined}
                title={
                  closed
                    ? 'The News Stand is closed (campaign events are off).'
                    : locked
                      ? 'Start an election first!'
                      : stop.label
                }
              >
                <span className="path-emoji" aria-hidden="true">{stop.emoji}</span>
                <span className="path-label">{stop.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
