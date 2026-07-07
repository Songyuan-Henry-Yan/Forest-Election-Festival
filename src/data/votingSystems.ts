// Descriptions of each counting machine in the arcade.

import type { AgeMode, VotingSystemId } from '../types/game';

export interface VotingSystemInfo {
  id: VotingSystemId;
  kidName: string;
  teacherName: string;
  machineName: string;
  machineEmoji: string;
  metaphor: string;
  kidExplanation: string;
  strength: string;
  weakness: string;
  difficulty: number; // 1..5 counting difficulty stars
  realWorld: string; // Teacher Mode / lab mode connection
}

export const VOTING_SYSTEMS: VotingSystemInfo[] = [
  {
    id: 'plurality',
    kidName: 'Choose-One Voting',
    teacherName: 'Plurality (First Past the Post)',
    machineName: 'Acorn Basket Machine',
    machineEmoji: '🧺',
    metaphor: 'Each ballot puts one acorn into the first-choice basket.',
    kidExplanation:
      'Each animal puts one acorn in one candidate’s basket. The basket with the most acorns wins.',
    strength: 'Very simple to vote and count.',
    weakness:
      'With many candidates, the winner may have less than half the votes, and similar candidates can split support.',
    difficulty: 1,
    realWorld:
      'Used in most U.S. general elections and in countries like the United Kingdom and Canada.',
  },
  {
    id: 'runoff',
    kidName: 'Two-Round Runoff',
    teacherName: 'Two-Round Runoff',
    machineName: 'Two Bridge Machine',
    machineEmoji: '🌉',
    metaphor:
      'First everyone races. If nobody gets more than half, the top two cross the bridge for a final round.',
    kidExplanation:
      'First, everyone votes. If nobody has more than half, the top two animals have a final round.',
    strength: 'The final winner gets majority support in the second round.',
    weakness: 'A broadly liked candidate may be eliminated before the final.',
    difficulty: 2,
    realWorld:
      'Used for presidential elections in France and for runoff elections in Georgia and Louisiana.',
  },
  {
    id: 'irv',
    kidName: 'Ranked Choice Voting',
    teacherName: 'Ranked Choice Voting (Instant Runoff)',
    machineName: 'Leaf Transfer Machine',
    machineEmoji: '🍃',
    metaphor:
      'If your favorite cannot win, your leaf ballot moves to your next favorite.',
    kidExplanation:
      'If your favorite animal cannot win, your vote can move to your next favorite animal.',
    strength: 'Lets voters rank choices and reduces fear of “wasting” a vote.',
    weakness:
      'Counting is more complex, and the winner may not beat everyone one-on-one.',
    difficulty: 4,
    realWorld:
      'Used in Maine, Alaska, New York City primaries, and Australia.',
  },
  {
    id: 'approval',
    kidName: 'Approval Voting',
    teacherName: 'Approval Voting',
    machineName: 'Smile Sticker Machine',
    machineEmoji: '😊',
    metaphor: 'Put a smile sticker on every candidate who would be okay.',
    kidExplanation:
      'You can put a smile sticker on every candidate you think would be okay. The most stickers wins.',
    strength: 'Simple, and voters can support more than one candidate.',
    weakness: 'Does not show the difference between “favorite” and “just okay.”',
    difficulty: 1,
    realWorld: 'Used in Fargo, North Dakota and St. Louis, Missouri.',
  },
  {
    id: 'score',
    kidName: 'Score Voting',
    teacherName: 'Score Voting (Range Voting)',
    machineName: 'Star Jar Machine',
    machineEmoji: '⭐',
    metaphor: 'Give each candidate 0–5 stars. The most stars wins.',
    kidExplanation:
      'Give each candidate a star rating from 0 to 5. The candidate with the most stars wins.',
    strength: 'Shows how strongly voters feel.',
    weakness: 'Some voters may give only 5s and 0s.',
    difficulty: 2,
    realWorld:
      'Similar to star ratings for books and movies; studied by voting researchers.',
  },
  {
    id: 'star',
    kidName: 'STAR Voting',
    teacherName: 'STAR Voting (Score Then Automatic Runoff)',
    machineName: 'Star + Bridge Machine',
    machineEmoji: '🌟',
    metaphor:
      'First count the stars. Then the top two have an automatic final round.',
    kidExplanation:
      'First, count the stars. Then the top two have an automatic final round.',
    strength: 'Combines star power with a final head-to-head matchup.',
    weakness: 'More complex than approval voting.',
    difficulty: 4,
    realWorld:
      'A newer method piloted in parts of Oregon and studied by election reformers.',
  },
  {
    id: 'borda',
    kidName: 'Ranking Ladder Count',
    teacherName: 'Borda Count',
    machineName: 'Ranking Ladder Machine',
    machineEmoji: '🪜',
    metaphor: 'Higher rankings earn more points.',
    kidExplanation:
      'Higher rankings earn more points. Add up all the points to find the winner.',
    strength: 'Rewards candidates ranked well by many voters.',
    weakness: 'Can be affected by strategic ranking.',
    difficulty: 3,
    realWorld:
      'Used in Slovenia for some seats, in sports awards, and in the Eurovision Song Contest.',
  },
  {
    id: 'condorcet',
    kidName: 'Friendly Matchups',
    teacherName: 'Condorcet Method (Copeland fallback)',
    machineName: 'Friendly Matchup Arena',
    machineEmoji: '🤝',
    metaphor: 'Every pair of animals has a one-on-one matchup.',
    kidExplanation:
      'Every pair of animals has a friendly matchup. An animal who beats every other animal one-on-one is the strongest majority choice.',
    strength: 'Finds a candidate who can beat every other one head-to-head.',
    weakness: 'Sometimes there is a cycle: A beats B, B beats C, C beats A.',
    difficulty: 5,
    realWorld:
      'Named for the Marquis de Condorcet; used by some organizations and studied in social choice theory.',
  },
  {
    id: 'council',
    kidName: 'Forest Council Seats',
    teacherName: 'Proportional Representation (D’Hondt)',
    machineName: 'Council Tree Machine',
    machineEmoji: '🌲',
    metaphor:
      'Instead of one president, seven council seats are shared so more voices can be represented.',
    kidExplanation:
      'Instead of picking one president, the forest picks a council of 7 so more groups can have a voice.',
    strength: 'Helps more groups be represented.',
    weakness: 'The council may need to make deals, and decisions can be slower.',
    difficulty: 4,
    realWorld:
      'Proportional systems elect parliaments in many countries, including Germany, Spain, and the Netherlands.',
  },
];

export function systemInfo(id: VotingSystemId): VotingSystemInfo {
  return VOTING_SYSTEMS.find((s) => s.id === id)!;
}

export function defaultSystemsFor(mode: AgeMode): VotingSystemId[] {
  if (mode === 'story') return ['plurality', 'approval', 'irv'];
  if (mode === 'classroom')
    return ['plurality', 'runoff', 'irv', 'approval', 'borda'];
  return [
    'plurality',
    'runoff',
    'irv',
    'approval',
    'score',
    'star',
    'borda',
    'condorcet',
    'council',
  ];
}

export function defaultSettingsFor(mode: AgeMode): {
  candidateCount: number;
  issueCount: number;
  voterCount: number;
} {
  if (mode === 'story')
    return { candidateCount: 3, issueCount: 4, voterCount: 40 };
  if (mode === 'classroom')
    return { candidateCount: 5, issueCount: 6, voterCount: 100 };
  return { candidateCount: 7, issueCount: 9, voterCount: 150 };
}
