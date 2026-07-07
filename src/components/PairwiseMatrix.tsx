import type { Candidate, ElectionResult } from '../types/game';

interface Props {
  result: ElectionResult;
  candidates: Candidate[];
}

export default function PairwiseMatrix({ result, candidates }: Props) {
  if (!result.pairwise) return null;
  const pw = result.pairwise;
  return (
    <div className="matrix-wrap">
      <table className="pairwise-matrix">
        <caption>
          Friendly matchup grid: each cell shows how many voters preferred the
          row animal over the column animal. ✔ = the row animal wins that
          matchup.
        </caption>
        <thead>
          <tr>
            <th scope="col">vs →</th>
            {candidates.map((c) => (
              <th key={c.id} scope="col">{c.name.split(' ')[0]}</th>
            ))}
            <th scope="col">Wins</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((row) => {
            const wins = candidates.filter(
              (col) => col.id !== row.id && pw[row.id][col.id] > pw[col.id][row.id],
            ).length;
            return (
              <tr key={row.id}>
                <th scope="row">{row.name.split(' ')[0]}</th>
                {candidates.map((col) => {
                  if (col.id === row.id) return <td key={col.id} className="matrix-self">—</td>;
                  const a = pw[row.id][col.id];
                  const b = pw[col.id][row.id];
                  const win = a > b;
                  const tie = a === b;
                  return (
                    <td
                      key={col.id}
                      className={win ? 'matrix-win' : tie ? 'matrix-tie' : 'matrix-loss'}
                    >
                      {a}–{b} {win ? '✔' : tie ? '=' : ''}
                    </td>
                  );
                })}
                <td className="matrix-total">{wins}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
