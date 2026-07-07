import { useState } from 'react';
import type { VotingSystemId } from '../types/game';
import { VOTING_SYSTEMS } from '../data/votingSystems';
import CountingMachineCard from './CountingMachineCard';
import TinyRuleDemo from './TinyRuleDemo';
import { playFanfare, playToggle } from '../lib/sound';

interface Props {
  selected: VotingSystemId[];
  teacherMode: boolean;
  onToggle: (id: VotingSystemId, on: boolean) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onDemoRun: () => void;
}

export default function CountingMachineArcade({
  selected,
  teacherMode,
  onToggle,
  onSelectAll,
  onClearAll,
  onDemoRun,
}: Props) {
  const [demo, setDemo] = useState<VotingSystemId | null>(null);
  const allOn = selected.length === VOTING_SYSTEMS.length;

  return (
    <div className="arcade">
      <h3>🎪 Counting Machine Arcade</h3>
      <p className="muted">
        Every machine counts the <strong>same stack of leaf ballots</strong> in
        its own way. Try a tiny example on any machine, and switch machines on
        and off — the ballots never change.
      </p>
      <div className="arcade-actions">
        <button
          className="btn btn-secondary"
          onClick={() => {
            playFanfare();
            onSelectAll();
          }}
          disabled={allOn}
        >
          {allOn ? '✅ All 9 machines are on!' : '⚡ Turn on all 9 machines'}
        </button>
        {selected.length > 0 && (
          <button
            className="btn btn-small"
            onClick={() => {
              playToggle(false);
              onClearAll();
            }}
          >
            Turn all off
          </button>
        )}
      </div>
      <div className="machine-grid">
        {VOTING_SYSTEMS.map((info) => (
          <CountingMachineCard
            key={info.id}
            info={info}
            enabled={selected.includes(info.id)}
            teacherMode={teacherMode}
            onToggle={(on) => onToggle(info.id, on)}
            onTryDemo={() => {
              setDemo(info.id);
              onDemoRun();
            }}
          />
        ))}
      </div>
      {demo && <TinyRuleDemo systemId={demo} onClose={() => setDemo(null)} />}
    </div>
  );
}
