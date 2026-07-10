const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL|| 'http://localhost:1337';

export async function fetchStrapi(endpoint: string, options:RequestInit= {}) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      ...options,
      headers: {'Content-Type': 'application/json',
        ...options.headers,
      },
      next: {
        revalidate: 60, //-def isr val
        ...((options.next as any)|| {}),
      }
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