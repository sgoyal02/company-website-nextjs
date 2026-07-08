const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchFromStrapi(endpoint: string, options: RequestInit= {}) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`strapi get err: status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`fail in fetch api: ${endpoint}`, error);
    throw error;
  }
}