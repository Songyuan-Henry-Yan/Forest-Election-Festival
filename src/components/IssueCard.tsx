import { useState } from 'react';
import type { AgeMode, Issue } from '../types/game';

const issueText = (issue: Issue, ageMode: AgeMode) => ageMode === 'little' ? issue.simpleText : ageMode === 'trail' ? issue.mediumText : issue.advancedText;

export function IssueCard({ issue, teacher, ageMode = 'trail', selected = false, onToggle }: { issue: Issue; teacher: boolean; ageMode?: AgeMode; selected?: boolean; onToggle?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <button className={`leaf-card ${open ? 'flipped' : ''} ${selected ? 'selected' : ''}`} onClick={() => onToggle ? onToggle() : setOpen(!open)} onDoubleClick={() => setOpen(!open)} aria-expanded={open} aria-pressed={selected} aria-label={`${selected ? 'Selected' : 'Not selected'} issue ${issue.title}. Click to select.`}>
      <span className="leaf-curl" aria-hidden="true">{selected ? '✅' : '🍃'}</span>
      {!open ? (
        <span className="leaf-face leaf-front">
          <span className="issue-icon" aria-hidden="true">{issue.icon}</span>
          <strong>{issue.title}</strong>
          <small>{issueText(issue, ageMode)}</small>
        </span>
      ) : (
        <span className="leaf-face leaf-back">
          <strong>{issue.title}</strong>
          <span>{issueText(issue, ageMode)}</span>
          {ageMode === 'assembly' && issue.tradeOffText && <span><b>Trade-off:</b> {issue.tradeOffText}</span>}
          <span><b>Value conflict:</b> {issue.tags.join(' and ')}</span>
          {teacher && <span className="teacher"><b>Teacher connection:</b> {issue.teacherConnection}</span>}
        </span>
      )}
    </button>
  );
}
