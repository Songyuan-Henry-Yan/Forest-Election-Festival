import type { PassportSticker } from '../types/game';

export const STICKERS: PassportSticker[] = [
  { id: 'visitor', label: 'Festival Visitor', emoji: '🎪', hint: 'Start an election at the Welcome Gate.' },
  { id: 'issues', label: 'Issue Explorer', emoji: '🍃', hint: 'Flip open three leaf cards on the Issue Trail.' },
  { id: 'listener', label: 'Candidate Listener', emoji: '👂', hint: 'Listen to two candidates on the Rally Stage.' },
  { id: 'budget', label: 'Acorn Budget Checker', emoji: '🌰', hint: 'Flip a promise card to check its acorn cost.' },
  { id: 'news', label: 'News Watcher', emoji: '🦜', hint: 'Draw all of today’s forest news cards.' },
  { id: 'ballotkeeper', label: 'Secret Ballot Keeper', emoji: '🤫', hint: 'Finish a practice ballot in the Secret Ballot Booth.' },
  { id: 'ruletester', label: 'Rule Tester', emoji: '⚙️', hint: 'Run a tiny example on any counting machine.' },
  { id: 'classvote', label: 'Class Voter', emoji: '🏫', hint: 'Cast a real student ballot in the Classroom Vote.' },
  { id: 'detective', label: 'Result Detective', emoji: '🔍', hint: 'Visit the Counting Theater.' },
  { id: 'fairness', label: 'Fairness Finder', emoji: '⭐', hint: 'Flip three question cards at the campfire.' },
];

interface Props {
  earned: string[];
  onClose: () => void;
}

export default function ForestPassport({ earned, onClose }: Props) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Forest Passport">
      <div className="modal passport">
        <div className="modal-head">
          <h2>🎟️ Forest Passport</h2>
          <button className="btn btn-small" onClick={onClose} aria-label="Close passport">✕ Close</button>
        </div>
        <p className="muted">
          Collect a sticker at each festival stop. Stickers are just for fun —
          they never change who wins the election!
        </p>
        <ul className="sticker-grid">
          {STICKERS.map((s) => {
            const has = earned.includes(s.id);
            return (
              <li key={s.id} className={`sticker ${has ? 'is-earned' : ''}`}>
                <span className="sticker-emoji" aria-hidden="true">
                  {has ? s.emoji : '❔'}
                </span>
                <strong>{s.label}</strong>
                <small>{has ? 'Earned!' : s.hint}</small>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
