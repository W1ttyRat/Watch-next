import { useState, useEffect } from 'react';
import { ensureGuestSession, fetchWithAuth } from './supabaseClient.js';
import heroImg from './assets/hero.png';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initSession() {
      try {
        const activeSession = await ensureGuestSession();
        setSession(activeSession);
      } catch (err) {
        console.error('Failed to initialize guest session:', err);
        setError('Failed to establish a guest session. Please refresh.');
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, []);

  if (loading) {
    return <div>Loading application...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <h1>Guest Session Active</h1>
      <p>User ID: {session?.user?.id}</p>
    </div>
  );
}

export default App;