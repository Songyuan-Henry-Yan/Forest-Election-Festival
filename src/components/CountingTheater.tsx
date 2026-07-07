import type {
  Ballot,
  Candidate,
  CandidateMetrics,
  ElectionResult,
  GameState,
  VotingSystemId,
} from '../types/game';
import { systemInfo } from '../data/votingSystems';
import { listNames } from '../lib/format';
import WinnerBadgeWall, { whyWon } from './WinnerBadgeWall';
import ResultComparisonTable from './ResultComparisonTable';
import CandidateMetricCard from './CandidateMetricCard';
import AnimatedRoundsAccordion from './AnimatedRoundsAccordion';
import TeacherNotes, { NONPARTISAN_NOTE } from './TeacherNotes';
import AnimalAvatar from './AnimalAvatar';

interface Props {
  game: GameState;
  results: ElectionResult[];
  metrics: CandidateMetrics[];
  ballots: Ballot[];
  teacherMode: boolean;
  guestVoter: boolean;
  sourceLabel: string | null;
  predictions: Partial<Record<VotingSystemId, string>>;
  onNext: () => void;
}

function whyDifferedSentences(
  results: ElectionResult[],
  candidates: Candidate[],
): string[] {
  const single = results.filter((r) => r.systemId !== 'council');
  const byWinner = new Map<string, ElectionResult[]>();
  for (const r of single) {
    const list = byWinner.get(r.winnerIds[0]) ?? [];
    list.push(r);
    byWinner.set(r.winnerIds[0], list);
  }
  const sentences: string[] = [];
  for (const [winnerId, rs] of byWinner) {
    const cand = candidates.find((c) => c.id === winnerId);
    if (!cand) continue;
    const ruleNames = listNames(rs.map((r) => systemInfo(r.systemId).kidName));
    const reasons = [...new Set(rs.map((r) => whyWon(r)))].join(', and ');
    sentences.push(`${cand.name} won with ${ruleNames} because ${cand.name.split(' ')[0]} ${reasons}.`);
  }
  return sentences;
}

export default function CountingTheater({
  game,
  results,
  metrics,
  ballots,
  teacherMode,
  guestVoter,
  sourceLabel,
  predictions,
  onNext,
}: Props) {
  const singleWinner = results.filter((r) => r.systemId !== 'council');
  const distinctWinners = new Set(singleWinner.map((r) => r.winnerIds[0]));
  const differed = distinctWinners.size > 1;
  const predicted = Object.entries(predictions).filter(([sys, cand]) =>
    cand !== '' && results.some((r) => r.systemId === sys),
  );

  return (
    <section>
      <h2>🎭 Counting Theater</h2>
      <div className="theater-banner">
        <strong>Same voters. Same ballots. Different counting rules.</strong>
      </div>

      <div className="theater-scene" aria-hidden="true">
        <div className="ballot-stack">
          <span className="ballot-leaf">🍃</span>
          <span className="ballot-leaf">🍃</span>
          <span className="ballot-leaf">🍃</span>
          <small>{ballots.length} leaf ballots{guestVoter ? ' (incl. your guest ballot!)' : ''}</small>
        </div>
        <span className="theater-arrow">➡️</span>
        <div className="theater-machines">
          {results.map((r) => (
            <span key={r.systemId} className="theater-machine" title={systemInfo(r.systemId).machineName}>
              {systemInfo(r.systemId).machineEmoji}
            </span>
          ))}
          <small>the very same stack goes through every machine</small>
        </div>
        <span className="theater-arrow">➡️</span>
        <div className="theater-ribbons">
          {[...distinctWinners].map((id) => {
            const c = game.candidates.find((x) => x.id === id);
            return c ? (
              <span key={id} className="theater-ribbon" style={{ borderColor: c.color }}>
                <AnimalAvatar species={c.species} label={c.name} size={34} /> 🎀
              </span>
            ) : null;
          })}
          <small>{distinctWinners.size} different winner{distinctWinners.size === 1 ? '' : 's'}</small>
        </div>
      </div>

      {sourceLabel && (
        <p className="guest-note" role="note">
          🏫 The theater is counting <strong>{sourceLabel}</strong> — every
          rule below reads this same class ballot box. (Switch back to forest
          ballots at the Counting Arcade.)
        </p>
      )}
      {guestVoter && (
        <p className="guest-note" role="note">
          🙋 Your practice ballot is counted as one guest voter in every rule
          below.
        </p>
      )}

      {differed ? (
        <div className="result-callout is-different" role="status">
          <p>
            🎉 <strong>Look what happened!</strong> The voters stayed the same,
            and the ballots stayed the same, but different voting rules chose
            different winners.
          </p>
        </div>
      ) : (
        <div className="result-callout" role="status">
          <p>
            🤝 This time, many rules agreed on the same winner. Try adding more
            candidates or raising polarization to see if the results change.
          </p>
        </div>
      )}
      <p className="neutrality-note">
        This does not mean one voting rule is always best. Different rules
        reward different democratic values: simplicity, majority support, broad
        acceptability, strong feelings, compromise, or representation.
      </p>

      <h3>🏆 Winner Badge Wall</h3>
      <WinnerBadgeWall
        results={results}
        candidates={game.candidates}
        metrics={metrics}
        teacherMode={teacherMode}
      />

      {predicted.length > 0 && (
        <div className="prediction-check">
          <h3>🔮 Your predictions vs. the forest results</h3>
          <ul>
            {predicted.map(([sys, candId]) => {
              const r = results.find((x) => x.systemId === sys)!;
              const guess = game.candidates.find((c) => c.id === candId);
              const hit = r.winnerIds[0] === candId && sys !== 'council';
              return (
                <li key={sys}>
                  {systemInfo(sys as VotingSystemId).machineEmoji}{' '}
                  {systemInfo(sys as VotingSystemId).kidName}: you guessed{' '}
                  <strong>{guess?.name}</strong> — forest result:{' '}
                  <strong>{r.winnerLabel}</strong>{' '}
                  {sys === 'council' ? '🌲' : hit ? '✅ Great guess!' : '💡 Interesting! Voting rules can surprise us.'}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {game.settings.ageMode !== 'story' && (
        <>
          <h3>📊 Winner Comparison Table</h3>
          <ResultComparisonTable
            results={results}
            candidates={game.candidates}
            metrics={metrics}
            teacherMode={teacherMode}
          />

          <h3>🐾 Candidate Metric Cards</h3>
          <div className="metric-grid">
            {game.candidates.map((c) => {
              const m = metrics.find((x) => x.candidateId === c.id);
              return (
                m && (
                  <CandidateMetricCard
                    key={c.id}
                    candidate={c}
                    metrics={m}
                    totalCandidates={game.candidates.length}
                    teacherMode={teacherMode}
                  />
                )
              );
            })}
          </div>
        </>
      )}

      <AnimatedRoundsAccordion
        results={results}
        candidates={game.candidates}
        teacherMode={teacherMode}
      />

      <div className="why-differed">
        <h3>🧩 Why did the results {differed ? 'differ' : 'agree'}?</h3>
        <p className="muted">Three friendly ideas explain almost everything:</p>
        <div className="idea-cards">
          <div className="idea-card">
            <span aria-hidden="true">💖</span>
            <strong>Favorite Fans</strong>
            <p>Who had the most first-choice supporters? Choose-One Voting loves favorite fans.</p>
          </div>
          <div className="idea-card">
            <span aria-hidden="true">😊</span>
            <strong>Okay for Many Animals</strong>
            <p>Who was acceptable to many voters? Approval, ladders, and matchups reward being widely okay.</p>
          </div>
          <div className="idea-card">
            <span aria-hidden="true">⭐</span>
            <strong>Strong Feelings</strong>
            <p>Who got the most stars? Star rules measure how strongly voters feel.</p>
          </div>
        </div>
        <ul className="differed-list">
          {whyDifferedSentences(results, game.candidates).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {game.isTeaching && (
        <p className="teaching-note" role="note">
          🏫 This example is designed for classrooms. It shows that the
          candidate with the most first-choice votes is not always the
          candidate most voters can accept.
        </p>
      )}

      {teacherMode && (
        <TeacherNotes>
          <p>{NONPARTISAN_NOTE}</p>
          <p>
            Discussion starters: Which democratic value matters most in a
            student council election — simplicity, majority support, or broad
            acceptability? Would the class pick a different rule for choosing a
            movie vs. choosing a president?
          </p>
        </TeacherNotes>
      )}

      <div className="page-actions">
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Print Summary
        </button>
        <button className="btn btn-primary btn-big" onClick={onNext}>
          🔥 Join the Campfire Circle →
        </button>
      </div>
    </section>
  );
}
