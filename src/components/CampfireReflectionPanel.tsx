import { useRef, useState } from 'react';
import TeacherNotes, { NONPARTISAN_NOTE } from './TeacherNotes';

export const DISCUSSION_QUESTIONS = [
  'Which voting rule was easiest to understand?',
  'Which rule let voters express the most information?',
  'Which rule picked the candidate with the most first-choice fans?',
  'Which rule picked a candidate many animals could accept?',
  'If your favorite candidate cannot win, should your vote move to your next choice?',
  'Should a candidate who is not many voters’ first choice, but is acceptable to almost everyone, be able to win?',
  'Can the majority decide everything?',
  'Why does the Forest Charter matter?',
  'Why should voters check campaign promises against the budget?',
  'What should happen if a campaign ad says something that is not true?',
];

interface Props {
  teacherMode: boolean;
  onReflected: () => void;
  onPlayAgain: () => void;
  hasGame: boolean;
}

export default function CampfireReflectionPanel({
  teacherMode,
  onReflected,
  onPlayAgain,
  hasGame,
}: Props) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [passed, setPassed] = useState<number | null>(null);
  const flips = useRef(0);

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else {
        next.add(i);
        flips.current += 1;
        if (flips.current >= 3) onReflected();
      }
      return next;
    });
  };

  const passAcorn = () => {
    const i = Math.floor(Math.random() * DISCUSSION_QUESTIONS.length);
    setPassed(i);
    setOpen((prev) => new Set(prev).add(i));
    flips.current += 1;
    if (flips.current >= 3) onReflected();
  };

  return (
    <section>
      <h2>🔥 Campfire Reflection Circle</h2>
      <p className="page-intro">
        The votes are counted, the ribbons are tied, and now the animals gather
        around the campfire to talk. Flip a card and share what you think —
        there are no wrong answers here.
      </p>

      <div className="campfire-scene" aria-hidden="true">
        <span className="campfire-animal">🦊</span>
        <span className="campfire-animal">🐼</span>
        <div className="campfire">
          <span className="flame">🔥</span>
          <div className="logs" />
        </div>
        <span className="campfire-animal">🦉</span>
        <span className="campfire-animal">🐢</span>
      </div>

      {teacherMode && (
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={passAcorn}>
            🌰 Pass the Acorn (pick a random question)
          </button>
        </div>
      )}

      <div className="question-cards">
        {DISCUSSION_QUESTIONS.map((q, i) => {
          const isOpen = open.has(i);
          return (
            <button
              key={i}
              className={`question-card ${isOpen ? 'is-open' : ''} ${passed === i ? 'is-passed' : ''}`}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <span className="question-text">{q}</span>
              ) : (
                <span className="question-cover">
                  <span aria-hidden="true">🪵</span> Question {i + 1}
                  <small>tap to flip</small>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="reflection-message">
        <p>
          🌲 Democracy is more than one election day. It is fair rules, private
          ballots, honest facts, listening to smaller groups, and shaking paws
          when the count is over — win or lose.
        </p>
      </div>

      {teacherMode && (
        <TeacherNotes>
          <p>{NONPARTISAN_NOTE}</p>
          <p>
            Extension ideas: hold a real classroom vote (favorite recess game)
            with two different rules and compare; ask students to design their
            own “charter” for classroom decisions; or assign each student a
            voter group and re-run the debate.
          </p>
        </TeacherNotes>
      )}

      <div className="page-actions">
        <button className="btn btn-secondary" onClick={() => window.print()} disabled={!hasGame}>
          🖨️ Print Summary
        </button>
        <button className="btn btn-primary btn-big" onClick={onPlayAgain}>
          🌱 Plant a New Election
        </button>
      </div>
    </section>
  );
}
