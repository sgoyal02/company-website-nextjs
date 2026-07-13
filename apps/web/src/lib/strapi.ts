import { STRAPI_URL } from "@/constants/CONFIG";

type FetchOptions= RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export async function fetchStrapi(endpoint: string, options:FetchOptions= {}) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      ...options,
      headers: {'Content-Type': 'application/json',
        ...options.headers,
      },
      next: {
        revalidate: 60, //-def isr val
        ...options.next ,
      }
    });
    if (!res.ok) {
      throw new Error(`strapi get err: status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}