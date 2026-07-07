declare module 'react' {
  export type ReactNode = unknown;
  export interface ChangeEvent<T = { value?: string; checked?: boolean }> { target: T; }
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((current: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps?: unknown[]): T;
  const React: { StrictMode: (props: { children?: ReactNode }) => unknown };
  export default React;
}
declare module 'react/jsx-runtime' {
  export const jsx: unknown;
  export const jsxs: unknown;
  export const Fragment: unknown;
}
declare module 'react-dom/client' {
  export function createRoot(element: Element): { render(node: unknown): void };
}
declare namespace JSX {
  interface IntrinsicAttributes { key?: string | number; }
  interface IntrinsicElements { [elemName: string]: any; }
}
