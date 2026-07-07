// Shared game types for the Animal Kingdom Election Festival.

export type AgeMode = 'story' | 'classroom' | 'lab';
export type Polarization = 'low' | 'medium' | 'high';

export type FestivalStep =
  | 'welcome'
  | 'setup'
  | 'issues'
  | 'candidates'
  | 'events'
  | 'systems'
  | 'results'
  | 'reflection';

export type VotingSystemId =
  | 'plurality'
  | 'runoff'
  | 'irv'
  | 'approval'
  | 'score'
  | 'star'
  | 'borda'
  | 'condorcet'
  | 'council';

/**
 * Internal value axes. Each score runs -3..+3.
 * Children never see these labels; the UI translates them
 * into friendly words like "freedom", "sharing", or "teamwork".
 *
 * freedom:    -3 clear shared rules  <-> +3 personal freedom
 * support:    -3 reward effort       <-> +3 shared support
 * change:     -3 tradition/stability <-> +3 fast change
 * global:     -3 local focus         <-> +3 welcoming cooperation
 * nature:     -3 building projects   <-> +3 protecting nature
 * services:   -3 individual choice   <-> +3 public services
 * facts:      -3 emotional promises  <-> +3 fact-checking
 * compromise: -3 strong leadership   <-> +3 compromise
 */
export type AxisId =
  | 'freedom'
  | 'support'
  | 'change'
  | 'global'
  | 'nature'
  | 'services'
  | 'facts'
  | 'compromise';

export type AxisScores = Record<AxisId, number>;

export interface PolicyEffects {
  budgetCost: number; // 0..5 acorns
  fairness: number;
  freedom: number;
  order: number;
  environment: number;
  safety: number;
  happiness: number;
  evidence: number;
  inclusion: number;
  building: number;
  cooperation: number;
  rightsRisk: number; // 0..3
  overPromiseRisk: number; // 0..3
}

export interface Policy {
  id: string;
  candidateId: string;
  issueId: string;
  title: string;
  promise: string; // full sentence for ages 9+
  promiseKid: string; // short sentence for ages 6-8
  helps: string;
  tradeoff: string;
  concern: string;
  effects: PolicyEffects;
}

export interface Candidate {
  id: string;
  name: string;
  species: string;
  color: string; // badge accent color
  slogan: string;
  values: string[]; // child-friendly value words
  axes: AxisScores;
  strength: string;
  tradeoff: string;
  visual: string; // accessible description of the avatar
  overPromiseRisk: number; // 0..3
  budgetCare: number; // 0..3, how carefully they budget
  policies: Policy[];
}

export interface Issue {
  id: string;
  title: string;
  emoji: string;
  question: string;
  story: string;
  conflict: string; // value conflict tags, child friendly
  realWorld: string; // Teacher Mode only
  axes: Partial<AxisScores>; // which value axes this issue activates
  groupIds: string[]; // voter groups who care most
}

/** Forest job families, used by the neighborhood mixer. */
export type JobFamily = 'builders' | 'helpers' | 'checkers';

export interface VoterGroup {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cares: string;
  /** Kid-friendly explanation of what this group needs and why. */
  needs: string;
  axes: AxisScores;
  issueIds: string[];
  /** 0..1 — higher tolerance widens the approval list */
  tolerance: number;
  /** Demographic tags for the Forest Neighborhood mixer. */
  generation: 'young' | 'grown' | 'elder';
  pantry: 'small' | 'okay' | 'full';
  roots: 'deep' | 'new';
  jobFamily: JobFamily | null;
}

/**
 * Who lives in the forest. 'random' = a surprise seeded mix (the default);
 * 'custom' = the player designs the neighborhood. Dials run -1..0..+1.
 */
export interface VoterMix {
  mode: 'random' | 'custom';
  /** -1 more young cubs & students, +1 more wise elders */
  generations: -1 | 0 | 1;
  /** -1 more nearly-empty pantries, +1 more full pantries */
  pantries: -1 | 0 | 1;
  /** -1 mostly long-time families, +1 many new families moving in */
  roots: -1 | 0 | 1;
  /** Job families that are extra common in this forest. */
  jobs: JobFamily[];
}

export const DEFAULT_VOTER_MIX: VoterMix = {
  mode: 'random',
  generations: 0,
  pantries: 0,
  roots: 0,
  jobs: [],
};

export interface Voter {
  id: string;
  groupId: string;
  axes: AxisScores;
  favoriteIssues: string[];
}

export interface Ballot {
  voterId: string;
  voterGroupId: string;
  /** Full ordered list of candidate ids, favorite first */
  ranking: string[];
  /** Candidate ids the voter finds acceptable */
  approvals: string[];
  /** candidate id -> 0..5 stars */
  scores: Record<string, number>;
  favoriteIssues: string[];
}

export interface CampaignEvent {
  id: string;
  title: string;
  emoji: string;
  text: string;
  explanation: string;
  /** issue id -> importance multiplier bonus (e.g. 0.6 = +60%) */
  issueBoost?: Record<string, number>;
  trustEffect?: 'factCheck' | 'budgetBook' | 'randomBoost' | 'megaphone';
}

export interface EventChange {
  label: string;
  before?: number;
  after?: number;
}

export interface DrawnEvent {
  event: CampaignEvent;
  changes: EventChange[];
}

export interface ElectionSettings {
  ageMode: AgeMode;
  candidateCount: number;
  issueCount: number;
  voterCount: number;
  polarization: Polarization;
  campaignEvents: boolean;
  budgetLimits: boolean;
  charterReminders: boolean;
  teacherMode: boolean;
  seed: string;
  systems: VotingSystemId[];
  /** Who lives in the forest (the neighborhood mixer). */
  voterMix: VoterMix;
}

export interface GameState {
  settings: ElectionSettings;
  candidates: Candidate[];
  issues: Issue[];
  voterGroups: VoterGroup[];
  voters: Voter[];
  /** Generated once per election and reused by every voting rule. */
  ballots: Ballot[];
  drawnEvents: DrawnEvent[];
  issueWeights: Record<string, number>;
  isTeaching: boolean;
}

export interface RoundCount {
  candidateId: string;
  value: number;
  pct?: number;
  eliminated?: boolean;
  note?: string;
}

export interface VotingRound {
  title: string;
  description: string;
  counts: RoundCount[];
}

export interface ElectionResult {
  systemId: VotingSystemId;
  systemName: string;
  winnerIds: string[];
  winnerLabel: string;
  rounds: VotingRound[];
  /** headline number per candidate for quick display */
  counts: Record<string, number>;
  countLabel: string;
  explanationForKids: string;
  strengths: string[];
  weaknesses: string[];
  tieBreakInfo?: string;
  /** condorcet only: pairwise[a][b] = voters preferring a over b */
  pairwise?: Record<string, Record<string, number>>;
  copelandFallback?: boolean;
  /** council only: candidate id -> seats */
  seats?: Record<string, number>;
}

export interface CandidateMetrics {
  candidateId: string;
  firstChoicePct: number;
  approvalPct: number;
  avgScore: number;
  pairwiseWins: number;
  minorityDissatisfactionPct: number;
}

export interface ResultMetric {
  id: string;
  kidLabel: string;
  teacherLabel: string;
}

export interface PassportSticker {
  id: string;
  label: string;
  emoji: string;
  hint: string;
}

export interface MachineDemoStep {
  title: string;
  text: string;
}
