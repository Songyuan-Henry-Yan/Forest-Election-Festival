const CHARTER_RULES = [
  'No animal can be banned from school just because of what kind of animal they are.',
  'No group of animals can have all of their snacks taken away.',
  'Candidates cannot threaten voters.',
  'Ballots should be private.',
  'The voting rule must be explained before the election.',
  'News animals can share opinions, but facts should be checked.',
  'A candidate who loses can try again next time.',
  'The majority can make choices, but it cannot erase basic safety for smaller groups.',
];

interface Props {
  onClose: () => void;
}

export default function CharterPanel({ onClose }: Props) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="The Forest Charter">
      <div className="modal charter-scroll">
        <div className="modal-head">
          <h2>📜 The Forest Charter</h2>
          <button className="btn btn-small" onClick={onClose} aria-label="Close charter">✕ Close</button>
        </div>
        <p className="charter-intro">In our forest democracy:</p>
        <ol className="charter-list">
          {CHARTER_RULES.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ol>
        <p className="charter-note">
          🦉 Democracy is more than counting votes. It also needs fair rules,
          private ballots, honest facts, a peaceful handshake after the count,
          and care for smaller groups.
        </p>
      </div>
    </div>
  );
}

export function CharterReminder() {
  return (
    <div className="charter-reminder" role="note">
      <span aria-hidden="true">📜✨</span>
      <div>
        <strong>Forest Charter Reminder:</strong> This idea might make some
        animals feel that their basic rights are not safe. Can it be written in
        a fairer way?
      </div>
    </div>
  );
}
