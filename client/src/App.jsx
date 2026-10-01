import { useEffect, useMemo, useState } from 'react';
import { ensureGuestSession, fetchWithAuth } from './supabaseClient.js';
import './App.css';

const GENRES = ['comedy', 'action', 'drama', 'other'];

function normalizeFilms(response) {
  const films = Array.isArray(response) ? response : response?.films;

  if (!Array.isArray(films)) {
    throw new Error('The films API returned an unexpected response.');
  }

  return films;
}

async function requestFilms() {
  return normalizeFilms(await fetchWithAuth('/api/film'));
}

function App() {
  const [session, setSession] = useState(null);
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('comedy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        const activeSession = await ensureGuestSession();
        if (!isMounted) return;
        setSession(activeSession);

        const films = await requestFilms();
        if (isMounted) setMovies(films);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not load your watchlist.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initialize();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleMovies = useMemo(
    () => movies.filter((movie) => filter === 'all' || movie.genre === filter),
    [filter, movies]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();

    if (cleanTitle.length < 1 || cleanTitle.length > 100) {
      setError('A title must be between 1 and 100 characters.');
      setNotice('');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');

    try {
      await fetchWithAuth('/api/film', {
        method: 'POST',
        body: JSON.stringify({ title: cleanTitle, genre }),
      });
      setMovies(await requestFilms());
      setTitle('');
      setNotice('Added to your watchlist.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add this film.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(movie) {
    setDeletingId(movie.id);
    setError('');
    setNotice('');

    try {
      await fetchWithAuth(`/api/film/${encodeURIComponent(movie.id)}`, {
        method: 'DELETE',
      });
      setMovies((currentMovies) =>
        currentMovies.filter((item) => String(item.id) !== String(movie.id))
      );
      setNotice(`Removed “${movie.title}” from your watchlist.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this film.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="loading-screen" aria-live="polite">
        <span className="loading-mark" aria-hidden="true">W</span>
        <p>Getting your watchlist ready…</p>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Watch Next home">
          <span className="brand-mark" aria-hidden="true">W</span>
          <span>watch<span className="brand-light">next</span></span>
        </a>
        <div className="session-pill">
          <span className="session-dot" />
          <span>Guest list</span>
          {session?.user?.id && <span className="session-id">#{session.user.id.slice(0, 8)}</span>}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> YOUR PERSONAL WATCHLIST</p>
          <h1>Good films<br />deserve a <em>next.</em></h1>
          <p className="hero-description">
            Keep every recommendation somewhere you’ll actually remember it.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="ticket ticket-back">✦</div>
          <div className="ticket ticket-front"><span>W</span><small>TONIGHT’S<br />PICK</small></div>
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✦</span>
        </div>
      </section>

      <section className="workspace" aria-label="Movie watchlist">
        <form className="add-card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <span className="heading-icon" aria-hidden="true">＋</span>
            <div>
              <h2>Add a film</h2>
              <p>Save a recommendation before it slips away.</p>
            </div>
          </div>

          <label className="field-label" htmlFor="film-title">Film title</label>
          <input
            id="film-title"
            className="text-input"
            type="text"
            placeholder="e.g. The Grand Budapest Hotel"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={1}
            maxLength={100}
            required
          />
          <div className="form-bottom">
            <div className="genre-field">
              <label className="field-label" htmlFor="film-genre">Genre</label>
              <select
                id="film-genre"
                className="select-input"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
              >
                {GENRES.map((item) => (
                  <option value={item} key={item}>{item[0].toUpperCase() + item.slice(1)}</option>
                ))}
              </select>
            </div>
            <button className="add-button" type="submit" disabled={saving || !session}>
              {saving ? 'Adding…' : 'Add to list'}
              {!saving && <span aria-hidden="true">↗</span>}
            </button>
          </div>
          <p className="character-count">{title.length}/100</p>
        </form>

        <section className="list-panel" aria-labelledby="list-title">
          <div className="list-heading">
            <div>
              <p className="eyebrow list-eyebrow">THE GOOD STUFF</p>
              <h2 id="list-title">Your watchlist <span className="count-badge">{movies.length}</span></h2>
            </div>
            <label className="filter-control">
              <span>Filter</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">All genres</option>
                {GENRES.map((item) => (
                  <option value={item} key={item}>{item[0].toUpperCase() + item.slice(1)}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <div className="message message-error" role="alert">{error}</div>}
          {notice && <div className="message message-success" role="status">{notice}</div>}

          {visibleMovies.length > 0 ? (
            <ul className="movie-list">
              {visibleMovies.map((movie, index) => (
                <li className="movie-row" key={movie.id}>
                  <span className="movie-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="movie-initial" aria-hidden="true">
                    {movie.title?.trim().charAt(0).toUpperCase() || '✦'}
                  </span>
                  <span className="movie-details">
                    <span className="movie-title">{movie.title}</span>
                    <span className={`genre-tag genre-${movie.genre}`}>{movie.genre}</span>
                  </span>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDelete(movie)}
                    disabled={deletingId === movie.id}
                    aria-label={`Delete ${movie.title}`}
                    title={`Delete ${movie.title}`}
                  >
                    {deletingId === movie.id ? '…' : '×'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✳</span>
              <h3>{movies.length ? 'Nothing in this genre yet' : 'Your next favorite starts here'}</h3>
              <p>{movies.length ? 'Try another genre, or add a film to this one.' : 'Add a film recommendation and it’ll be waiting when movie night comes.'}</p>
            </div>
          )}

          <div className="list-footer">
            <span><span className="footer-spark">✦</span> A little list for your next movie night.</span>
            <span>{visibleMovies.length} {visibleMovies.length === 1 ? 'film' : 'films'} shown</span>
          </div>
        </section>
      </section>

      <footer className="page-footer">
        <span>WATCHNEXT <span>·</span> KEEP THE GOOD ONES CLOSE</span>
        <span>MADE FOR MOVIE NIGHT <span>✳</span></span>
      </footer>
    </main>
  );
}

export default App;