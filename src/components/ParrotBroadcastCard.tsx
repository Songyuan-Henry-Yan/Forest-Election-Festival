import type { DrawnEvent } from '../types/game';

interface Props {
  drawn: DrawnEvent;
  index: number;
}

export default function ParrotBroadcastCard({ drawn, index }: Props) {
  const { event, changes } = drawn;
  return (
    <article className="news-card" aria-label={`Forest news: ${event.title}`}>
      <header className="news-card-head">
        <span className="news-emoji" aria-hidden="true">{event.emoji}</span>
        <div>
          <small className="news-kicker">Forest News • Day {index + 1}</small>
          <h4>{event.title}</h4>
        </div>
      </header>
      <p className="news-text">{event.text}</p>
      <div className="news-changes">
        <strong>📊 What changed?</strong>
        {changes.length === 0 ? (
          <p className="muted">The forest listened, but nothing measurable changed.</p>
        ) : (
          <ul>
            {changes.map((ch, i) => (
              <li key={i}>
                {ch.label}
                {ch.before !== undefined && ch.after !== undefined && (
                  <span className="change-meter">
                    {' '}
                    <span className="meter-before">{Math.round(ch.before * 100)}%</span>
                    {' → '}
                    <strong className="meter-after">{Math.round(ch.after * 100)}%</strong>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="news-explain">🦜 {event.explanation}</p>
    </article>
  );
}
