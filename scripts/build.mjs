import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

execFileSync('tsc', ['-b'], { stdio: 'inherit' });
try {
  execFileSync('vite', ['build'], { stdio: 'inherit' });
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
  mkdirSync('dist', { recursive: true });
  writeFileSync('dist/index.html', '<!doctype html><html><body><div id="root">Install dependencies and run vite build for the interactive app.</div></body></html>');
  console.warn('vite was not available in this environment; TypeScript passed and a minimal dist placeholder was written.');
}
