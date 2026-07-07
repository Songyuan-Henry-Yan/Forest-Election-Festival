import type { Candidate, Issue, Polarization, VotingResult } from '../types/game';

const discussionQuestions = [
  'Which voting rule was easiest to understand?',
  'Which rule let voters express the most information?',
  'Which rule picked the candidate with the most first-choice fans?',
  'Which rule picked a candidate many animals could accept?',
  'Can the majority decide everything?',
  'Why does the Forest Charter matter?',
  'Why should voters check campaign promises against the budget?'
];

export function PrintSummary({ seed, polarization, voterCount, candidates, issues, results }: { seed: number; polarization: Polarization; voterCount: number; candidates: Candidate[]; issues: Issue[]; results: VotingResult[] }) {
  const candidateName = (id: string) => candidates.find((candidate) => candidate.id === id)?.name ?? id;
  return (
    <section className="print-summary" aria-label="Printable election summary">
      <h1>Animal Kingdom Election Festival Print Summary</h1>
      <p><b>Core idea:</b> Same voters. Same ballots. Different counting rules.</p>
      <h2>Settings</h2>
      <ul>
        <li>Seed: {seed}</li>
        <li>Polarization: {polarization}</li>
        <li>Voters: {voterCount}</li>
      </ul>
      <h2>Candidates</h2>
      <ul>{candidates.map((candidate) => <li key={candidate.id}>{candidate.name} the {candidate.species}: {candidate.slogan}</li>)}</ul>
      <h2>Issues</h2>
      <ul>{issues.map((issue) => <li key={issue.id}>{issue.icon} {issue.title}: {issue.question}</li>)}</ul>
      <h2>Voting systems compared</h2>
      <ul>{results.map((result) => <li key={result.systemId}>{result.systemName}</li>)}</ul>
      <h2>Winners table</h2>
      <table><thead><tr><th>Voting system</th><th>Winner or council result</th></tr></thead><tbody>{results.map((result) => <tr key={result.systemId}><td>{result.systemName}</td><td>{result.systemId === 'council' ? result.winnerIds.map((id, index) => `Seat ${index + 1}: ${candidateName(id)}`).join('; ') : result.winnerIds.map(candidateName).join(', ')}</td></tr>)}</tbody></table>
      <h2>Discussion questions</h2>
      <ol>{discussionQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
      <p><b>Nonpartisan note:</b> This game does not support any political party or real-world candidate. It uses animal stories to help students understand voting rules, public values, and tradeoffs.</p>
    </section>
  );
}

export { discussionQuestions };
