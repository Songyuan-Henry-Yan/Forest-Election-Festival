// The 12 issue cards on the Issue Trail.
// Real-world connections appear only in Teacher Mode.

import type { Issue } from '../types/game';

export const ISSUE_POOL: Issue[] = [
  {
    id: 'homework',
    title: 'Homework and Free Time',
    emoji: '📚',
    question:
      'How much work should young animals have to do each day, and should they get to choose some of their tasks?',
    story:
      'The bunny students say practice helps them learn, but they also want time to hop and play.',
    conflict: 'freedom vs. practice • choice vs. shared rules',
    realWorld: 'Work rules, education, personal freedom, and responsibility.',
    axes: { freedom: 3, services: -1 },
    groupIds: ['bunnies', 'turtles'],
  },
  {
    id: 'snackshare',
    title: 'Snack Sharing',
    emoji: '🍪',
    question:
      'If some animals have many snacks and others have none, should the forest share?',
    story:
      'Some squirrels gathered big piles of acorns this year. Some mouse families have almost none.',
    conflict: 'rewarding effort vs. basic fairness',
    realWorld: 'Inequality, taxes, redistribution, and public support.',
    axes: { support: 3, services: 2 },
    groupIds: ['mice', 'squirrels', 'bees'],
  },
  {
    id: 'snackprices',
    title: 'Snacks Are Getting Expensive',
    emoji: '💰',
    question:
      'What should the forest do when cookies, nuts, and fish crackers cost more than before?',
    story:
      'Last spring one acorn bought two cookies. Now it buys only one. Families are worried.',
    conflict: 'market freedom vs. public help • budget limits vs. support',
    realWorld: 'Inflation, cost of living, and economic policy.',
    axes: { support: 2, freedom: -1, facts: 1 },
    groupIds: ['squirrels', 'mice', 'bees'],
  },
  {
    id: 'nurse',
    title: 'Forest Nurse Station',
    emoji: '🩹',
    question:
      'Should every animal be able to visit the nurse when they are hurt or sick?',
    story:
      'Nurse Nightingale Newt patches scraped paws all day, but the station is small and visits cost acorns.',
    conflict: 'care for everyone vs. cost',
    realWorld: 'Health care access and public services.',
    axes: { services: 3, support: 2 },
    groupIds: ['mice', 'turtles', 'hedgehogs'],
  },
  {
    id: 'newanimals',
    title: 'New Animals in the Forest',
    emoji: '🦔',
    question:
      'How should the forest welcome new animals while keeping rules clear for everyone?',
    story:
      'Hedgehog families just arrived from the far meadow. They want to join school and make friends.',
    conflict: 'welcoming cooperation vs. local priority • inclusion vs. order',
    realWorld: 'Immigration, community belonging, integration, and rules.',
    axes: { global: 3, change: 1 },
    groupIds: ['hedgehogs', 'deer', 'turtles'],
  },
  {
    id: 'river',
    title: 'The River and the Old Trees',
    emoji: '🌳',
    question:
      'Should the forest build more playgrounds, or protect more trees and clean water?',
    story:
      'The frogs say the river is getting cloudy. The beavers say a new playground would be wonderful.',
    conflict: 'building vs. environment • short-term fun vs. long-term safety',
    realWorld: 'Climate, pollution, conservation, and development.',
    axes: { nature: 3, change: -1 },
    groupIds: ['frogs', 'beavers', 'owls'],
  },
  {
    id: 'safety',
    title: 'Playground Safety',
    emoji: '🛝',
    question:
      'What should the forest do when animals argue or bring unsafe toys to the playground?',
    story:
      'Two chipmunks argued over a wobbly slingshot toy last week, and some little ones felt scared.',
    conflict: 'more rules and patrols vs. more mediation and care',
    realWorld: 'Public safety, conflict prevention, and school safety.',
    axes: { freedom: -3, compromise: 1 },
    groupIds: ['turtles', 'mice', 'deer'],
  },
  {
    id: 'robot',
    title: 'The Robot Parrot',
    emoji: '🤖',
    question:
      'The Robot Parrot can help with homework, but sometimes it makes things up. Who should check it?',
    story:
      'The Robot Parrot told a duckling that fish can fly to the moon. The duckling believed it.',
    conflict: 'innovation vs. oversight • speed vs. accuracy',
    realWorld:
      'Artificial intelligence, misinformation, fact-checking, and technology rules.',
    axes: { facts: 3, change: 1 },
    groupIds: ['owls', 'bunnies'],
  },
  {
    id: 'megaphone',
    title: 'Big Megaphone Ads',
    emoji: '📣',
    question:
      'Is it fair if animals with more coins can buy louder campaign ads?',
    story:
      'A wealthy bear bought the three biggest megaphones in the forest. Now his favorite ideas are the loudest.',
    conflict: 'free expression vs. equal influence',
    realWorld: 'Money in politics, campaign influence, and political advertising.',
    axes: { facts: 2, support: 1 },
    groupIds: ['owls', 'deer'],
  },
  {
    id: 'bridge',
    title: 'Berry Bridge and Neighboring Kingdoms',
    emoji: '🌉',
    question:
      'Should the forest trade and cooperate with nearby kingdoms, or focus mostly on its own animals?',
    story:
      'The meadow kingdom grows sweet berries. The forest grows crunchy nuts. Should they trade more?',
    conflict: 'local priority vs. cooperation',
    realWorld: 'Trade, diplomacy, international cooperation, and borders.',
    axes: { global: 3, change: 0 },
    groupIds: ['deer', 'squirrels', 'beavers'],
  },
  {
    id: 'teachertime',
    title: 'Teacher Time and Learning Tools',
    emoji: '✏️',
    question: 'How should teacher time, books, and learning tools be shared?',
    story:
      'Some classrooms have shiny new books. Others share one old atlas with a torn map of the pond.',
    conflict: 'help by need vs. reward by performance',
    realWorld: 'Education equity and resource allocation.',
    axes: { support: 2, services: 2 },
    groupIds: ['bunnies', 'hedgehogs', 'mice'],
  },
  {
    id: 'budget',
    title: 'The Forest Budget',
    emoji: '🌰',
    question:
      'The forest has only so many acorns to spend. What should matter most?',
    story:
      'Treasurer Badger counted the acorn vault twice: there is enough for some plans, but not all of them.',
    conflict: 'popular promises vs. sustainable planning',
    realWorld: 'Budgets, taxes, deficits, and public spending.',
    axes: { facts: 2, services: -1 },
    groupIds: ['beavers', 'squirrels', 'owls'],
  },
];

/** Fixed issues used by the teaching example. */
export const TEACHING_ISSUE_IDS = [
  'snackprices',
  'river',
  'nurse',
  'safety',
  'budget',
];
