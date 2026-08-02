/**
 * Fetches JSON from a URL with a timeout, so a slow or hanging request
 * can't freeze the whole server. Not currently used by this project's
 * P0 tools (they read local files), but kept here as a shared helper
 * in case a future tool needs to call an external API.
 */
export async function fetchJson<T>(
  url: string,
  { timeoutMs = 8000 }: { timeoutMs?: number } = {},
): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}