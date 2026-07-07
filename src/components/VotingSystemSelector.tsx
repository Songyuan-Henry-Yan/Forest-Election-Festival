const machines = [
  { id: 'plurality', label: 'Choose-One / Plurality', machine: 'Acorn Basket Machine', icon: '🧺', explain: 'Drop one acorn for your favorite candidate.', strength: 'Very easy to count.', weakness: 'Backup choices stay hidden.', difficulty: 1 },
  { id: 'twoRound', label: 'Two-Round Runoff', machine: 'Two Bridge Machine', icon: '🌉', explain: 'If nobody has more than half, the top two cross the final bridge.', strength: 'Shows a majority runoff between finalists.', weakness: 'Only two finalists remain in the last round.', difficulty: 2 },
  { id: 'irv', label: 'Ranked Choice Voting / Instant Runoff Voting', machine: 'Leaf Transfer Machine', icon: '🍂', explain: 'Leaves move to next choices when a candidate is out.', strength: 'Uses backup choices.', weakness: 'Takes rounds to explain.', difficulty: 3 },
  { id: 'approval', label: 'Approval Voting', machine: 'Smile Sticker Machine', icon: '😊', explain: 'Give a smile sticker to every candidate who seems okay.', strength: 'Lets voters support more than one.', weakness: 'Does not show exact order.', difficulty: 2 },
  { id: 'score', label: 'Score Voting', machine: 'Star Jar Machine', icon: '⭐', explain: 'Pour 0 to 5 stars into each candidate’s jar.', strength: 'Shows how strongly voters feel.', weakness: 'Voters may use stars differently.', difficulty: 2 },
  { id: 'star', label: 'STAR Voting', machine: 'Star + Bridge Machine', icon: '🌟', explain: 'Stars choose two finalists, then ballots cross to the preferred finalist.', strength: 'Combines scores with a runoff.', weakness: 'Has two counting steps.', difficulty: 4 },
  { id: 'borda', label: 'Borda Count', machine: 'Ranking Ladder Machine', icon: '🪜', explain: 'Higher ladder steps earn more points.', strength: 'Uses every ranking spot.', weakness: 'Point math can feel abstract.', difficulty: 3 },
  { id: 'condorcet', label: 'Condorcet Matchups with Copeland fallback', machine: 'Friendly Matchup Arena', icon: '🤝', explain: 'Compare candidates two at a time like friendly games.', strength: 'Finds a candidate who beats others head-to-head when one exists.', weakness: 'There are many matchups.', difficulty: 4 },
  { id: 'council', label: 'Proportional Forest Council', machine: 'Council Tree Machine', icon: '🌳', explain: 'First-choice votes grow seven council seats with D’Hondt allocation.', strength: 'Can represent several groups.', weakness: 'It is not a single-president winner.', difficulty: 4 }
];

export function VotingSystemSelector({ selected, setSelected, teacher = false }: { selected: string[]; setSelected: (s: string[]) => void; teacher?: boolean }) {
  const toggle = (id: string, checked: boolean) => setSelected(checked ? [...selected, id] : selected.filter((x) => x !== id));
  return (
    <section className="panel arcade-panel">
      <p className="eyebrow">Counting Machine Arcade</p>
      <h2>Choose the counting machines</h2>
      <p>These switches only choose which rules to display. They do not make new ballots.</p>
      <div className="machine-grid">
        {machines.map((machine) => (
          <article className="machine-card" key={machine.id}>
            <div className="machine-marquee"><span aria-hidden="true">{machine.icon}</span><b>{machine.machine}</b></div>
            <h3>{machine.label}</h3>
            <p>{machine.explain}</p>
            <p><b>Strength:</b> {machine.strength}</p>
            <p><b>Weakness:</b> {machine.weakness}</p>
            <p aria-label={`${machine.difficulty} out of 5 difficulty stars`}>Difficulty: {'★'.repeat(machine.difficulty)}{'☆'.repeat(5 - machine.difficulty)}</p>
            {teacher && <div className="teacher"><b>Real-world connection:</b> This formal voting-system model helps students compare ballot design, counting rules, majority tests, consensus, proportional representation, and tradeoffs without discussing real parties or current elections.</div>}
            <label className="toggle-line">
              <input type="checkbox" checked={selected.includes(machine.id)} onChange={(e: any) => toggle(machine.id, e.target.checked)} />
              Use this rule
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}
