import type { Candidate, CandidateMetrics, ElectionResult } from '../types/game';
import { systemInfo } from '../data/votingSystems';
import { whyWon, WHY_WON } from './WinnerBadgeWall';

interface Props {
  results: ElectionResult[];
  candidates: Candidate[];
  metrics: CandidateMetrics[];
  teacherMode: boolean;
}

export default function ResultComparisonTable({
  results,
  candidates,
  metrics,
  teacherMode,
}: Props) {
  const metric = (id: string) => metrics.find((m) => m.candidateId === id);

  return (
    <div className="table-wrap">
      <table className="compare-table">
        <caption>Winner comparison across counting rules</caption>
        <thead>
          <tr>
            <th scope="col">Voting rule</th>
            <th scope="col">Winner</th>
            <th scope="col">Why this winner won</th>
            <th scope="col">💖 Favorite fans</th>
            <th scope="col">😊 Approval</th>
            <th scope="col">⭐ Avg stars</th>
            <th scope="col">Count difficulty</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const info = systemInfo(r.systemId);
            const isCouncil = r.systemId === 'council';
            const winner = candidates.find((c) => c.id === r.winnerIds[0]);
            const m = winner ? metric(winner.id) : undefined;
            return (
              <tr key={r.systemId}>
                <th scope="row">
                  {info.machineEmoji} {teacherMode ? info.teacherName : info.kidName}
                </th>
                <td>{isCouncil ? r.winnerLabel : winner?.name}</td>
                <td className="why-cell">
                  {isCouncil ? WHY_WON.council : `${whyWon(r)}`}
                </td>
                <td>{isCouncil || !m ? '—' : `${Math.round(m.firstChoicePct)}%`}</td>
                <td>{isCouncil || !m ? '—' : `${Math.round(m.approvalPct)}%`}</td>
                <td>{isCouncil || !m ? '—' : m.avgScore.toFixed(1)}</td>
                <td aria-label={`${info.difficulty} out of 5`}>{'⭐'.repeat(info.difficulty)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
