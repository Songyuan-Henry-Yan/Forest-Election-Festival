import type { Candidate, CandidateMetrics, ElectionResult } from '../types/game';
import { systemInfo } from '../data/votingSystems';
import AnimalAvatar from './AnimalAvatar';

interface Props {
  results: ElectionResult[];
  candidates: Candidate[];
  metrics: CandidateMetrics[];
  teacherMode: boolean;
}

export const WHY_WON: Record<string, string> = {
  plurality: 'had the most favorite fans (first-choice votes)',
  runoff: 'won the final two-candidate round',
  irv: 'picked up support as other candidates were eliminated',
  approval: 'was okay for the most animals',
  score: 'collected the most stars overall',
  star: 'had strong stars and won the automatic final round',
  borda: 'was ranked high by many, many voters',
  condorcet: 'beat every other animal one-on-one',
  condorcetFallback: 'won the most one-on-one matchups (Copeland fallback)',
  council: 'seats were shared among groups in proportion to support',
};

export function whyWon(r: ElectionResult): string {
  if (r.systemId === 'condorcet' && r.copelandFallback) return WHY_WON.condorcetFallback;
  return WHY_WON[r.systemId];
}

export default function WinnerBadgeWall({ results, candidates, metrics, teacherMode }: Props) {
  const cand = (id: string) => candidates.find((c) => c.id === id);
  const metric = (id: string) => metrics.find((m) => m.candidateId === id);

  return (
    <div className="badge-wall">
      {results.map((r) => {
        const info = systemInfo(r.systemId);
        const isCouncil = r.systemId === 'council';
        const winner = cand(r.winnerIds[0]);
        const m = winner ? metric(winner.id) : undefined;
        return (
          <article key={r.systemId} className="winner-badge-card">
            <header>
              <span className="machine-emoji-small" aria-hidden="true">{info.machineEmoji}</span>
              <strong>{teacherMode ? info.teacherName : info.kidName}</strong>
            </header>
            {isCouncil ? (
              <div className="winner-council">
                <div className="winner-avatars">
                  {r.winnerIds.slice(0, 7).map((id, i) => {
                    const c = cand(id);
                    return c ? (
                      <span key={`${id}-${i}`} className="winner-avatar-chip" style={{ borderColor: c.color }}>
                        <AnimalAvatar species={c.species} label={c.name} size={34} />
                      </span>
                    ) : null;
                  })}
                </div>
                <p className="winner-name">Council: {r.winnerLabel}</p>
              </div>
            ) : (
              winner && (
                <div className="winner-block">
                  <div className="winner-ribbon" aria-hidden="true">🎀</div>
                  <AnimalAvatar species={winner.species} label={winner.visual} size={72} />
                  <p className="winner-name">{winner.name}</p>
                </div>
              )
            )}
            <p className="winner-why">
              <strong>Why:</strong> {isCouncil ? WHY_WON.council : `${winner?.name ?? 'The winner'} ${whyWon(r)}.`}
            </p>
            {!isCouncil && m && (
              <ul className="winner-stats">
                <li title="Percent of voters who ranked this candidate first">
                  💖 Favorite fans: <strong>{Math.round(m.firstChoicePct)}%</strong>
                </li>
                <li title="Percent of voters who said this candidate is okay">
                  😊 Say “okay”: <strong>{Math.round(m.approvalPct)}%</strong>
                </li>
                <li title="Average stars from 0 to 5">
                  ⭐ Average stars: <strong>{m.avgScore.toFixed(1)}</strong>
                </li>
              </ul>
            )}
            <p className="winner-difficulty">
              How hard to count: {'⭐'.repeat(info.difficulty)}
              <span className="sr-only">{info.difficulty} out of 5</span>
            </p>
            {r.tieBreakInfo && <p className="tie-note">🎗️ {r.tieBreakInfo}</p>}
          </article>
        );
      })}
    </div>
  );
}
