/**
 * Utility for performing network fetch calls safely with automatic retries.
 * Prevents Next.js development overlays and unhandled rejections during transient
 * backend restarts or network blips.
 */
export async function safeFetch(
  url: string,
  options?: RequestInit,
  retries = 2,
  delayMs = 400
): Promise<Response | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      // Silently return null after all retries fail to prevent Next.js dev overlay crashes
      return null;
    }
  }
  return null;
}
