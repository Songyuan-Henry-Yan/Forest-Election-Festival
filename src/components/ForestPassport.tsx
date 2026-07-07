const stickers = [
  { step: 0, label: 'Festival Visitor', icon: '🎟️' },
  { step: 2, label: 'Issue Explorer', icon: '🍁' },
  { step: 3, label: 'Candidate Listener', icon: '👂' },
  { step: 4, label: 'News Watcher', icon: '🗞️' },
  { step: 5, label: 'Rule Tester', icon: '⚙️' },
  { step: 6, label: 'Result Detective', icon: '🔎' }
];

export function ForestPassport({ completedStep }: { completedStep: number }) {
  return (
    <aside className="passport" aria-label="Forest Passport stickers">
      <div>
        <p className="eyebrow">Forest Passport</p>
        <h2>Sticker Book</h2>
        <p>Stickers celebrate your journey. They do not change ballots or results.</p>
      </div>
      <div className="stickers">
        {stickers.map((sticker) => {
          const earned = completedStep >= sticker.step;
          return (
            <span className={`sticker ${earned ? 'earned' : 'locked'}`} key={sticker.label}>
              <span aria-hidden="true">{earned ? sticker.icon : '○'}</span>
              {sticker.label}
            </span>
          );
        })}
      </div>
    </aside>
  );
}
