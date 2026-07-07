import type { Candidate } from '../types/game';
const avatar=(emoji:string,bg:string)=>`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img"><circle cx="60" cy="60" r="54" fill="${bg}"/><text x="60" y="74" font-size="54" text-anchor="middle">${emoji}</text></svg>`;
export const candidates:Candidate[]=[
{id:'flynn',name:'Flynn Fox',species:'Fox',slogan:'More choices, fewer orders!',values:['freedom','quick choices'],strengths:['Brings energy and choices'],tradeoffs:['May move before checking every detail'],avatar:avatar('🦊','#ffd19c'),axis:{freedom:5,safety:2,care:2,fairness:3,change:5,tradition:1,environment:2,facts:3}},
{id:'leo',name:'Leo Lion',species:'Lion',slogan:'Clear rules keep the forest safe!',values:['safety','order'],strengths:['Explains rules clearly'],tradeoffs:['Can be too strict for some animals'],avatar:avatar('🦁','#f6c66f'),axis:{freedom:2,safety:5,care:3,fairness:3,change:2,tradition:4,environment:2,facts:3}},
{id:'bella',name:'Bella Beaver',species:'Beaver',slogan:'Let’s fix the bridge before we make big promises!',values:['budget','building'],strengths:['Practical planner'],tradeoffs:['May focus on repairs before big dreams'],avatar:avatar('🦫','#c58b5a'),axis:{freedom:3,safety:4,care:3,fairness:3,change:3,tradition:3,environment:3,facts:4}},
{id:'dolly',name:'Dolly Dolphin',species:'Dolphin',slogan:'We move forward when we swim together!',values:['teamwork','compromise'],strengths:['Builds broad agreement'],tradeoffs:['Compromise can feel slow'],avatar:avatar('🐬','#9bd9ff'),axis:{freedom:3,safety:3,care:4,fairness:4,change:4,tradition:2,environment:4,facts:4}},
{id:'penny',name:'Penny Panda',species:'Panda',slogan:'No animal should be left behind!',values:['care','inclusion'],strengths:['Looks out for smaller groups'],tradeoffs:['Plans may need more snacks and time'],avatar:avatar('🐼','#d8e8d0'),axis:{freedom:3,safety:3,care:5,fairness:5,change:3,tradition:2,environment:4,facts:3}},
{id:'olive',name:'Olive Owl',species:'Owl',slogan:'Check the facts before we decide!',values:['facts','learning'],strengths:['Careful with information'],tradeoffs:['Research can take patience'],avatar:avatar('🦉','#c7b299'),axis:{freedom:3,safety:4,care:3,fairness:4,change:3,tradition:3,environment:4,facts:5}},
{id:'tata',name:'Tata Turtle',species:'Turtle',slogan:'Slowly, fairly, and with a share for everyone!',values:['fairness','patience'],strengths:['Thinks about fairness'],tradeoffs:['Moves slowly'],avatar:avatar('🐢','#a7d68c'),axis:{freedom:2,safety:4,care:4,fairness:5,change:1,tradition:4,environment:4,facts:4}},
{id:'ruby',name:'Ruby Rabbit',species:'Rabbit',slogan:'The old council is too slow. Let’s change things now!',values:['change','speed'],strengths:['Gets animals excited'],tradeoffs:['Fast change can surprise others'],avatar:avatar('🐰','#ffc5d9'),axis:{freedom:4,safety:2,care:3,fairness:3,change:5,tradition:1,environment:3,facts:2}},
{id:'ella',name:'Ella Elephant',species:'Elephant',slogan:'Remember the past, plan for the future!',values:['memory','planning'],strengths:['Learns from history'],tradeoffs:['May protect old ways'],avatar:avatar('🐘','#cfd4da'),axis:{freedom:2,safety:4,care:4,fairness:3,change:2,tradition:5,environment:3,facts:4}},
{id:'rocky',name:'Rocky Raccoon',species:'Raccoon',slogan:'If the old rules don’t work, let’s invent better ones!',values:['creativity','experiments'],strengths:['Invents new solutions'],tradeoffs:['Experiments do not always work'],avatar:avatar('🦝','#bfc0c0'),axis:{freedom:4,safety:2,care:3,fairness:3,change:5,tradition:1,environment:3,facts:3}}
];

export const studentTeamCandidates: Candidate[] = [
  {
    id: 'team-owl',
    name: 'Team Owl',
    species: 'Owl',
    slogan: 'Listen carefully, check the facts, then choose wisely!',
    values: ['facts', 'listening', 'compromise'],
    strengths: ['Good backup choice for many voters', 'Explains tradeoffs clearly'],
    tradeoffs: ['Can seem too cautious or slow'],
    avatar: '🦉',
    axis: { freedom: 3, safety: 4, care: 3, fairness: 4, change: 3, tradition: 3, environment: 4, facts: 5 },
    roleCard: 'Student team focused on evidence, listening, and balanced choices.',
    perspective: 'Compromise and evidence'
  },
  {
    id: 'team-fox',
    name: 'Team Fox',
    species: 'Fox',
    slogan: 'More choices, more ideas, more forest freedom!',
    values: ['freedom', 'creativity', 'local choice'],
    strengths: ['Exciting first-choice support', 'Encourages new ideas'],
    tradeoffs: ['Some voters may think the plans are risky'],
    avatar: '🦊',
    axis: { freedom: 5, safety: 2, care: 2, fairness: 3, change: 5, tradition: 1, environment: 2, facts: 3 },
    roleCard: 'Student team focused on freedom, invention, and local choice.',
    perspective: 'Freedom and invention'
  },
  {
    id: 'team-turtle',
    name: 'Team Turtle',
    species: 'Turtle',
    slogan: 'Move carefully, share fairly, protect the forest!',
    values: ['fairness', 'nature', 'patience'],
    strengths: ['Strong with fairness and environment voters', 'Thinks about smaller animals'],
    tradeoffs: ['Some voters may think the plans move slowly'],
    avatar: '🐢',
    axis: { freedom: 2, safety: 4, care: 4, fairness: 5, change: 1, tradition: 4, environment: 5, facts: 4 },
    roleCard: 'Student team focused on fairness, nature, and careful decisions.',
    perspective: 'Nature protection and fairness'
  },
  {
    id: 'team-bear',
    name: 'Team Bear',
    species: 'Bear',
    slogan: 'Safe paths, strong bridges, and help when animals need it!',
    values: ['safety', 'services', 'dependability'],
    strengths: ['Broadly acceptable to many voters', 'Strong on safety and shared services'],
    tradeoffs: ['May not be many voters’ most exciting first choice'],
    avatar: '🐻',
    axis: { freedom: 2, safety: 5, care: 4, fairness: 3, change: 2, tradition: 4, environment: 3, facts: 3 },
    roleCard: 'Student team focused on safety, services, and dependable leadership.',
    perspective: 'Safety and shared services'
  },
  {
    id: 'team-monkey',
    name: 'Team Monkey',
    species: 'Monkey',
    slogan: 'Let students speak, play, build, and celebrate together!',
    values: ['fun', 'youth voice', 'creativity'],
    strengths: ['Popular with playful voters', 'Makes the campaign energetic'],
    tradeoffs: ['Some voters may worry about seriousness or budget'],
    avatar: '🐒',
    axis: { freedom: 4, safety: 2, care: 3, fairness: 3, change: 5, tradition: 1, environment: 3, facts: 2 },
    roleCard: 'Student team focused on youth voice, festivals, and creativity.',
    perspective: 'Youth voice and fun'
  }
];
