// Generates three coherent campaign promises per candidate from local
// templates — no external AI, no network.

import type { AxisScores, Candidate, Issue, Policy, PolicyEffects } from '../types/game';
import type { CandidateSeed } from '../data/candidates';
import { templatesFor, type PolicyTemplate } from '../data/policyTemplates';
import type { Rng } from './random';

/**
 * The forest's acorn budget grows with the size of a platform: the classic
 * 3-promise plan gets 12 acorns, and each extra promise adds 2 more.
 * Candidates who consistently pick expensive ideas still spill over the tray.
 */
export function acornBudgetFor(promiseCount: number): number {
  return Math.round(12 + 2 * (promiseCount - 3));
}

const ZERO_EFFECTS: PolicyEffects = {
  budgetCost: 0,
  fairness: 0,
  freedom: 0,
  order: 0,
  environment: 0,
  safety: 0,
  happiness: 0,
  evidence: 0,
  inclusion: 0,
  building: 0,
  cooperation: 0,
  rightsRisk: 0,
  overPromiseRisk: 0,
};

/** How strongly a candidate leans toward an issue's "A" pole (-1..+1). */
export function stanceOn(axes: AxisScores, issue: Issue): number {
  let dot = 0;
  let mag = 0;
  for (const [axis, dir] of Object.entries(issue.axes)) {
    const d = dir ?? 0;
    dot += (axes[axis as keyof AxisScores] / 3) * (d / 3);
    mag += Math.abs(d / 3);
  }
  return mag === 0 ? 0 : dot / mag;
}

function pickVariant(stance: number): 'A' | 'B' | 'M' {
  if (stance > 0.25) return 'A';
  if (stance < -0.25) return 'B';
  return 'M';
}

function costWord(cost: number): string {
  if (cost <= 0) return 'almost no acorns, just some time';
  if (cost <= 2) return 'some acorns and time';
  if (cost <= 3) return 'quite a few acorns';
  return 'many acorns from the forest budget';
}

function buildPolicy(
  cand: CandidateSeed,
  issue: Issue,
  template: PolicyTemplate,
): Policy {
  const value = cand.values[0];
  const effects: PolicyEffects = { ...ZERO_EFFECTS, ...template.effects };
  // A candidate who tends to overpromise makes promises a bit riskier.
  effects.overPromiseRisk = Math.min(
    3,
    effects.overPromiseRisk + (cand.overPromiseRisk >= 2 ? 1 : 0),
  );
  const promise =
    `I believe in ${value}. On ${issue.title.toLowerCase()}, I will ` +
    `${template.action}. This helps ${template.helps}, but ` +
    `${template.tradeoff}, and ${template.worriers} may worry about ` +
    `${template.concern}.`;
  const promiseKid =
    `I want to ${template.action}. This helps ${template.helps}, ` +
    `but it uses ${costWord(effects.budgetCost)}.`;
  return {
    id: `${cand.id}-${issue.id}`,
    candidateId: cand.id,
    issueId: issue.id,
    title: template.title,
    promise,
    promiseKid,
    helps: template.helps,
    tradeoff: template.tradeoff,
    concern: `${template.worriers} may worry about ${template.concern}`,
    effects,
  };
}

/**
 * Pick the issues the candidate cares most about and generate promises.
 * Story mode keeps 3 flagship promises; older modes address more issues
 * (the Voting Systems Lab covers every selected issue).
 */
export function generatePolicies(
  cand: CandidateSeed,
  issues: Issue[],
  rng: Rng,
  count = 3,
): Policy[] {
  const scored = issues
    .map((issue) => ({
      issue,
      score: Math.abs(stanceOn(cand.axes, issue)) + rng() * 0.35,
    }))
    .sort((a, b) => b.score - a.score);
  const chosen = scored.slice(0, Math.max(1, Math.min(count, scored.length)));
  return chosen.map(({ issue }) => {
    const variant = pickVariant(stanceOn(cand.axes, issue));
    const template =
      templatesFor(issue.id).find((t) => t.variant === variant) ??
      templatesFor(issue.id)[0];
    return buildPolicy(cand, issue, template);
  });
}

export function totalPromiseCost(candidate: Candidate): number {
  return candidate.policies.reduce((s, p) => s + p.effects.budgetCost, 0);
}

export function isOverBudget(candidate: Candidate): boolean {
  return totalPromiseCost(candidate) > acornBudgetFor(candidate.policies.length);
}
