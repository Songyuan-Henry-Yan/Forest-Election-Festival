import { useState } from 'react';
import type { Issue } from '../types/game';

export function IssueCard({ issue, teacher }: { issue: Issue; teacher: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <button className={`leaf-card ${open ? 'flipped' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open}>
      <span className="leaf-curl" aria-hidden="true">🍃</span>
      {!open ? (
        <span className="leaf-face leaf-front">
          <span className="issue-icon" aria-hidden="true">{issue.icon}</span>
          <strong>{issue.title}</strong>
          <small>Click to flip this leaf open.</small>
        </span>
      ) : (
        <span className="leaf-face leaf-back">
          <strong>{issue.title}</strong>
          <span>{issue.story}</span>
          <span><b>Question:</b> {issue.question}</span>
          <span><b>Value conflict:</b> {issue.tags.join(' and ')}</span>
          {teacher && <span className="teacher"><b>Teacher connection:</b> {issue.teacherConnection}</span>}
        </span>
      )}
    </button>
  );
}
