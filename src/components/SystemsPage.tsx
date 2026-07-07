import type { Ballot, ElectionSettings, GameState, VotingSystemId } from '../types/game';
import type { PracticeBallot } from '../App';
import SecretBallotBooth from './SecretBallotBooth';
import CountingMachineArcade from './CountingMachineArcade';
import ClassroomVote, { type BallotSource } from './ClassroomVote';
import TeacherNotes from './TeacherNotes';
import { systemInfo } from '../data/votingSystems';

interface Props {
  game: GameState;
  settings: ElectionSettings;
  onToggleSystem: (id: VotingSystemId, on: boolean) => void;
  onSelectAllSystems: () => void;
  onClearAllSystems: () => void;
  practiceBallot: PracticeBallot | null;
  onPracticeBallot: (b: PracticeBallot) => void;
  guestVoter: boolean;
  onGuestVoter: (on: boolean) => void;
  predictions: Partial<Record<VotingSystemId, string>>;
  onPredict: (sys: VotingSystemId, cand: string) => void;
  onPracticeDone: () => void;
  onDemoRun: () => void;
  classBallots: Ballot[];
  onSubmitStudent: (ballot: Omit<Ballot, 'voterId' | 'voterGroupId'>) => void;
  onFillBots: (targetTotal: number) => void;
  onClearClass: () => void;
  ballotSource: BallotSource;
  onSource: (s: BallotSource) => void;
  onNext: () => void;
}

export default function SystemsPage({
  game,
  settings,
  onToggleSystem,
  onSelectAllSystems,
  onClearAllSystems,
  practiceBallot,
  onPracticeBallot,
  guestVoter,
  onGuestVoter,
  predictions,
  onPredict,
  onPracticeDone,
  onDemoRun,
  classBallots,
  onSubmitStudent,
  onFillBots,
  onClearClass,
  ballotSource,
  onSource,
  onNext,
}: Props) {
  const storyMode = settings.ageMode === 'story';

  return (
    <section>
      <h2>🗳️ Ballot Booth &amp; Counting Arcade</h2>
      <p className="page-intro">
        The forest voters have already filled out rich ballots — each one has a
        full ranking, smile stickers, and star ratings. Now choose which
        counting machines will read them!
      </p>

      <SecretBallotBooth
        candidates={game.candidates}
        practiceBallot={practiceBallot}
        onPracticeBallot={onPracticeBallot}
        guestVoter={guestVoter}
        onGuestVoter={onGuestVoter}
        onPracticeDone={onPracticeDone}
      />

      <ClassroomVote
        game={game}
        classBallots={classBallots}
        onSubmitStudent={onSubmitStudent}
        onFillBots={onFillBots}
        onClear={onClearClass}
        ballotSource={ballotSource}
        onSource={onSource}
      />

      <CountingMachineArcade
        selected={settings.systems}
        teacherMode={settings.teacherMode}
        onToggle={onToggleSystem}
        onSelectAll={onSelectAllSystems}
        onClearAll={onClearAllSystems}
        onDemoRun={onDemoRun}
      />

      {!storyMode && settings.systems.length > 0 && (
        <div className="predict-panel">
          <h3>🔮 Predict the Winner</h3>
          <p className="muted">
            Before the counting starts: which animal do you think each rule will
            choose? (Just for fun — voting rules can surprise us!)
          </p>
          <div className="predict-grid">
            {settings.systems.map((sysId) => (
              <label key={sysId} className="predict-row">
                <span>
                  {systemInfo(sysId).machineEmoji}{' '}
                  {settings.teacherMode ? systemInfo(sysId).teacherName : systemInfo(sysId).kidName}
                </span>
                <select
                  value={predictions[sysId] ?? ''}
                  onChange={(e) => onPredict(sysId, e.target.value)}
                  aria-label={`Prediction for ${systemInfo(sysId).kidName}`}
                >
                  <option value="">— my guess —</option>
                  {game.candidates.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      )}

      {settings.teacherMode && (
        <TeacherNotes>
          <p>
            Every rule below consumes the same ballot data structure (full
            ranking + approval set + 0–5 scores). Toggling rules re-counts the
            stored ballots; it never regenerates them. For a whole-class
            election, use the Classroom Vote box: students vote one at a time,
            bots can round out the electorate, and the Counting Theater can
            switch between forest ballots and class ballots.
          </p>
        </TeacherNotes>
      )}

      <div className="page-actions">
        <button
          className="btn btn-primary btn-big"
          onClick={onNext}
          disabled={settings.systems.length === 0}
        >
          {settings.systems.length === 0
            ? 'Turn on at least one counting machine!'
            : '🎭 Start the Counting Theater →'}
        </button>
      </div>
    </section>
  );
}
