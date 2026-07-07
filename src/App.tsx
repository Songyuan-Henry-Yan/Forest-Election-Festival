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
import { issues } from './data/issues';
import { candidates } from './data/candidates';
import { events } from './data/events';
import { generateGame } from './lib/generateGame';
import { systems } from './lib/voting';
import { candidateMetrics } from './lib/metrics';
import { load, save } from './lib/storage';
import type { Polarization } from './types/game';

export default function App() {
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [teacher, setTeacher] = useState(() => load('teacherMode', false));
  const [seed, setSeed] = useState(() => load('seed', 2026));
  const [age, setAge] = useState(() => load('ageMode', 'older'));
  const [polarization, setPolarization] = useState<Polarization>(() => load<{ polarization: Polarization }>('settings', { polarization: 'Medium' }).polarization);
  const [selected, setSelected] = useState<string[]>(() => load('selectedVotingSystems', ['plurality', 'twoRound', 'irv', 'approval', 'score', 'star', 'borda', 'condorcet', 'council']));
  const [featuredEvent, setFeaturedEvent] = useState(0);

  useEffect(() => setMaxVisited((current) => Math.max(current, step)), [step]);
  useEffect(() => save('teacherMode', teacher), [teacher]);
  useEffect(() => save('seed', seed), [seed]);
  useEffect(() => save('ageMode', age), [age]);
  useEffect(() => save('settings', { polarization }), [polarization]);
  useEffect(() => save('selectedVotingSystems', selected), [selected]);

  const election = useMemo(() => generateGame(seed, polarization, 120), [seed, polarization]);
  const results = useMemo(() => selected.map((id) => systems[id as keyof typeof systems](election.ballots, election.candidates)), [selected, election]);
  const metrics = useMemo(() => candidateMetrics(election.ballots, election.candidates), [election]);
  const selectedIssues = useMemo(() => issues.filter((issue) => election.selectedIssueIds.includes(issue.id)), [election.selectedIssueIds]);
  const printSummary = () => window.print();

  return (
    <>
      <FestivalHeader teacher={teacher} setTeacher={setTeacher} />
      <StepPath step={step} setStep={setStep} />
      <main>
        <ForestPassport completedStep={maxVisited} />
        {teacher && <p className="teacher note">This game does not support any political party or real-world candidate. It uses animal stories to help students understand voting rules, public values, and tradeoffs.</p>}
        {step === 0 && <section className="panel"><p className="eyebrow">Forest Festival Gate</p><h2>Welcome, festival voters!</h2><p>Explore how the same voters and same ballots can lead to different winners when the counting rule changes.</p><label>Age mode <select value={age} onChange={(e) => setAge(e.target.value)}><option value="younger">Younger readers</option><option value="older">Older readers</option></select></label><CharterPanel /></section>}
        {step === 1 && <ElectionWorkshop seed={seed} setSeed={setSeed} polarization={polarization} setPolarization={setPolarization} />}
        {step === 2 && <section><p className="eyebrow">Issue Trail</p><h2>Flip Leaf Issue Cards</h2><div className="grid">{issues.map((i) => <IssueCard key={i.id} issue={i} teacher={teacher} />)}</div></section>}
        {step === 3 && <section><p className="eyebrow">Candidate Rally Stage</p><h2>Rally Candidate Cards</h2><div className="grid">{candidates.map((c) => <CandidateCard key={c.id} candidate={c} />)}</div></section>}
        {step === 4 && <section className="panel news-stand"><p className="eyebrow">Parrot News Stand</p><h2>Campaign Events</h2><button onClick={() => setFeaturedEvent((featuredEvent + 1) % events.length)}>Draw Today’s Forest News</button><div className="news-kiosk"><EventCard title={events[featuredEvent].title} text={events[featuredEvent].text} featured /><div className="grid">{events.map((event) => <EventCard key={event.id} title={event.title} text={event.text} />)}</div></div></section>}
        {step === 5 && <VotingSystemSelector selected={selected} setSelected={setSelected} teacher={teacher} />}
        {step === 6 && <><button className="print-button" onClick={printSummary}>Print Summary</button><ResultsDashboard results={results} candidates={election.candidates} metrics={metrics} teacher={teacher} /></>}
        {step === 7 && <><button className="print-button" onClick={printSummary}>Print Summary</button><ReflectionPanel /><CharterPanel /></>}
        <PrintSummary seed={seed} polarization={polarization} voterCount={election.voterCount} candidates={election.candidates} issues={selectedIssues} results={results} /><div className="next"><button onClick={() => setStep(Math.max(0, step - 1))}>Back</button><button onClick={() => setStep(Math.min(7, step + 1))}>Next</button></div>
      </main>
    </>
  );
}
