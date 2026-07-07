import type { VotingSystemInfo } from '../data/votingSystems';
import { playToggle } from '../lib/sound';

interface Props {
  info: VotingSystemInfo;
  enabled: boolean;
  teacherMode: boolean;
  onToggle: (on: boolean) => void;
  onTryDemo: () => void;
}

export default function CountingMachineCard({
  info,
  enabled,
  teacherMode,
  onToggle,
  onTryDemo,
}: Props) {
  return (
    <article className={`machine-card ${enabled ? 'is-enabled' : ''}`}>
      <div className="machine-visual" aria-hidden="true">
        <div className={`machine-body ${enabled ? 'is-on' : ''}`}>
          <span className="machine-emoji">{info.machineEmoji}</span>
          <span className="machine-light" />
        </div>
      </div>
      <h4>{info.machineName}</h4>
      <p className="machine-rule-name">
        {info.kidName}
        {teacherMode && <small> ({info.teacherName})</small>}
      </p>
      <p className="machine-metaphor">{info.metaphor}</p>
      <p className="machine-explain">{info.kidExplanation}</p>
      <p className="machine-sw">
        <span>💪 {info.strength}</span>
        <span>🤔 {info.weakness}</span>
      </p>
      <p className="machine-difficulty" aria-label={`Counting difficulty: ${info.difficulty} out of 5`}>
        How hard to count:{' '}
        <span aria-hidden="true">
          {'⭐'.repeat(info.difficulty)}
          {'▫️'.repeat(5 - info.difficulty)}
        </span>
      </p>
      {teacherMode && <p className="machine-realworld">🌍 {info.realWorld}</p>}
      <div className="machine-actions">
        <label className="toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              playToggle(e.target.checked);
              onToggle(e.target.checked);
            }}
          />
          <span>Use this rule</span>
        </label>
        <button className="btn btn-small btn-secondary" onClick={onTryDemo}>
          🔍 Try a tiny example
        </button>
      </div>
    </article>
  );
}
