import type { Candidate, CandidateMetrics } from '../types/game';
import AnimalAvatar from './AnimalAvatar';

interface Props {
  candidate: Candidate;
  metrics: CandidateMetrics;
  totalCandidates: number;
  teacherMode: boolean;
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="metric-bar">
      <div className="metric-bar-fill" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
    </div>
  );
}

export default function CandidateMetricCard({
  candidate,
  metrics,
  totalCandidates,
  teacherMode,
}: Props) {
  return (
    <article className="metric-card" style={{ borderTopColor: candidate.color }}>
      <header className="metric-card-head">
        <AnimalAvatar species={candidate.species} label={candidate.visual} size={52} />
        <strong>{candidate.name}</strong>
      </header>
      <dl className="metric-list">
        <div>
          <dt title={teacherMode ? 'First-choice support' : undefined}>💖 Favorite fans</dt>
          <dd>
            <Bar pct={metrics.firstChoicePct} color={candidate.color} />
            {Math.round(metrics.firstChoicePct)}%
          </dd>
        </div>
        <div>
          <dt title={teacherMode ? 'Approval rate' : undefined}>😊 Say “this candidate is okay”</dt>
          <dd>
            <Bar pct={metrics.approvalPct} color={candidate.color} />
            {Math.round(metrics.approvalPct)}%
          </dd>
        </div>
        <div>
          <dt title={teacherMode ? 'Average 0–5 score' : undefined}>⭐ Average stars</dt>
          <dd>
            <Bar pct={(metrics.avgScore / 5) * 100} color={candidate.color} />
            {metrics.avgScore.toFixed(1)} / 5
          </dd>
        </div>
        <div>
          <dt title={teacherMode ? 'Pairwise (Condorcet) wins' : undefined}>🤝 Friendly matchup wins</dt>
          <dd>
            <Bar pct={(metrics.pairwiseWins / Math.max(1, totalCandidates - 1)) * 100} color={candidate.color} />
            {metrics.pairwiseWins} of {totalCandidates - 1}
          </dd>
        </div>
        <div>
          <dt title={teacherMode ? 'Share of voters scoring 0–1 or ranking last' : undefined}>😾 Very unhappy voters</dt>
          <dd>
            <Bar pct={metrics.minorityDissatisfactionPct} color="#B0A79A" />
            {Math.round(metrics.minorityDissatisfactionPct)}%
          </dd>
        </div>
      </dl>
    </article>
  );
}
