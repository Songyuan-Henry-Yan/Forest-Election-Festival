import type { Candidate, ElectionResult } from '../types/game';
import { systemInfo } from '../data/votingSystems';
import PairwiseMatrix from './PairwiseMatrix';
import CouncilSeats from './CouncilSeats';

interface Props {
  results: ElectionResult[];
  candidates: Candidate[];
  teacherMode: boolean;
}

export default function AnimatedRoundsAccordion({
  results,
  candidates,
  teacherMode,
}: Props) {
  const name = (id: string) => candidates.find((c) => c.id === id);

  return (
    <div className="rounds-accordion">
      <h3>🎬 How each machine counted, step by step</h3>
      {results.map((r) => {
        const info = systemInfo(r.systemId);
        return (
          <details key={r.systemId} className="rounds-details">
            <summary>
              <span className="rounds-summary-name">
                {info.machineEmoji} {teacherMode ? info.teacherName : info.kidName}
              </span>
              <span className="rounds-summary-winner">🏆 {r.winnerLabel}</span>
            </summary>
            <p className="muted">{r.explanationForKids}</p>
            {r.rounds.map((round, i) => {
              const maxVal = Math.max(1, ...round.counts.map((c) => c.value));
              return (
                <div key={i} className="round-block">
                  <strong>{round.title}</strong>
                  <p>{round.description}</p>
                  <div className="round-bars">
                    {round.counts.map((c) => {
                      const cand = name(c.candidateId);
                      return (
                        <div key={c.candidateId} className={`round-bar-row ${c.eliminated ? 'is-eliminated' : ''}`}>
                          <span className="round-bar-name">
                            {cand?.name ?? c.candidateId}
                            {c.eliminated ? ' ❌' : ''}
                          </span>
                          <div className="round-bar-track">
                            <div
                              className="round-bar-fill"
                              style={{
                                width: `${(c.value / maxVal) * 100}%`,
                                background: cand?.color ?? 'var(--forest)',
                              }}
                            />
                          </div>
                          <span className="round-bar-value">
                            {Math.round(c.value * 10) / 10}
                            {c.pct !== undefined && ` (${Math.round(c.pct)}%)`}
                            {c.note ? ` • ${c.note}` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {r.systemId === 'condorcet' && (
              <>
                {r.copelandFallback && (
                  <p className="tie-note" role="note">
                    🔄 No single animal beat every other animal one-on-one.
                    This is called a <strong>cycle</strong>. The forest used the
                    Copeland fallback score instead.
                  </p>
                )}
                <PairwiseMatrix result={r} candidates={candidates} />
              </>
            )}
            {r.systemId === 'council' && (
              <CouncilSeats result={r} candidates={candidates} />
            )}
            {r.tieBreakInfo && <p className="tie-note" role="note">🎗️ {r.tieBreakInfo}</p>}
            {teacherMode && (
              <p className="machine-realworld">🌍 Real-world connection: {info.realWorld}</p>
            )}
          </details>
        );
      })}
    </div>
  );
}
