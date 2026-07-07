import type { ReactNode } from 'react';

interface Props {
  title?: string;
  children: ReactNode;
}

/** A visually distinct box that only appears when Teacher Mode is on. */
export default function TeacherNotes({ title = 'Teacher Note', children }: Props) {
  return (
    <aside className="teacher-notes" role="note">
      <strong className="teacher-notes-title">🍎 {title}</strong>
      <div>{children}</div>
    </aside>
  );
}

export const NONPARTISAN_NOTE =
  'This game does not support any political party or real-world candidate. ' +
  'It uses animal stories to help students understand how voting rules, ' +
  'public values, and tradeoffs work.';
