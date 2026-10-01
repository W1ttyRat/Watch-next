import { createClient } from '@supabase/supabase-js';

/**
 * @param {string} endpoint 
 * @param {object} options
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

let guestSessionPromise;

export function ensureGuestSession() {
  if (!guestSessionPromise) {
    guestSessionPromise = (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;
      if (data.session) return data.session;

      const result = await supabase.auth.signInAnonymously();

      if (result.error) throw result.error;
      if (!result.data.session) throw new Error('Guest session unavailable');

      return result.data.session;
    })().finally(() => {
      guestSessionPromise = undefined;
    });
  }

  return guestSessionPromise;
}

export async function fetchWithAuth(endpoint, options = {}) {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error('Guest session unavailable');
  }

  const token = data.session.access_token;
  const baseUrl = import.meta.env.VITE_API_URL;

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}