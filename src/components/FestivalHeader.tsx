interface Props {
  teacherMode: boolean;
  onToggleTeacher: (on: boolean) => void;
  onOpenCharter: () => void;
  onOpenPassport: () => void;
  charterGlow: boolean;
  stickerCount: number;
  sfxOn: boolean;
  musicOn: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
}

export default function FestivalHeader({
  teacherMode,
  onToggleTeacher,
  onOpenCharter,
  onOpenPassport,
  charterGlow,
  stickerCount,
  sfxOn,
  musicOn,
  onToggleSfx,
  onToggleMusic,
}: Props) {
  return (
    <header className="header">
      <div className="header-title">
        <span className="header-lantern" aria-hidden="true">🏮</span>
        <div>
          <h1>Animal Kingdom Election Festival</h1>
          <p className="header-tagline">
            Same voters. Same ballots. Different voting rules.
          </p>
        </div>
      </div>
      <div className="header-actions">
        <button
          className="btn btn-wood btn-sound"
          onClick={onToggleSfx}
          aria-pressed={sfxOn}
          title={sfxOn ? 'Turn sound effects off' : 'Turn sound effects on'}
        >
          {sfxOn ? '🔊' : '🔇'}
          <span className="sound-label"> Sounds {sfxOn ? 'on' : 'off'}</span>
        </button>
        <button
          className="btn btn-wood btn-sound"
          onClick={onToggleMusic}
          aria-pressed={musicOn}
          title={musicOn ? 'Turn forest music off' : 'Turn forest music on'}
        >
          {musicOn ? '🎵' : '🎵🚫'}
          <span className="sound-label"> Music {musicOn ? 'on' : 'off'}</span>
        </button>
        <button
          className={`btn btn-wood ${charterGlow ? 'charter-glow' : ''}`}
          onClick={onOpenCharter}
        >
          📜 Forest Charter
          {charterGlow && (
            <span className="firefly" aria-label="(a reminder is waiting)">✨</span>
          )}
        </button>
        <button className="btn btn-wood" onClick={onOpenPassport}>
          🎟️ Passport <span className="badge-count">{stickerCount}</span>
        </button>
        <label className="teacher-toggle">
          <input
            type="checkbox"
            checked={teacherMode}
            onChange={(e) => onToggleTeacher(e.target.checked)}
          />
          <span>🍎 Teacher Mode</span>
        </label>
      </div>
    </header>
  );
}
