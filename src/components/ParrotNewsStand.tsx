import { useState } from 'react';
import type { GameState } from '../types/game';
import ParrotBroadcastCard from './ParrotBroadcastCard';
import { playNews } from '../lib/sound';

interface Props {
  game: GameState;
  onAllDrawn: () => void;
  onNext: () => void;
}

export default function ParrotNewsStand({ game, onAllDrawn, onNext }: Props) {
  const [revealed, setRevealed] = useState(0);
  const total = game.drawnEvents.length;

  const draw = () => {
    playNews();
    const next = revealed + 1;
    setRevealed(next);
    if (next >= total) onAllDrawn();
  };

  return (
    <section>
      <h2>🦜 Parrot News Stand</h2>
      <p className="page-intro">
        Polly the Parrot broadcasts the forest news. Big events can change what
        voters care about — <strong>before</strong> they fill out their ballots.
      </p>

      <div className="news-stand">
        <div className="parrot-perch" aria-hidden="true">
          <span className="parrot">🦜</span>
          <div className="stand-roof" />
        </div>
        {total === 0 ? (
          <p className="muted">
            A quiet week in the forest — no big news this election.
          </p>
        ) : (
          <>
            <div className="news-deck">
              {revealed < total && (
                <button className="btn btn-primary btn-big draw-btn" onClick={draw}>
                  📰 Draw Today’s Forest News ({revealed}/{total} drawn)
                </button>
              )}
              {revealed >= total && (
                <p className="news-done" role="status">
                  ✅ That’s all of this election’s news! These stories already
                  shaped how voters filled out their ballots.
                </p>
              )}
            </div>
            <div className="news-grid">
              {game.drawnEvents.slice(0, revealed).map((d, i) => (
                <ParrotBroadcastCard key={d.event.id} drawn={d} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="page-actions">
        <button className="btn btn-primary btn-big" onClick={onNext} disabled={revealed < total}>
          {revealed < total ? 'Draw all the news first!' : 'Head to the Counting Arcade →'}
        </button>
      </div>
    </section>
  );
}
