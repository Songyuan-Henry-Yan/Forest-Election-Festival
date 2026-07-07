import type { AgeMode, ElectionSettings } from '../types/game';

export const ageRanges: Record<AgeMode, { label: string; ages: string; defaultIssueCount: number; description: string }> = {
  little: { label: 'Little Forest Voters', ages: 'Ages 6–8', defaultIssueCount: 5, description: 'Simple words, big icons, and five friendly issues.' },
  trail: { label: 'Trail Council Voters', ages: 'Ages 9–11', defaultIssueCount: 7, description: 'Short explanations with icons and more choices to compare.' },
  assembly: { label: 'Great Forest Assembly', ages: 'Ages 12–14', defaultIssueCount: 9, description: 'More details, trade-offs, and longer classroom discussion.' }
};

export const defaultSettings: ElectionSettings = {
  mode: 'Solo',
  candidateType: 'Animal NPC candidates',
  compareMode: 'Run same election under multiple voting systems',
  campaignTone: 'Friendly',
  rallyLength: 'Standard',
  approvalStrictness: 'Balanced',
  candidateBalance: 'Different winners across systems',
  classPrivacy: 'Team names',
  customIssueCount: false,
  issueCount: 5
};

export const moderatorChallenges = [
  'Your plan helps some animals, but who might be left out?',
  'Your plan sounds fun, but how will the forest pay for it?',
  'Your plan is safe, but does it create too many rules?',
  'Your plan protects nature, but what about animals who need new homes?',
  'Your plan gives more freedom, but what if stronger animals make unfair choices?'
];
