import { useEffect, useMemo, useState } from 'react';
import type {
  AgeMode,
  Ballot,
  ElectionSettings,
  FestivalStep,
  GameState,
  VotingSystemId,
} from './types/game';
import { DEFAULT_VOTER_MIX } from './types/game';
import { defaultSettingsFor, defaultSystemsFor, VOTING_SYSTEMS } from './data/votingSystems';
import { createGame, createTeachingGame } from './lib/generateGame';
import { runAllSystems } from './lib/voting';
import { computeMetrics } from './lib/metrics';
import { randomSeed } from './lib/random';
import { loadJSON, saveJSON } from './lib/storage';
import {
  initAudio,
  isMusicOn,
  isSfxOn,
  playChime,
  playClick,
  playFanfare,
  setMusic,
  setSfx,
} from './lib/sound';

import FestivalHeader from './components/FestivalHeader';
import InteractiveForestPath from './components/InteractiveForestPath';
import ForestPassport, { STICKERS } from './components/ForestPassport';
import CharterPanel from './components/CharterPanel';
import WelcomeGate from './components/WelcomeGate';
import ElectionWorkshop from './components/ElectionWorkshop';
import IssueTrail from './components/IssueTrail';
import RallyStage from './components/RallyStage';
import ParrotNewsStand from './components/ParrotNewsStand';
import SystemsPage from './components/SystemsPage';
import CountingTheater from './components/CountingTheater';
import CampfireReflectionPanel from './components/CampfireReflectionPanel';
import PrintSummary from './components/PrintSummary';
import type { BallotSource } from './components/ClassroomVote';

export interface PracticeBallot {
  ranking: string[];
  approvals: string[];
  scores: Record<string, number>;
}

function initialSettings(): ElectionSettings {
  const ageMode = loadJSON<AgeMode>('ageMode', 'classroom');
  const d = defaultSettingsFor(ageMode);
  return {
    ageMode,
    candidateCount: d.candidateCount,
    issueCount: d.issueCount,
    voterCount: d.voterCount,
    polarization: 'medium',
    campaignEvents: true,
    budgetLimits: true,
    charterReminders: true,
    teacherMode: loadJSON('teacherMode', false),
    seed: loadJSON('seed', randomSeed()),
    systems: loadJSON('systems', defaultSystemsFor(ageMode)),
    voterMix: loadJSON('voterMix', DEFAULT_VOTER_MIX),
  };
}

export default function App() {
  const [settings, setSettings] = useState<ElectionSettings>(initialSettings);
  const [game, setGame] = useState<GameState | null>(null);
  const [step, setStep] = useState<FestivalStep>('welcome');
  const [stickers, setStickers] = useState<string[]>(() =>
    loadJSON<string[]>('passport', []),
  );
  const [passportOpen, setPassportOpen] = useState(false);
  const [charterOpen, setCharterOpen] = useState(false);
  const [charterGlow, setCharterGlow] = useState(false);
  const [practiceBallot, setPracticeBallot] = useState<PracticeBallot | null>(null);
  const [guestVoter, setGuestVoter] = useState(false);
  const [predictions, setPredictions] = useState<Partial<Record<VotingSystemId, string>>>({});
  const [classBallots, setClassBallots] = useState<Ballot[]>([]);
  const [ballotSource, setBallotSource] = useState<BallotSource>('forest');
  const [sfxOn, setSfxOn] = useState(isSfxOn);
  const [musicOn, setMusicOn] = useState(isMusicOn);

  // Browsers unlock audio only after a user gesture; also give ordinary
  // buttons a soft wooden tap.
  useEffect(() => {
    const unlock = () => initAudio();
    const clickSound = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (el && el.closest('button')) playClick();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    document.addEventListener('click', clickSound);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      document.removeEventListener('click', clickSound);
    };
  }, []);

  // Persist small preferences.
  useEffect(() => saveJSON('ageMode', settings.ageMode), [settings.ageMode]);
  useEffect(() => saveJSON('teacherMode', settings.teacherMode), [settings.teacherMode]);
  useEffect(() => saveJSON('seed', settings.seed), [settings.seed]);
  useEffect(() => saveJSON('systems', settings.systems), [settings.systems]);
  useEffect(() => saveJSON('voterMix', settings.voterMix), [settings.voterMix]);
  useEffect(() => saveJSON('passport', stickers), [stickers]);

  const award = (id: string) =>
    setStickers((prev) => {
      if (prev.includes(id)) return prev;
      playChime();
      return [...prev, id];
    });

  const update = (patch: Partial<ElectionSettings>) =>
    setSettings((s) => ({ ...s, ...patch }));

  const chooseAgeMode = (mode: AgeMode) => {
    const d = defaultSettingsFor(mode);
    update({ ageMode: mode, ...d, systems: defaultSystemsFor(mode) });
  };

  const resetElectionExtras = () => {
    setPredictions({});
    setGuestVoter(false);
    setClassBallots([]);
    setBallotSource('forest');
  };

  // ---- Election creation (the ONLY places ballots are generated) ----
  const startTeaching = () => {
    // The teaching example works in every age mode and switches on all nine
    // counting machines so every rule can be compared.
    const allSystems = VOTING_SYSTEMS.map((s) => s.id);
    const g = createTeachingGame({ ...settings, systems: allSystems });
    setGame(g);
    setSettings((s) => ({ ...s, ...g.settings, systems: allSystems }));
    resetElectionExtras();
    award('visitor');
    setStep('issues');
  };

  const startRandom = (s: ElectionSettings) => {
    setSettings(s);
    setGame(createGame(s));
    resetElectionExtras();
    award('visitor');
    setStep('issues');
  };

  // ---- Classroom vote handlers ----
  const submitStudent = (ballot: Omit<Ballot, 'voterId' | 'voterGroupId'>) => {
    setClassBallots((prev) => [
      ...prev,
      { ...ballot, voterId: `student-${prev.length}`, voterGroupId: 'student' },
    ]);
    setBallotSource('class');
    award('classvote');
  };

  const fillBots = (targetTotal: number) => {
    if (!game) return;
    setClassBallots((prev) => {
      const need = Math.max(0, Math.min(500, targetTotal) - prev.length);
      const bots: Ballot[] = [];
      for (let i = 0; i < need; i++) {
        const src = game.ballots[(prev.length + i) % game.ballots.length];
        bots.push({ ...src, voterId: `bot-${prev.length + i}`, voterGroupId: 'bot' });
      }
      return [...prev, ...bots];
    });
    setBallotSource('class');
  };

  // ---- Results: pure functions over the stored ballots ----
  const activeSystems = settings.systems;

  const effectiveBallots: Ballot[] = useMemo(() => {
    if (!game) return [];
    if (ballotSource === 'class' && classBallots.length > 0) return classBallots;
    if (guestVoter && practiceBallot && practiceBallot.ranking.length === game.candidates.length) {
      const guest: Ballot = {
        voterId: 'guest',
        voterGroupId: 'guest',
        ranking: practiceBallot.ranking,
        approvals: practiceBallot.approvals,
        scores: practiceBallot.scores,
        favoriteIssues: [],
      };
      return [...game.ballots, guest];
    }
    return game.ballots;
  }, [game, ballotSource, classBallots, guestVoter, practiceBallot]);

  const results = useMemo(
    () => (game ? runAllSystems(activeSystems, game.candidates, effectiveBallots) : []),
    [game, activeSystems, effectiveBallots],
  );

  const metrics = useMemo(
    () => (game ? computeMetrics(game.candidates, effectiveBallots) : []),
    [game, effectiveBallots],
  );

  const sourceLabel = useMemo(() => {
    if (ballotSource === 'class' && classBallots.length > 0) {
      const students = classBallots.filter((b) => b.voterGroupId === 'student').length;
      const bots = classBallots.length - students;
      return `classroom ballots: ${students} student${students === 1 ? '' : 's'}${bots > 0 ? ` + ${bots} bot${bots === 1 ? '' : 's'}` : ''}`;
    }
    return null;
  }, [ballotSource, classBallots]);

  // ---- Navigation ----
  const eventsOpen = game ? game.settings.campaignEvents : settings.campaignEvents;
  const order: FestivalStep[] = [
    'welcome', 'setup', 'issues', 'candidates', 'events', 'systems', 'results', 'reflection',
  ];
  const enterStep = (s: FestivalStep) => {
    if (s === 'results') {
      award('detective');
      playFanfare();
    }
    setStep(s);
  };
  const goNext = (from: FestivalStep) => {
    let i = order.indexOf(from) + 1;
    if (order[i] === 'events' && !eventsOpen) i += 1;
    enterStep(order[i] ?? 'reflection');
  };

  const teacher = settings.teacherMode;

  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to main content</a>
      <FestivalHeader
        teacherMode={teacher}
        onToggleTeacher={(on) => update({ teacherMode: on })}
        onOpenCharter={() => { setCharterOpen(true); setCharterGlow(false); }}
        onOpenPassport={() => setPassportOpen(true)}
        charterGlow={charterGlow}
        stickerCount={stickers.length}
        sfxOn={sfxOn}
        musicOn={musicOn}
        onToggleSfx={() => {
          const next = !sfxOn;
          setSfxOn(next);
          setSfx(next);
        }}
        onToggleMusic={() => {
          const next = !musicOn;
          setMusicOn(next);
          setMusic(next);
        }}
      />
      <InteractiveForestPath
        current={step}
        hasGame={game !== null}
        eventsOpen={eventsOpen}
        onGo={enterStep}
        completed={stickers}
      />
      <main id="main" className="main">
        {step === 'welcome' && (
          <WelcomeGate
            ageMode={settings.ageMode}
            onAgeMode={chooseAgeMode}
            onTeaching={startTeaching}
            onRandom={() => setStep('setup')}
          />
        )}
        {step === 'setup' && (
          <ElectionWorkshop
            settings={settings}
            onChange={update}
            onCreate={startRandom}
            hasGame={game !== null}
            gameSeed={game?.settings.seed ?? null}
          />
        )}
        {step === 'issues' && game && (
          <IssueTrail
            game={game}
            teacherMode={teacher}
            onExplored={() => award('issues')}
            onNext={() => goNext('issues')}
          />
        )}
        {step === 'candidates' && game && (
          <RallyStage
            game={game}
            teacherMode={teacher}
            onListened={() => award('listener')}
            onBudgetChecked={() => award('budget')}
            onCharterReminder={() => setCharterGlow(true)}
            onNext={() => goNext('candidates')}
          />
        )}
        {step === 'events' && game && (
          <ParrotNewsStand
            game={game}
            onAllDrawn={() => award('news')}
            onNext={() => goNext('events')}
          />
        )}
        {step === 'systems' && game && (
          <SystemsPage
            game={game}
            settings={settings}
            onToggleSystem={(id, on) =>
              update({
                systems: on
                  ? [...settings.systems, id]
                  : settings.systems.filter((s) => s !== id),
              })
            }
            onSelectAllSystems={() =>
              update({ systems: VOTING_SYSTEMS.map((s) => s.id) })
            }
            onClearAllSystems={() => update({ systems: [] })}
            practiceBallot={practiceBallot}
            onPracticeBallot={(b) => setPracticeBallot(b)}
            guestVoter={guestVoter}
            onGuestVoter={setGuestVoter}
            predictions={predictions}
            onPredict={(sys, cand) =>
              setPredictions((p) => ({ ...p, [sys]: cand }))
            }
            onPracticeDone={() => award('ballotkeeper')}
            onDemoRun={() => award('ruletester')}
            classBallots={classBallots}
            onSubmitStudent={submitStudent}
            onFillBots={fillBots}
            onClearClass={() => {
              setClassBallots([]);
              setBallotSource('forest');
            }}
            ballotSource={ballotSource}
            onSource={setBallotSource}
            onNext={() => goNext('systems')}
          />
        )}
        {step === 'results' && game && (
          <CountingTheater
            game={game}
            results={results}
            metrics={metrics}
            ballots={effectiveBallots}
            teacherMode={teacher}
            guestVoter={ballotSource === 'forest' && guestVoter && practiceBallot !== null}
            sourceLabel={sourceLabel}
            predictions={predictions}
            onNext={() => goNext('results')}
          />
        )}
        {step === 'reflection' && (
          <CampfireReflectionPanel
            teacherMode={teacher}
            onReflected={() => award('fairness')}
            onPlayAgain={() => setStep('setup')}
            hasGame={game !== null}
          />
        )}
        {(step !== 'welcome' && step !== 'setup' && step !== 'reflection' && !game) && (
          <section className="card empty-state">
            <h2>The festival hasn’t started yet!</h2>
            <p>Walk back to the Welcome Gate to start a teaching example, or visit the Election Workshop to create your own election.</p>
            <button className="btn btn-primary" onClick={() => setStep('welcome')}>
              Go to the Welcome Gate
            </button>
          </section>
        )}
      </main>
      <footer className="footer">
        <p>
          🌲 A nonpartisan civics game. Same voters, same ballots — different
          counting rules. No real parties or politicians appear in this forest.
        </p>
      </footer>
      {passportOpen && (
        <ForestPassport
          earned={stickers}
          onClose={() => setPassportOpen(false)}
        />
      )}
      {charterOpen && <CharterPanel onClose={() => setCharterOpen(false)} />}
      {game && (
        <PrintSummary
          game={game}
          results={results}
          teacherMode={teacher}
          stickers={stickers.map((id) => STICKERS.find((s) => s.id === id)?.label ?? id)}
        />
      )}
    </div>
  );
}
