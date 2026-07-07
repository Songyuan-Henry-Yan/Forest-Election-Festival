import type { Candidate, CandidateMetrics, VotingResult } from '../types/game';
import { AnimalAvatar } from './AnimalAvatar';

function specialSummary(result: VotingResult, cname: (id: string) => string, voterCount: number) {
  if (result.systemId === 'score') {
    return <div className="result-special"><h4>Total and average stars</h4>{Object.entries(result.counts).map(([id, total]) => <p key={id}>{cname(id)}: {total} total stars, {(total / voterCount).toFixed(2)} average stars</p>)}</div>;
  }
  if (result.systemId === 'star') {
    return <div className="result-special"><h4>STAR steps</h4><p>First round: total stars choose two finalists.</p><p>Automatic runoff: each ballot supports the finalist it scored higher. Equal scores count as no preference.</p></div>;
  }
  if (result.systemId === 'twoRound') {
    return <div className="result-special"><h4>Runoff path</h4><p>Round 1 counts first choices. If nobody has more than 50%, Round 2 compares the top two finalists.</p></div>;
  }
  if (result.systemId === 'council') {
    return <div className="result-special"><h4>Seven council seats</h4><div className="seat-row">{result.winnerIds.map((id, index) => <span className="council-seat" key={`${id}-${index}`}>Seat {index + 1}: {cname(id)}</span>)}</div></div>;
  }
  return null;
}

const teacherNotes: Record<string, { formal: string; connection: string; prompt: string }> = {
  plurality: { formal: 'Single-Member Plurality', connection: 'A common choose-one rule for selecting one office holder.', prompt: 'What information is missing when only first choices count?' },
  twoRound: { formal: 'Majority Runoff / Two-Round System', connection: 'A majority-seeking rule that uses a second round between two finalists.', prompt: 'Who is left out when only the top two continue?' },
  irv: { formal: 'Instant Runoff Voting', connection: 'A ranked-ballot method that simulates runoff rounds from one ballot.', prompt: 'How do backup choices change the result?' },
  approval: { formal: 'Approval Voting', connection: 'A cardinal method where voters approve any acceptable candidates.', prompt: 'What does “acceptable” mean to different voters?' },
  score: { formal: 'Score / Range Voting', connection: 'A cardinal method where voters assign numeric ratings.', prompt: 'How should voters use the star scale fairly?' },
  star: { formal: 'Score Then Automatic Runoff', connection: 'A hybrid score-and-runoff method.', prompt: 'Why might a runoff between score finalists matter?' },
  borda: { formal: 'Borda Count Positional Voting', connection: 'A ranked positional rule that awards points by rank.', prompt: 'Should every ranking position add points?' },
  condorcet: { formal: 'Condorcet Method with Copeland Fallback', connection: 'A pairwise comparison family of methods.', prompt: 'What does it mean to beat every opponent one-on-one?' },
  council: { formal: 'D’Hondt Highest Averages Proportional Allocation', connection: 'A proportional representation approach for multi-seat councils.', prompt: 'How is choosing a council different from choosing one leader?' }
};

export function ResultsDashboard({ results, candidates, metrics, teacher = false }: { results: VotingResult[]; candidates: Candidate[]; metrics: CandidateMetrics[]; teacher?: boolean }) {
  const cname = (id: string) => candidates.find((c) => c.id === id)?.name ?? id;
  const candidate = (id: string) => candidates.find((c) => c.id === id);
  const unique = [...new Set(results.filter((r) => r.systemId !== 'council').flatMap((r) => r.winnerIds))];
  const voterCount = metrics.reduce((max, metric) => Math.max(max, metric.firstChoices), 0) || 1;
  const totalVoters = metrics.reduce((sum, metric) => sum + metric.firstChoices, 0) || voterCount;
  return (
    <section className="panel theater-panel">
      <p className="eyebrow">Counting Theater</p>
      <h2>Results</h2>
      <div className="theater-stage">
        <div className="ballot-stack" aria-label="One shared stack of leaf ballots">
          <span>🍃</span><span>🍃</span><span>🍃</span>
          <b>One shared stack of ballots</b>
        </div>
        <div className="machine-row" aria-label="Different counting machines">
          <span>🧺</span><span>🌉</span><span>🍂</span><span>😊</span><span>⭐</span><span>🌟</span><span>🪜</span><span>🤝</span><span>🌳</span>
        </div>
      </div>
      <h3 className="same-ballots">Same voters. Same ballots. Different counting rules.</h3>
      <p className="notice">{unique.length > 1 ? 'Look what happened! The voters stayed the same, and the ballots stayed the same, but different voting rules chose different winners.' : 'This time, many rules agreed on the same winner. Try changing the settings to see if the results change.'}</p>
      <h3>Winner Badge Wall</h3>
      <div className="badge-wall">
        {results.map((result) => (
          <div className="winner-badge" key={result.systemId}>
            <span aria-hidden="true">{result.systemId === 'council' ? '🌳' : '🏵️'}</span>
            <b>{result.systemName}</b>
            <span>{result.systemId === 'council' ? 'Seven-seat council' : result.winnerIds.map(cname).join(', ')}</span>
          </div>
        ))}
      </div>
      <div className="grid">
        {results.map((r) => <article className="card" key={r.systemId}><h3>{r.systemName}</h3><p className="winner">{r.systemId === 'council' ? 'Council seats assigned below' : `Winner: ${r.winnerIds.map(cname).join(', ')}`}</p><p>{r.explanationForKids}</p>{teacher && <div className="teacher"><p><b>Formal name:</b> {teacherNotes[r.systemId]?.formal ?? r.systemName}</p><p><b>Real-world connection:</b> {teacherNotes[r.systemId]?.connection}</p><p><b>Longer strengths:</b> {r.strengths.join('; ')}. This helps the class name what the rule values.</p><p><b>Longer weaknesses:</b> {r.weaknesses.join('; ')}. This helps the class notice tradeoffs.</p><p><b>Classroom prompt:</b> {teacherNotes[r.systemId]?.prompt}</p></div>}{specialSummary(r, cname, totalVoters)}<details><summary>Round-by-round details</summary>{r.rounds.map((rd, i) => <div key={i}><b>{rd.label}</b><p>{rd.details}</p>{rd.tallies && <pre>{JSON.stringify(Object.fromEntries(Object.entries(rd.tallies).map(([k, v]) => [cname(k), v])), null, 2)}</pre>}</div>)}<p>{r.tieBreakInfo}</p><p>Strengths: {r.strengths.join('; ')}</p><p>Weaknesses: {r.weaknesses.join('; ')}</p></details></article>)}
      </div>
      <h3>Winner comparison table</h3>
      <table><thead><tr><th>Voting system</th><th>Winner or council result</th></tr></thead><tbody>{results.map((r) => <tr key={r.systemId}><td>{r.systemName}</td><td>{r.systemId === 'council' ? r.winnerIds.map((id, index) => `Seat ${index + 1}: ${cname(id)}`).join('; ') : r.winnerIds.map(cname).join(', ')}</td></tr>)}</tbody></table>
      <h3>Candidate metric cards</h3>
      <div className="grid">{metrics.map((m) => { const c = candidate(m.candidateId)!; return <article className="card candidate" key={m.candidateId}><AnimalAvatar candidate={c} /><h4>{c.name}</h4><p>Favorite fans: {m.firstChoices}</p><p>Animals who say this candidate is okay: {Math.round(m.approvalRate * 100)}%</p><p>Average stars: {m.averageScore.toFixed(1)} / 5</p><p>Friendly matchup wins: {m.pairwiseWins}</p><p>Very unhappy voters: {m.veryUnhappy}</p></article>; })}</div>
    </section>
  );
}
