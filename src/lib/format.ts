export function pct(part: number, total: number, digits = 0): string {
  if (total <= 0) return '0%';
  return `${((part / total) * 100).toFixed(digits)}%`;
}

export function pctNum(part: number, total: number): number {
  return total <= 0 ? 0 : (part / total) * 100;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function stars(n: number): string {
  const full = Math.round(n);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
}

export function listNames(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}
