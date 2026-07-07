import { useState } from 'react';
import type { Issue, VoterGroup } from '../types/game';
import TeacherNotes from './TeacherNotes';
import { playFlip, playSticker } from '../lib/sound';

interface Props {
  issue: Issue;
  groups: VoterGroup[];
  teacherMode: boolean;
  storyMode: boolean;
  weight: number;
  focused: boolean;
  canFocus: boolean;
  onFlip: () => void;
  onToggleFocus: () => void;
}

export default function FlipLeafIssueCard({
  issue,
  groups,
  teacherMode,
  storyMode,
  weight,
  focused,
  canFocus,
  onFlip,
  onToggleFocus,
}: Props) {
  const [open, setOpen] = useState(false);
  const carers = groups.filter((g) => issue.groupIds.includes(g.id));

  const flip = () => {
    playFlip();
    if (!open) onFlip();
    setOpen((o) => !o);
  };

  return (
    <div className={`leaf-card ${open ? 'is-open' : ''} ${focused ? 'is-focused' : ''}`}>
      <div className="leaf-card-inner">
        <button
          className="leaf-front"
          onClick={flip}
          aria-expanded={open}
          aria-label={`${issue.title}. Press to flip the leaf open.`}
        >
          <span className="leaf-emoji" aria-hidden="true">{issue.emoji}</span>
          <strong>{issue.title}</strong>
          {weight > 1 && (
            <span className="weight-tag" title="This issue became more important after forest news.">
              🔥 hot topic
            </span>
          )}
          <span className="flip-hint" aria-hidden="true">tap to flip 🍃</span>
        </button>
        <div className="leaf-back" hidden={!open}>
          <button className="leaf-close" onClick={flip} aria-label={`Close ${issue.title}`}>
            🍃 flip back
          </button>
          <h4>
            {issue.emoji} {issue.title}
          </h4>
          <p className="issue-question">{issue.question}</p>
          {!storyMode && <p className="issue-story">{issue.story}</p>}
          <p className="issue-conflict">
            <strong>Values that tug at each other:</strong> {issue.conflict}
          </p>
          {carers.length > 0 && (
            <p className="issue-carers">
              <strong>Who cares a lot?</strong>{' '}
              {carers.map((g) => (
                <span key={g.id} className="carer-chip" title={`${g.name} — ${g.needs}`}>
                  {g.emoji} {g.name}
                </span>
              ))}
            </p>
          )}
          {teacherMode && (
            <TeacherNotes title="Real-World Connection">
              {issue.realWorld}
            </TeacherNotes>
          )}
          <button
            className={`btn btn-small ${focused ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              if (!focused) playSticker();
              onToggleFocus();
            }}
            disabled={!focused && !canFocus}
          >
            {focused ? '🌟 Focus Leaf placed — remove' : '🌟 Place a Focus Leaf'}
          </button>
        </div>
      </div>
    </div>
  );
}
