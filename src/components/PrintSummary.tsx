// Print-only summary. Hidden on screen; shown by @media print CSS.

import type { ElectionResult, GameState } from '../types/game';
import { systemInfo } from '../data/votingSystems';
import { whyWon, WHY_WON } from './WinnerBadgeWall';
import { DISCUSSION_QUESTIONS } from './CampfireReflectionPanel';
import { NONPARTISAN_NOTE } from './TeacherNotes';

interface Props {
  game: GameState;
  results: ElectionResult[];
  teacherMode: boolean;
  stickers: string[];
}

export default function PrintSummary({ game, results, teacherMode, stickers }: Props) {
  const single = results.filter((r) => r.systemId !== 'council');
  const differed = new Set(single.map((r) => r.winnerIds[0])).size > 1;
  const s = game.settings;

  return (
    <div className="print-summary" aria-hidden="true">
      <h1>Animal Kingdom Election Festival — Class Summary</h1>
      <p>Same voters. Same ballots. Different voting rules.</p>

      <h2>Election settings</h2>
      <p>
        {game.isTeaching ? 'Teaching Example (fixed classroom election). ' : ''}
        Age mode: {s.ageMode === 'story' ? 'Story Mode (6–8)' : s.ageMode === 'classroom' ? 'Classroom Election (9–11)' : 'Voting Systems Lab (12–14)'} •
        Magic seed: {s.seed} • Candidates: {game.candidates.length} • Issues: {game.issues.length} • Voters: {game.settings.voterCount} •
        Strong feelings (polarization): {s.polarization} • Campaign events: {s.campaignEvents ? 'on' : 'off'} • Budget limits: {s.budgetLimits ? 'on' : 'off'} •
        Neighborhood: {s.voterMix.mode === 'random'
          ? 'surprise mix'
          : [
              s.voterMix.generations === -1 ? 'more young animals' : s.voterMix.generations === 1 ? 'more elders' : null,
              s.voterMix.pantries === -1 ? 'more empty pantries' : s.voterMix.pantries === 1 ? 'more full pantries' : null,
              s.voterMix.roots === 1 ? 'many new families' : s.voterMix.roots === -1 ? 'mostly long-time families' : null,
              s.voterMix.jobs.length > 0 ? `extra ${s.voterMix.jobs.join(', ')}` : null,
            ].filter(Boolean).join(', ') || 'balanced design'}
      </p>

      <h2>Candidates</h2>
      <ul>
        {game.candidates.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong> ({c.species}) — “{c.slogan}” Strength: {c.strength} Tradeoff: {c.tradeoff}
          </li>
        ))}
      </ul>

      <h2>Issues</h2>
      <ul>
        {game.issues.map((it) => (
          <li key={it.id}>
            <strong>{it.title}:</strong> {it.question}
            {teacherMode && <em> (Real-world connection: {it.realWorld})</em>}
          </li>
        ))}
      </ul>

      {game.drawnEvents.length > 0 && (
        <>
          <h2>Campaign events drawn</h2>
          <ul>
            {game.drawnEvents.map((d) => (
              <li key={d.event.id}>
                <strong>{d.event.title}:</strong> {d.event.text}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Winners by voting rule</h2>
      <table>
        <thead>
          <tr>
            <th>Voting rule</th>
            <th>Winner</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.systemId}>
              <td>{teacherMode ? systemInfo(r.systemId).teacherName : systemInfo(r.systemId).kidName}</td>
              <td>{r.winnerLabel}</td>
              <td>{r.systemId === 'council' ? WHY_WON.council : whyWon(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {differed ? (
        <p>
          <strong>Notice:</strong> the voters stayed the same and the ballots
          stayed the same, but different voting rules chose different winners.
        </p>
      ) : (
        <p>
          <strong>Notice:</strong> this time, the selected rules agreed on the
          same winner.
        </p>
      )}
      <p>
        Different rules reward different democratic values: simplicity,
        majority support, broad acceptability, strong feelings, compromise, or
        representation.
      </p>

      <h2>Campfire discussion questions</h2>
      <ol>
        {DISCUSSION_QUESTIONS.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ol>

      {stickers.length > 0 && (
        <p>Forest Passport stickers earned: {stickers.join(', ')}</p>
      )}

      {teacherMode && (
        <p>
          <strong>Teacher note:</strong> {NONPARTISAN_NOTE}
        </p>
      )}
    </div>
  );
}
