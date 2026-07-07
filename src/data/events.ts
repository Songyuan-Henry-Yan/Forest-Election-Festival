// Campaign event cards drawn at the Parrot News Stand.

import type { CampaignEvent } from '../types/game';

export const EVENT_POOL: CampaignEvent[] = [
  {
    id: 'heatwave',
    title: 'Forest Heat Wave',
    emoji: '☀️',
    text: 'A hot week dries up part of the pond. Animals start asking more questions about trees, shade, and clean water.',
    explanation:
      'When something big happens, voters can start caring more about certain issues. This week, nature questions matter more.',
    issueBoost: { river: 0.7, budget: 0.2 },
  },
  {
    id: 'prices',
    title: 'Snack Prices Jump',
    emoji: '📈',
    text: 'Cookies, nuts, and fish crackers cost more than last week. Families want to know what candidates will do.',
    explanation:
      'When prices go up, voters pay extra attention to plans about snacks, budgets, and helping families.',
    issueBoost: { snackprices: 0.7, budget: 0.4, snackshare: 0.3 },
  },
  {
    id: 'robotwrong',
    title: 'Robot Parrot Gets It Wrong',
    emoji: '🤖',
    text: 'The Robot Parrot gives three wrong homework answers in one day. Owl reporters ask for better checking rules.',
    explanation:
      'A mistake by the Robot Parrot makes voters care more about fact-checking and technology rules.',
    issueBoost: { robot: 0.8, megaphone: 0.2 },
  },
  {
    id: 'megaphone',
    title: 'Big Bear Buys Megaphone Ads',
    emoji: '📣',
    text: 'A wealthy bear buys very loud megaphone ads. Some animals hear the message; others cover their ears.',
    explanation:
      'Loud ads can make a candidate easier to notice — but some voters get annoyed by all the noise.',
    issueBoost: { megaphone: 0.7 },
    trustEffect: 'megaphone',
  },
  {
    id: 'bridgejam',
    title: 'Berry Bridge Traffic Jam',
    emoji: '🌉',
    text: 'The bridge to the neighboring kingdom gets crowded. Animals debate whether to cooperate, build more paths, or set limits.',
    explanation:
      'A crowded bridge makes voters think harder about trading and cooperating with neighbors.',
    issueBoost: { bridge: 0.7, newanimals: 0.2 },
  },
  {
    id: 'unsafetoy',
    title: 'Unsafe Toy Argument',
    emoji: '🧸',
    text: 'A playground argument about unsafe toys makes families ask how the forest should prevent future trouble.',
    explanation:
      'After an argument on the playground, safety questions feel more important to many families.',
    issueBoost: { safety: 0.7, homework: 0.1 },
  },
  {
    id: 'factcheck',
    title: 'Owl Fact-Check Report',
    emoji: '🦉',
    text: 'The owl reporters compare campaign promises with the acorn budget.',
    explanation:
      'Candidates who promised more than the budget allows lose a little trust. Candidates who checked their facts gain a little trust.',
    trustEffect: 'factCheck',
  },
  {
    id: 'volunteers',
    title: 'Sticker Volunteers',
    emoji: '🍃',
    text: 'Friendly volunteers hand out leaf stickers and explain their candidate’s ideas.',
    explanation:
      'A little friendly campaigning gives one candidate a small boost in popularity.',
    trustEffect: 'randomBoost',
  },
  {
    id: 'budgetbook',
    title: 'Budget Book Opens',
    emoji: '📖',
    text: 'The forest treasurer opens the budget book so everyone can see how many acorns are available.',
    explanation:
      'When voters can see the real budget, candidates who plan carefully gain a little trust.',
    issueBoost: { budget: 0.4 },
    trustEffect: 'budgetBook',
  },
  {
    id: 'newfamilies',
    title: 'New Neighbor Families Arrive',
    emoji: '🏡',
    text: 'New animal families arrive at the edge of the forest. Voters ask how the community should welcome them.',
    explanation:
      'New neighbors make voters think more about welcoming, rules, and belonging.',
    issueBoost: { newanimals: 0.7, teachertime: 0.2 },
  },
];
