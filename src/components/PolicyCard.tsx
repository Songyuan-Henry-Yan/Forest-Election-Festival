import { useState } from 'react';
import type { Policy } from '../types/game';
import { hashSeed } from '../lib/random';
import { CharterReminder } from './CharterPanel';
import { playFlip, playSticker, playTick } from '../lib/sound';

interface Props {
  policy: Policy;
  issueTitle: string;
  issueEmoji: string;
  storyMode: boolean;
  charterReminders: boolean;
  decoyTradeoffs: string[]; // wrong answers for Spot the Tradeoff
  onFlipped: () => void;
}

export default function PolicyCard({
  policy,
  issueTitle,
  issueEmoji,
  storyMode,
  charterReminders,
  decoyTradeoffs,
  onFlipped,
}: Props) {
  const [open, setOpen] = useState(false);
  const [guess, setGuess] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const flip = () => {
    playFlip();
    if (!open) onFlipped();
    setOpen((o) => !o);
  };

  // Deterministic option order for Spot the Tradeoff.
  const options = [policy.tradeoff, ...decoyTradeoffs.slice(0, 2)];
  const rot = hashSeed(policy.id) % options.length;
  const shuffled = [...options.slice(rot), ...options.slice(0, rot)];

  return (
    <div className={`policy-card ${open ? 'is-open' : ''}`}>
      {!open ? (
        <button className="policy-front" onClick={flip} aria-expanded={false}>
          <span className="policy-issue">
            {issueEmoji} {issueTitle}
          </span>
          <strong>{policy.title}</strong>
          <span className="policy-cost" aria-label={`Cost: ${policy.effects.budgetCost} acorns`}>
            {policy.effects.budgetCost > 0 ? '🌰'.repeat(policy.effects.budgetCost) : 'free ✨'}
          </span>
          <span className="flip-hint">tap to flip 📋</span>
        </button>
      ) : (
        <div className="policy-back">
          <button className="leaf-close" onClick={flip} aria-label="Flip promise card back">
            📋 flip back
          </button>
          <strong>{policy.title}</strong>
          <p className="policy-promise">{storyMode ? policy.promiseKid : policy.promise}</p>
          <ul className="policy-facts">
            <li>💚 <strong>Helps:</strong> {policy.helps}</li>
            <li>🌰 <strong>Costs:</strong> {policy.effects.budgetCost} acorn{policy.effects.budgetCost === 1 ? '' : 's'}</li>
            <li>⚖️ <strong>Tradeoff:</strong> {policy.tradeoff}</li>
            <li>💭 <strong>Possible concern:</strong> {policy.concern}</li>
          </ul>
          {policy.effects.overPromiseRisk >= 2 && (
            <p className="owl-stamp" role="note">
              🦉 <strong>Owl Check:</strong> Let’s compare this promise with the
              acorn budget.
            </p>
          )}
          {charterReminders && policy.effects.rightsRisk > 0 && <CharterReminder />}
          {!storyMode && (
            <div className="tradeoff-quiz">
              {!quizOpen ? (
                <button className="btn btn-small btn-secondary" onClick={() => setQuizOpen(true)}>
                  🎯 Spot the Tradeoff!
                </button>
              ) : (
                <fieldset>
                  <legend>What is the tradeoff of this promise?</legend>
                  {shuffled.map((opt) => (
                    <button
                      key={opt}
                      className={`quiz-option ${
                        guess === opt
                          ? opt === policy.tradeoff
                            ? 'is-correct'
                            : 'is-wrong'
                          : ''
                      }`}
                      onClick={() => {
                        if (opt === policy.tradeoff) playSticker();
                        else playTick();
                        setGuess(opt);
                      }}
                      disabled={guess === policy.tradeoff}
                    >
                      {opt}
                    </button>
                  ))}
                  {guess === policy.tradeoff && (
                    <p className="quiz-feedback" role="status">🎉 You found the tradeoff!</p>
                  )}
                  {guess !== null && guess !== policy.tradeoff && (
                    <p className="quiz-feedback" role="status">
                      Hmm, that’s a tradeoff somewhere in the forest — but not
                      this one. Try again!
                    </p>
                  )}
                </fieldset>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
