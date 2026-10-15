/** First-party browser session storage; no external editor bridge. */
export function browserAuthStorage() {
  return typeof window === 'undefined' ? undefined : window.localStorage;
}
