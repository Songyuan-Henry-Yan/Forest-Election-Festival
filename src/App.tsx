import { useEffect, useMemo, useState } from 'react';
import './styles/global.css';
import { FestivalHeader } from './components/FestivalHeader';
import { StepPath } from './components/StepPath';
import { ForestPassport } from './components/ForestPassport';
import { ElectionWorkshop } from './components/ElectionWorkshop';
import { IssueCard } from './components/IssueCard';
import { CandidateCard } from './components/CandidateCard';
import { EventCard } from './components/EventCard';
import { VotingSystemSelector } from './components/VotingSystemSelector';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ReflectionPanel } from './components/ReflectionPanel';
import { CharterPanel } from './components/CharterPanel';
import { PrintSummary } from './components/PrintSummary';
import { ClassModePanel } from './components/ClassModePanel';
import { issues } from './data/issues';
import { candidates, studentTeamCandidates } from './data/candidates';
import { events } from './data/events';
import { ageRanges, defaultSettings } from './data/settings';
import { generateGame } from './lib/generateGame';
import { systems } from './lib/voting';
import { candidateMetrics } from './lib/metrics';
import { load, save } from './lib/storage';
import type { AgeMode, Candidate, ElectionSettings, Polarization } from './types/game';

const normalizeAgeMode = (value: unknown): AgeMode => value === 'little' || value === 'trail' || value === 'assembly' ? value : value === 'younger' ? 'little' : 'trail';
const loadSettings = (): ElectionSettings => ({ ...defaultSettings, issueCount: ageRanges.trail.defaultIssueCount, ...load<Partial<ElectionSettings>>('settings', {}) });

export default function App() {
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [teacher, setTeacher] = useState(() => load('teacherMode', false));
  const [seed, setSeed] = useState(() => load('seed', 2026));
  const [age, setAge] = useState<AgeMode>(() => normalizeAgeMode(load('ageMode', 'trail')));
  const [settings, setSettings] = useState<ElectionSettings>(() => loadSettings());
  const [polarization, setPolarization] = useState<Polarization>(() => load<{ polarization: Polarization }>('polarization', { polarization: 'Medium' }).polarization);
  const [selected, setSelected] = useState<string[]>(() => load('selectedVotingSystems', ['plurality', 'irv', 'approval', 'score', 'condorcet']));
  const [featuredEvent, setFeaturedEvent] = useState(0);
  const [classCandidates, setClassCandidates] = useState<Candidate[]>(() => load('classCandidates', studentTeamCandidates));
  const ageDefault = ageRanges[age].defaultIssueCount;
  const requiredIssueCount = settings.customIssueCount ? Math.max(5, Math.min(12, settings.issueCount)) : ageDefault;
  const [selectedIssueIds, setSelectedIssueIds] = useState<string[]>(() => issues.slice(0, ageRanges.trail.defaultIssueCount).map(issue => issue.id));
  const classMode = settings.mode === 'Full class' || settings.candidateType !== 'Animal NPC candidates';
  const activeCandidates = useMemo(() => settings.candidateType === 'Animal NPC candidates' ? candidates : settings.candidateType === 'Mixed mode' ? [...candidates.slice(0, 3), ...classCandidates.slice(0, 2)] : classCandidates, [settings.candidateType, classCandidates]);

  useEffect(() => setMaxVisited((current) => Math.max(current, step)), [step]);
  useEffect(() => save('teacherMode', teacher), [teacher]);
  useEffect(() => save('seed', seed), [seed]);
  useEffect(() => save('ageMode', age), [age]);
  useEffect(() => save('settings', settings), [settings]);
  useEffect(() => save('polarization', { polarization }), [polarization]);
  useEffect(() => save('selectedVotingSystems', selected), [selected]);
  useEffect(() => save('classCandidates', classCandidates), [classCandidates]);
  useEffect(() => { setSelectedIssueIds((current) => issues.slice(0, requiredIssueCount).map(issue => issue.id).concat(current.filter(id => !issues.slice(0, requiredIssueCount).some(issue => issue.id === id))).slice(0, requiredIssueCount)); }, [requiredIssueCount]);

  const selectedIssues = useMemo(() => issues.filter((issue) => selectedIssueIds.includes(issue.id)), [selectedIssueIds]);
  const election = useMemo(() => generateGame(seed, polarization, 100, selectedIssueIds, settings.candidateBalance, activeCandidates), [seed, polarization, selectedIssueIds, settings.candidateBalance, activeCandidates]);
  const comparedSystemIds = settings.compareMode === 'Single voting system only' ? selected.slice(0, 1) : selected;
  const results = useMemo(() => comparedSystemIds.map((id) => systems[id as keyof typeof systems](election.ballots, election.candidates)), [comparedSystemIds, election]);
  const metrics = useMemo(() => candidateMetrics(election.ballots, election.candidates), [election]);
  const canContinueIssues = selectedIssueIds.length === requiredIssueCount;
  const printSummary = () => window.print();
  const toggleIssue = (id: string) => setSelectedIssueIds((current) => current.includes(id) ? current.filter(x => x !== id) : current.length < requiredIssueCount ? [...current, id] : current);

  return <>
    <FestivalHeader teacher={teacher} setTeacher={setTeacher} />
    <StepPath step={step} setStep={setStep} />
    <main>
      <ForestPassport completedStep={maxVisited} />
      {teacher && <p className="teacher note">This game does not support any political party or real-world candidate. It uses animal stories to help students understand voting rules, public values, and tradeoffs.</p>}
      {step === 0 && <section className="panel"><p className="eyebrow">Forest Festival Gate</p><h2>Choose your voter path</h2><div className="grid">{Object.entries(ageRanges).map(([key, range]) => <button className={`card age-card ${age === key ? 'selected' : ''}`} key={key} onClick={() => setAge(key as AgeMode)} aria-pressed={age === key}><h3>{range.label}</h3><p>{range.ages}</p><p>{range.description}</p><b>Default issues: {range.defaultIssueCount}</b></button>)}</div><CharterPanel /></section>}
      {step === 1 && <><ElectionWorkshop seed={seed} setSeed={setSeed} polarization={polarization} setPolarization={setPolarization} settings={settings} setSettings={setSettings} requiredIssueCount={requiredIssueCount}/><ClassModePanel active={classMode} candidates={classCandidates} setCandidates={setClassCandidates} privacy={settings.classPrivacy}/></>}
      {step === 2 && <section><p className="eyebrow">Issue Trail</p><h2>Select {requiredIssueCount} issues</h2><p className="notice">Selected {selectedIssueIds.length} of {requiredIssueCount}. {canContinueIssues ? 'Ready for the rally.' : 'Choose the required number before continuing.'}</p><div className="grid">{issues.map((i) => <IssueCard key={i.id} issue={i} teacher={teacher} ageMode={age} selected={selectedIssueIds.includes(i.id)} onToggle={() => toggleIssue(i.id)} />)}</div></section>}
      {step === 3 && <section><p className="eyebrow">Candidate Rally Stage</p><h2>Structured Rally Stage</h2><p>Candidates address at least five selected issues. Full manifesto mode addresses every selected issue.</p><div className="grid">{election.candidates.map((c) => <CandidateCard key={c.id} candidate={c} selectedIssues={selectedIssues} ageMode={age} rallyLength={settings.rallyLength} />)}</div></section>}
      {step === 4 && <section className="panel news-stand"><p className="eyebrow">Parrot News Stand</p><h2>Campaign Events</h2><button onClick={() => setFeaturedEvent((featuredEvent + 1) % events.length)}>Draw Today’s Forest News</button><div className="news-kiosk"><EventCard title={events[featuredEvent].title} text={`${events[featuredEvent].text} Campaign tone: ${settings.campaignTone}.`} featured /><div className="grid">{events.map((event) => <EventCard key={event.id} title={event.title} text={event.text} />)}</div></div></section>}
      {step === 5 && <VotingSystemSelector selected={selected} setSelected={setSelected} teacher={teacher} />}
      {step === 6 && <><button className="print-button" onClick={printSummary}>Print Summary</button><ResultsDashboard results={results} candidates={election.candidates} metrics={metrics} teacher={teacher} /></>}
      {step === 7 && <><button className="print-button" onClick={printSummary}>Print Summary</button><ReflectionPanel /><CharterPanel /></>}
      <PrintSummary seed={seed} polarization={polarization} voterCount={election.voterCount} candidates={election.candidates} issues={selectedIssues} results={results} />
      <div className="next"><button onClick={() => setStep(Math.max(0, step - 1))}>Back</button><button disabled={step === 2 && !canContinueIssues} onClick={() => setStep(Math.min(7, step + 1))}>Next</button></div>
    </main>
  </>;
}
