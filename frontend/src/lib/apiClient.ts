const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

/** GET a JSON resource. Throws on a non-2xx response, so TanStack Query reports the error. */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) throw new Error(`GET ${path} failed with ${response.status}`);
  return (await response.json()) as T; // as: the generated API types describe this response
}
