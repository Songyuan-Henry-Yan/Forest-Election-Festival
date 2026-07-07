import type { VoterGroup } from '../types/game';
const axis=(freedom:number,safety:number,care:number,fairness:number,change:number,tradition:number,environment:number,facts:number)=>({freedom,safety,care,fairness,change,tradition,environment,facts});
export const voterGroups:VoterGroup[]=[
{id:'squirrels',name:'Squirrel Shopkeepers',description:'Care about prices, trade, and busy market days.',axis:axis(4,3,2,3,4,2,2,4),issueIds:['prices','bridge','budget']},
{id:'mice',name:'Mouse Families',description:'Want care, safety, and fair snacks.',axis:axis(2,4,5,5,2,3,3,3),issueIds:['snacks','nurse','teacher']},
{id:'frogs',name:'Frog Environment Club',description:'Protect the river and old trees.',axis:axis(3,3,4,4,3,2,5,4),issueIds:['river','robot','budget']},
{id:'turtles',name:'Turtle Grandparents',description:'Like patient plans and forest traditions.',axis:axis(2,5,4,4,1,5,4,4),issueIds:['playground','nurse','newcomers']},
{id:'bunnies',name:'Bunny Students',description:'Want free time, fun, and learning tools.',axis:axis(5,2,3,3,5,1,3,2),issueIds:['homework','playground','teacher']},
{id:'hedgehogs',name:'New Hedgehog Neighbors',description:'Hope to be welcomed and treated fairly.',axis:axis(3,3,5,5,4,1,3,3),issueIds:['newcomers','snacks','teacher']},
{id:'bees',name:'Bee Workers',description:'Care about fair work and useful plans.',axis:axis(3,4,3,4,3,3,3,4),issueIds:['budget','prices','robot']},
{id:'owls',name:'Owl Reporters',description:'Ask for facts and honest messages.',axis:axis(4,3,3,4,3,3,3,5),issueIds:['ads','robot','budget']},
{id:'beavers',name:'Beaver Builders',description:'Want bridges, repairs, and practical budgets.',axis:axis(3,4,3,3,4,3,2,4),issueIds:['bridge','budget','river']},
{id:'deer',name:'Deer Peace Team',description:'Prefer calm teamwork and safety.',axis:axis(2,4,4,5,2,4,4,4),issueIds:['playground','newcomers','ads']}
];
