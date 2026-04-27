import { useState, useEffect, useCallback } from "react";

const MOVIE_DB = [
  { id: 1, title: "The Lion King", genre: ["Animation", "Family", "Adventure"], year: 1994, rating: 8.5, ageRating: "G", kids: true, poster: "🦁", description: "A young lion prince flees his kingdom after the murder of his father." },
  { id: 2, title: "Inception", genre: ["Sci-Fi", "Thriller", "Action"], year: 2010, rating: 8.8, ageRating: "PG-13", kids: false, poster: "🌀", description: "A thief who steals corporate secrets through dream-sharing technology." },
  { id: 3, title: "Toy Story", genre: ["Animation", "Family", "Comedy"], year: 1995, rating: 8.3, ageRating: "G", kids: true, poster: "🤠", description: "A cowboy doll is profoundly threatened when a new spaceman toy arrives." },
  { id: 4, title: "The Dark Knight", genre: ["Action", "Crime", "Drama"], year: 2008, rating: 9.0, ageRating: "PG-13", kids: false, poster: "🦇", description: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy." },
  { id: 5, title: "Finding Nemo", genre: ["Animation", "Family", "Adventure"], year: 2003, rating: 8.1, ageRating: "G", kids: true, poster: "🐠", description: "After his son is taken, a clownfish sets out on a journey to bring him home." },
  { id: 6, title: "Interstellar", genre: ["Sci-Fi", "Drama", "Adventure"], year: 2014, rating: 8.6, ageRating: "PG-13", kids: false, poster: "🚀", description: "A team of explorers travel through a wormhole in space to ensure humanity's survival." },
  { id: 7, title: "Moana", genre: ["Animation", "Family", "Adventure", "Musical"], year: 2016, rating: 7.6, ageRating: "PG", kids: true, poster: "🌊", description: "A young Polynesian girl sets out to save her people with the help of a demigod." },
  { id: 8, title: "Pulp Fiction", genre: ["Crime", "Drama", "Thriller"], year: 1994, rating: 8.9, ageRating: "R", kids: false, poster: "💼", description: "The lives of two mob hitmen, a boxer, and others intertwine in tales of violence." },
  { id: 9, title: "Frozen", genre: ["Animation", "Family", "Musical", "Fantasy"], year: 2013, rating: 7.4, ageRating: "PG", kids: true, poster: "❄️", description: "When the kingdom of Arendelle is trapped in eternal winter, a princess sets out on a quest." },
  { id: 10, title: "The Matrix", genre: ["Sci-Fi", "Action", "Thriller"], year: 1999, rating: 8.7, ageRating: "R", kids: false, poster: "💊", description: "A computer programmer discovers that reality as he knows it is a simulation." },
  { id: 11, title: "Coco", genre: ["Animation", "Family", "Musical", "Adventure"], year: 2017, rating: 8.4, ageRating: "PG", kids: true, poster: "💀", description: "A young boy travels to the Land of the Dead to find his great-great-grandfather." },
  { id: 12, title: "Avengers: Endgame", genre: ["Action", "Sci-Fi", "Adventure"], year: 2019, rating: 8.4, ageRating: "PG-13", kids: false, poster: "⚡", description: "The Avengers assemble once more to reverse the actions of Thanos." },
  { id: 13, title: "Zootopia", genre: ["Animation", "Family", "Comedy", "Crime"], year: 2016, rating: 8.0, ageRating: "PG", kids: true, poster: "🦊", description: "A bunny cop and a con artist fox team up to solve a conspiracy." },
  { id: 14, title: "Parasite", genre: ["Drama", "Thriller", "Comedy"], year: 2019, rating: 8.5, ageRating: "R", kids: false, poster: "🏠", description: "A poor family schemes to become employed by a wealthy family." },
  { id: 15, title: "Ratatouille", genre: ["Animation", "Family", "Comedy", "Drama"], year: 2007, rating: 8.1, ageRating: "G", kids: true, poster: "🐀", description: "A rat who dreams of becoming a great chef makes an alliance with a young restaurant cook." },
  { id: 16, title: "The Godfather", genre: ["Crime", "Drama"], year: 1972, rating: 9.2, ageRating: "R", kids: false, poster: "🌹", description: "The Corleone family patriarch transfers control of his empire to his reluctant son." },
  { id: 17, title: "Up", genre: ["Animation", "Family", "Adventure", "Comedy"], year: 2009, rating: 8.2, ageRating: "PG", kids: true, poster: "🎈", description: "An old man travels the world in his flying house alongside an enthusiastic stowaway." },
  { id: 18, title: "Spirited Away", genre: ["Animation", "Fantasy", "Adventure", "Family"], year: 2001, rating: 8.6, ageRating: "PG", kids: true, poster: "🏮", description: "A young girl wanders into a world ruled by gods, witches, and spirits." },
  { id: 19, title: "Forrest Gump", genre: ["Drama", "Romance", "Comedy"], year: 1994, rating: 8.8, ageRating: "PG-13", kids: false, poster: "🏃", description: "The presidencies of Kennedy and Johnson through the eyes of an Alabama man." },
  { id: 20, title: "The Incredibles", genre: ["Animation", "Action", "Family", "Comedy"], year: 2004, rating: 8.0, ageRating: "PG", kids: true, poster: "💪", description: "A family of undercover superheroes tries to live a quiet suburban life." },
  { id: 21, title: "Goodfellas", genre: ["Crime", "Drama", "Biography"], year: 1990, rating: 8.7, ageRating: "R", kids: false, poster: "🔫", description: "The story of Henry Hill and his life in the mob." },
  { id: 22, title: "WALL-E", genre: ["Animation", "Family", "Sci-Fi", "Romance"], year: 2008, rating: 8.4, ageRating: "G", kids: true, poster: "🤖", description: "A small waste-collecting robot falls in love and helps save Earth." },
  { id: 23, title: "Fight Club", genre: ["Drama", "Thriller"], year: 1999, rating: 8.8, ageRating: "R", kids: false, poster: "👊", description: "An insomniac office worker and a soap salesman build a network of fight clubs." },
  { id: 24, title: "Encanto", genre: ["Animation", "Family", "Musical", "Fantasy"], year: 2021, rating: 7.2, ageRating: "PG", kids: true, poster: "🦋", description: "A magical family in Colombia discovers not all of their powers are what they seem." },
  { id: 25, title: "Whiplash", genre: ["Drama", "Music"], year: 2014, rating: 8.5, ageRating: "R", kids: false, poster: "🥁", description: "A young drummer pursues greatness under the tutelage of a ruthless conductor." },
];

const ALL_GENRES = [...new Set(MOVIE_DB.flatMap(m => m.genre))].sort();

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #F5C842;
    --gold-dim: #c49b2a;
    --red: #E63946;
    --teal: #2EC4B6;
    --bg: #0A0A0F;
    --surface: #13131A;
    --surface2: #1C1C27;
    --surface3: #252535;
    --border: rgba(255,255,255,0.07);
    --text: #F0EEE8;
    --muted: #8A8A9A;
    --kids-bg: #0D1B3E;
    --kids-accent: #FFD700;
    --kids-pink: #FF6B9D;
    --kids-blue: #4FC3F7;
    --kids-green: #81C784;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  .app { min-height: 100vh; background: var(--bg); }
  
  /* HEADER */
  .header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 2rem; display: flex; align-items: center; gap: 2rem; height: 64px; position: sticky; top: 0; z-index: 100; }
  .logo { font-family: var(--font-display); font-size: 2rem; letter-spacing: 2px; color: var(--gold); }
  .logo span { color: var(--red); }
  .nav { display: flex; gap: 0.25rem; flex: 1; }
  .nav-btn { background: none; border: none; color: var(--muted); font-family: var(--font-body); font-size: 0.875rem; font-weight: 500; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
  .nav-btn:hover { background: var(--surface2); color: var(--text); }
  .nav-btn.active { background: rgba(245,200,66,0.12); color: var(--gold); }
  .nav-btn.kids-nav.active { background: rgba(255,215,0,0.2); color: var(--kids-accent); }
  
  /* SEARCH BAR */
  .search-wrap { position: relative; width: 280px; }
  .search-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem 2.5rem 0.5rem 0.875rem; color: var(--text); font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: border 0.2s; }
  .search-input:focus { border-color: var(--gold); }
  .search-input::placeholder { color: var(--muted); }
  .search-icon { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 14px; pointer-events: none; }

  /* MAIN LAYOUT */
  .main { max-width: 1400px; margin: 0 auto; padding: 2rem; }

  /* HERO */
  .hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border-radius: 16px; padding: 3rem; margin-bottom: 2.5rem; position: relative; overflow: hidden; border: 1px solid rgba(245,200,66,0.15); }
  .hero::before { content: ''; position: absolute; top: -50%; right: -10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%); pointer-events: none; }
  .hero-tag { display: inline-block; background: rgba(245,200,66,0.15); border: 1px solid rgba(245,200,66,0.3); color: var(--gold); font-size: 0.7rem; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; padding: 0.3rem 0.75rem; border-radius: 20px; margin-bottom: 1rem; }
  .hero h1 { font-family: var(--font-display); font-size: 3.5rem; letter-spacing: 3px; color: #fff; line-height: 1; margin-bottom: 0.75rem; }
  .hero h1 span { color: var(--gold); }
  .hero p { color: rgba(255,255,255,0.6); font-size: 1rem; max-width: 480px; line-height: 1.6; margin-bottom: 1.5rem; }
  .hero-stats { display: flex; gap: 2rem; }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: var(--font-display); font-size: 1.75rem; color: var(--gold); }
  .hero-stat-label { font-size: 0.7rem; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }

  /* GENRE PILLS */
  .section-label { font-size: 0.7rem; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; }
  .pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
  .pill { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 0.8rem; padding: 0.35rem 0.85rem; border-radius: 20px; cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }
  .pill:hover { border-color: rgba(245,200,66,0.4); color: var(--text); }
  .pill.active { background: rgba(245,200,66,0.12); border-color: var(--gold); color: var(--gold); }
  .pill.all { color: var(--text); }
  .pill.all.active { background: rgba(245,200,66,0.12); border-color: var(--gold); color: var(--gold); }

  /* MOVIE GRID */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .section-title { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 1px; }
  .section-title span { color: var(--gold); }
  .movie-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 3rem; }
  
  .movie-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.25s; position: relative; }
  .movie-card:hover { border-color: rgba(245,200,66,0.35); transform: translateY(-4px); }
  .movie-card.watched { border-color: rgba(46,196,182,0.4); }
  .movie-poster { background: var(--surface2); height: 160px; display: flex; align-items: center; justify-content: center; font-size: 4rem; position: relative; }
  .age-badge { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.75); border: 1px solid rgba(255,255,255,0.2); color: var(--text); font-size: 0.65rem; font-weight: 500; padding: 0.2rem 0.45rem; border-radius: 4px; }
  .watched-badge { position: absolute; top: 8px; left: 8px; background: rgba(46,196,182,0.85); color: #fff; font-size: 0.6rem; font-weight: 500; padding: 0.2rem 0.5rem; border-radius: 4px; }
  .movie-info { padding: 0.875rem; }
  .movie-title { font-weight: 500; font-size: 0.9rem; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .movie-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
  .movie-year { font-size: 0.75rem; color: var(--muted); }
  .movie-rating { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--gold); font-weight: 500; }
  .movie-genres { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .genre-tag { background: var(--surface3); color: var(--muted); font-size: 0.65rem; padding: 0.2rem 0.45rem; border-radius: 4px; }
  .watch-btn { width: 100%; margin-top: 0.75rem; background: none; border: 1px solid var(--border); color: var(--muted); font-family: var(--font-body); font-size: 0.75rem; padding: 0.4rem; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
  .watch-btn:hover { background: rgba(46,196,182,0.12); border-color: var(--teal); color: var(--teal); }
  .watch-btn.marked { background: rgba(46,196,182,0.12); border-color: var(--teal); color: var(--teal); }

  /* HISTORY SECTION */
  .history-section { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 2.5rem; }
  .history-list { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
  .history-chip { display: flex; align-items: center; gap: 0.5rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.8rem; }
  .history-chip-emoji { font-size: 1.1rem; }
  .history-chip-remove { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 0.75rem; margin-left: 0.25rem; padding: 0 0.2rem; border-radius: 3px; }
  .history-chip-remove:hover { color: var(--red); }
  .history-empty { color: var(--muted); font-size: 0.875rem; margin-top: 0.75rem; }

  /* RECOMMENDATIONS */
  .rec-section { margin-bottom: 3rem; }
  .rec-loading { display: flex; align-items: center; gap: 0.75rem; color: var(--muted); font-size: 0.875rem; padding: 1.5rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border); }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .rec-card { background: var(--surface); border: 1px solid rgba(245,200,66,0.2); border-radius: 12px; padding: 1.25rem; display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 0.75rem; transition: border 0.2s; }
  .rec-card:hover { border-color: rgba(245,200,66,0.45); }
  .rec-emoji { font-size: 2.5rem; flex-shrink: 0; width: 52px; height: 52px; background: var(--surface2); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .rec-body { flex: 1; }
  .rec-title { font-weight: 500; font-size: 0.95rem; margin-bottom: 0.3rem; }
  .rec-reason { font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.5rem; }
  .rec-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .rec-tag { background: rgba(245,200,66,0.08); border: 1px solid rgba(245,200,66,0.2); color: var(--gold); font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 4px; }
  .ai-badge { display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(245,200,66,0.08); border: 1px solid rgba(245,200,66,0.2); color: var(--gold); font-size: 0.7rem; padding: 0.3rem 0.65rem; border-radius: 20px; margin-left: 0.75rem; }
  .no-results { text-align: center; padding: 3rem; color: var(--muted); }
  .no-results-big { font-size: 3rem; margin-bottom: 1rem; }

  /* KIDS MODE */
  .kids-mode { background: linear-gradient(135deg, #0d1b3e 0%, #1a237e 50%, #0d2137 100%); min-height: 100vh; }
  .kids-header { background: rgba(0,0,0,0.4); border-bottom: 2px solid var(--kids-accent); }
  .kids-logo { font-family: var(--font-display); font-size: 2rem; letter-spacing: 2px; color: var(--kids-accent); }
  .kids-hero { background: rgba(0,0,0,0.3); border: 2px solid rgba(255,215,0,0.25); border-radius: 20px; padding: 2.5rem; margin-bottom: 2.5rem; text-align: center; }
  .kids-hero-emoji { font-size: 4rem; margin-bottom: 1rem; }
  .kids-hero h2 { font-family: var(--font-display); font-size: 2.5rem; color: var(--kids-accent); letter-spacing: 2px; margin-bottom: 0.5rem; }
  .kids-hero p { color: rgba(255,255,255,0.7); }
  .kids-card { background: rgba(0,0,0,0.35); border: 2px solid rgba(79,195,247,0.2); border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.25s; }
  .kids-card:hover { border-color: var(--kids-accent); transform: translateY(-5px) scale(1.02); }
  .kids-poster { height: 160px; display: flex; align-items: center; justify-content: center; font-size: 4.5rem; background: rgba(255,255,255,0.05); }
  .kids-info { padding: 1rem; }
  .kids-title { font-weight: 500; font-size: 0.95rem; color: #fff; margin-bottom: 0.3rem; }
  .kids-rating { color: var(--kids-accent); font-size: 0.8rem; }
  .kids-pill { background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.3); }
  .kids-pill.active { background: rgba(255,215,0,0.25); border-color: var(--kids-accent); color: var(--kids-accent); }
  .age-shield { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(129,199,132,0.2); border: 1px solid rgba(129,199,132,0.4); color: var(--kids-green); font-size: 0.75rem; padding: 0.4rem 0.85rem; border-radius: 20px; }
  .kids-watch-btn { width: 100%; margin-top: 0.75rem; background: rgba(79,195,247,0.1); border: 1px solid rgba(79,195,247,0.3); color: var(--kids-blue); font-family: var(--font-body); font-size: 0.75rem; padding: 0.4rem; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
  .kids-watch-btn:hover, .kids-watch-btn.marked { background: rgba(79,195,247,0.2); border-color: var(--kids-blue); }
  
  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: var(--surface); border: 1px solid rgba(245,200,66,0.2); border-radius: 16px; padding: 2rem; max-width: 480px; width: 100%; position: relative; }
  .modal-close { position: absolute; top: 1rem; right: 1rem; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; }
  .modal-poster { font-size: 5rem; text-align: center; margin-bottom: 1rem; }
  .modal-title { font-family: var(--font-display); font-size: 1.75rem; letter-spacing: 1px; margin-bottom: 0.5rem; }
  .modal-desc { color: var(--muted); font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.25rem; }
  .modal-row { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
  .modal-watch-btn { flex: 1; background: rgba(46,196,182,0.12); border: 1px solid var(--teal); color: var(--teal); padding: 0.6rem 1rem; border-radius: 8px; cursor: pointer; font-family: var(--font-body); font-size: 0.875rem; transition: all 0.2s; }
  .modal-watch-btn:hover { background: rgba(46,196,182,0.22); }
  .modal-watch-btn.marked { background: var(--teal); color: #0A0A0F; font-weight: 500; }

  /* TOASTS */
  .toast { position: fixed; bottom: 1.5rem; right: 1.5rem; background: var(--surface); border: 1px solid var(--teal); color: var(--text); padding: 0.75rem 1.25rem; border-radius: 10px; font-size: 0.875rem; z-index: 300; animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .header { padding: 0 1rem; gap: 1rem; }
    .logo { font-size: 1.5rem; }
    .search-wrap { width: 180px; }
    .hero h1 { font-size: 2rem; }
    .movie-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    .main { padding: 1rem; }
  }
`;

function getGenreRecommendations(watchHistory, allMovies) {
  if (!watchHistory.length) return [];
  const genreCount = {};
  watchHistory.forEach(id => {
    const m = allMovies.find(x => x.id === id);
    if (m) m.genre.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1; });
  });
  const watchedIds = new Set(watchHistory);
  const scored = allMovies
      .filter(m => !watchedIds.has(m.id))
      .map(m => {
        let score = 0;
        m.genre.forEach(g => { score += genreCount[g] || 0; });
        return { ...m, score, matchedGenres: m.genre.filter(g => genreCount[g] > 0) };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score || b.rating - a.rating)
      .slice(0, 6);
  return scored;
}

export default function App() {
  const [mode, setMode] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [watchHistory, setWatchHistory] = useState([1, 3]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [aiRecs, setAiRecs] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [kidsGenre, setKidsGenre] = useState("All");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleWatch = useCallback((id) => {
    setWatchHistory(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      const movie = MOVIE_DB.find(m => m.id === id);
      showToast(prev.includes(id) ? `Removed "${movie?.title}" from history` : `"${movie?.title}" added to watch history ✓`);
      return next;
    });
  }, []);

  const simpleRecs = getGenreRecommendations(watchHistory, MOVIE_DB);

  const fetchAiRecs = useCallback(async () => {
    if (!watchHistory.length) return;
    setAiLoading(true);
    const watched = watchHistory.map(id => MOVIE_DB.find(m => m.id === id)?.title).filter(Boolean);
    const candidates = MOVIE_DB.filter(m => !watchHistory.includes(m.id)).map(m => `${m.title} (${m.genre.join(", ")})`);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Based on watch history: ${watched.join(", ")}\n\nPick 4 best recommendations from: ${candidates.join("; ")}\n\nRespond ONLY with JSON array, no markdown:\n[{"title":"...","reason":"1-sentence personalized reason based on their taste","matchTags":["tag1","tag2"]}]`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const enriched = parsed.map(r => {
        const movie = MOVIE_DB.find(m => m.title === r.title);
        return movie ? { ...movie, reason: r.reason, matchTags: r.matchTags } : null;
      }).filter(Boolean);
      setAiRecs(enriched);
    } catch {
      setAiRecs(simpleRecs.slice(0, 4).map(m => ({ ...m, reason: `Based on your love of ${m.matchedGenres[0]} movies.`, matchTags: m.matchedGenres.slice(0, 2) })));
    }
    setAiLoading(false);
  }, [watchHistory]);

  useEffect(() => {
    if (watchHistory.length > 0) fetchAiRecs();
    else setAiRecs([]);
  }, [watchHistory]);

  const filteredMovies = MOVIE_DB.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGenre = activeGenre === "All" || m.genre.includes(activeGenre);
    return matchesSearch && matchesGenre;
  });

  const kidsMovies = MOVIE_DB.filter(m => m.kids && (kidsGenre === "All" || m.genre.includes(kidsGenre)));
  const kidsGenres = [...new Set(MOVIE_DB.filter(m => m.kids).flatMap(m => m.genre))].sort();

  const isKids = mode === "kids";

  return (
      <>
        <style>{styles}</style>
        <div className={`app ${isKids ? "kids-mode" : ""}`}>
          {/* HEADER */}
          <header className={`header ${isKids ? "kids-header" : ""}`}>
            <div className={isKids ? "kids-logo" : "logo"}>
              CINE<span>{isKids ? "✨KIDS" : "MIND"}</span>
            </div>
            <nav className="nav">
              {["home", "browse", "recommendations", "history", "kids"].map(tab => (
                  <button
                      key={tab}
                      className={`nav-btn ${tab === "kids" ? "kids-nav" : ""} ${mode === tab ? "active" : ""}`}
                      onClick={() => { setMode(tab); setSearchTerm(""); setActiveGenre("All"); }}
                  >
                    {tab === "home" ? "🏠 Home" : tab === "browse" ? "🎬 Browse" : tab === "recommendations" ? "✨ For You" : tab === "history" ? "📋 History" : "👶 Kids Zone"}
                  </button>
              ))}
            </nav>
            <div className="search-wrap">
              <input
                  className="search-input"
                  placeholder="Search movies…"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setMode("browse"); }}
              />
              <span className="search-icon">⌕</span>
            </div>
          </header>

          <main className="main">

            {/* HOME MODE */}
            {mode === "home" && (
                <>
                  <div className="hero">
                    <div className="hero-tag">Personalized Cinema Intelligence</div>
                    <h1>DISCOVER YOUR<br /><span>NEXT FILM</span></h1>
                    <p>AI-powered recommendations based on your unique taste profile. Track what you've watched, discover what you'll love.</p>
                    <div className="hero-stats">
                      <div className="hero-stat"><div className="hero-stat-num">{MOVIE_DB.length}</div><div className="hero-stat-label">Movies</div></div>
                      <div className="hero-stat"><div className="hero-stat-num">{watchHistory.length}</div><div className="hero-stat-label">Watched</div></div>
                      <div className="hero-stat"><div className="hero-stat-num">{MOVIE_DB.filter(m => m.kids).length}</div><div className="hero-stat-label">Kids Safe</div></div>
                      <div className="hero-stat"><div className="hero-stat-num">{ALL_GENRES.length}</div><div className="hero-stat-label">Genres</div></div>
                    </div>
                  </div>

                  {aiRecs.length > 0 && (
                      <div className="rec-section">
                        <div className="section-header">
                          <div className="section-title">✨ <span>AI Picks</span> For You <span className="ai-badge">🤖 Claude AI</span></div>
                        </div>
                        <div className="movie-grid">
                          {aiRecs.slice(0, 4).map(m => (
                              <MovieCard key={m.id} movie={m} watched={watchHistory.includes(m.id)} onToggle={toggleWatch} onClick={() => setSelectedMovie(m)} isRec />
                          ))}
                        </div>
                      </div>
                  )}

                  <div className="section-header"><div className="section-title">🎬 <span>Trending</span> Now</div></div>
                  <div className="movie-grid">
                    {[...MOVIE_DB].sort((a, b) => b.rating - a.rating).slice(0, 8).map(m => (
                        <MovieCard key={m.id} movie={m} watched={watchHistory.includes(m.id)} onToggle={toggleWatch} onClick={() => setSelectedMovie(m)} />
                    ))}
                  </div>
                </>
            )}

            {/* BROWSE MODE */}
            {mode === "browse" && (
                <>
                  <div className="section-header" style={{ marginBottom: "1rem" }}>
                    <div className="section-title">🎬 <span>Browse</span> All Movies</div>
                    <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{filteredMovies.length} results</span>
                  </div>
                  <div className="section-label">Filter by Genre</div>
                  <div className="pills">
                    {["All", ...ALL_GENRES].map(g => (
                        <button key={g} className={`pill ${g === "All" ? "all" : ""} ${activeGenre === g ? "active" : ""}`} onClick={() => setActiveGenre(g)}>{g}</button>
                    ))}
                  </div>
                  {filteredMovies.length === 0 ? (
                      <div className="no-results"><div className="no-results-big">🎬</div><p>No movies found. Try a different search.</p></div>
                  ) : (
                      <div className="movie-grid">
                        {filteredMovies.map(m => (
                            <MovieCard key={m.id} movie={m} watched={watchHistory.includes(m.id)} onToggle={toggleWatch} onClick={() => setSelectedMovie(m)} />
                        ))}
                      </div>
                  )}
                </>
            )}

            {/* RECOMMENDATIONS MODE */}
            {mode === "recommendations" && (
                <>
                  <div className="section-header" style={{ marginBottom: "1.5rem" }}>
                    <div className="section-title">✨ <span>Recommended</span> For You</div>
                    <span className="ai-badge">🤖 Claude AI</span>
                  </div>
                  {watchHistory.length === 0 ? (
                      <div className="no-results">
                        <div className="no-results-big">🎯</div>
                        <p style={{ marginBottom: "1rem" }}>Add movies to your watch history to get personalized recommendations.</p>
                        <button className="pill active" onClick={() => setMode("browse")}>Browse Movies →</button>
                      </div>
                  ) : aiLoading ? (
                      <div className="rec-loading">
                        <div className="spinner"></div>
                        Claude AI is analyzing your taste profile…
                      </div>
                  ) : (
                      <>
                        <div style={{ background: "var(--surface)", borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid var(--border)", marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                          Based on your watch history of <strong style={{ color: "var(--text)" }}>{watchHistory.length} movies</strong>, Claude AI has analyzed your genre preferences and viewing patterns to surface these personalized picks.
                        </div>
                        {aiRecs.map(m => (
                            <div key={m.id} className="rec-card" onClick={() => setSelectedMovie(m)}>
                              <div className="rec-emoji">{m.poster}</div>
                              <div className="rec-body">
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                  <div className="rec-title">{m.title}</div>
                                  <span style={{ color: "var(--gold)", fontSize: "0.75rem" }}>★ {m.rating}</span>
                                </div>
                                <div className="rec-reason">{m.reason || `Great match for your ${m.matchedGenres?.[0]} taste.`}</div>
                                <div className="rec-tags">
                                  {(m.matchTags || m.matchedGenres || []).map(t => <span key={t} className="rec-tag">{t}</span>)}
                                </div>
                              </div>
                              <button className={`watch-btn ${watchHistory.includes(m.id) ? "marked" : ""}`} style={{ width: "auto", marginTop: 0, padding: "0.4rem 0.75rem", whiteSpace: "nowrap" }}
                                      onClick={e => { e.stopPropagation(); toggleWatch(m.id); }}>
                                {watchHistory.includes(m.id) ? "✓ Watched" : "+ Mark Watched"}
                              </button>
                            </div>
                        ))}
                        <button className="pill active" style={{ marginTop: "1rem" }} onClick={fetchAiRecs}>🔄 Refresh Recommendations</button>
                      </>
                  )}
                </>
            )}

            {/* HISTORY MODE */}
            {mode === "history" && (
                <>
                  <div className="section-title" style={{ marginBottom: "1.5rem" }}>📋 Watch <span>History</span></div>
                  <div className="history-section">
                    <div className="section-label">Movies You've Watched</div>
                    {watchHistory.length === 0 ? (
                        <p className="history-empty">No watch history yet. Browse movies and mark them as watched!</p>
                    ) : (
                        <div className="history-list">
                          {watchHistory.map(id => {
                            const m = MOVIE_DB.find(x => x.id === id);
                            return m ? (
                                <div key={id} className="history-chip">
                                  <span className="history-chip-emoji">{m.poster}</span>
                                  <span>{m.title}</span>
                                  <button className="history-chip-remove" onClick={() => toggleWatch(id)}>✕</button>
                                </div>
                            ) : null;
                          })}
                        </div>
                    )}
                  </div>
                  {simpleRecs.length > 0 && (
                      <>
                        <div className="section-title" style={{ marginBottom: "1.25rem" }}>🎯 Based On Your <span>History</span></div>
                        <div className="movie-grid">
                          {simpleRecs.map(m => (
                              <MovieCard key={m.id} movie={m} watched={watchHistory.includes(m.id)} onToggle={toggleWatch} onClick={() => setSelectedMovie(m)} isRec />
                          ))}
                        </div>
                      </>
                  )}
                </>
            )}

            {/* KIDS MODE */}
            {mode === "kids" && (
                <>
                  <div className="kids-hero">
                    <div className="kids-hero-emoji">🌟🎬✨</div>
                    <h2>KIDS MOVIE ZONE</h2>
                    <p>Safe, fun, and age-appropriate movies for young viewers</p>
                    <div style={{ marginTop: "1rem" }}>
                      <span className="age-shield">🛡️ All content is G or PG rated and family-friendly</span>
                    </div>
                  </div>
                  <div className="section-label" style={{ color: "rgba(255,215,0,0.6)" }}>Filter by Genre</div>
                  <div className="pills" >
                    {["All", ...kidsGenres].map(g => (
                        <button key={g} className={`pill kids-pill ${kidsGenre === g ? "active" : ""}`} onClick={() => setKidsGenre(g)}>{g}</button>
                    ))}
                  </div>
                  <div className="section-header">
                    <div className="section-title" style={{ color: "var(--kids-accent)" }}>🌈 {kidsGenre === "All" ? "All" : kidsGenre} <span style={{ color: "#fff" }}>Movies</span></div>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>{kidsMovies.length} movies</span>
                  </div>
                  <div className="movie-grid">
                    {kidsMovies.map(m => (
                        <div key={m.id} className="kids-card" onClick={() => setSelectedMovie(m)}>
                          <div className="kids-poster">{m.poster}</div>
                          <div className="kids-info">
                            <div className="kids-title">{m.title} <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>({m.year})</span></div>
                            <div className="kids-rating">★ {m.rating} · {m.ageRating}</div>
                            <div className="movie-genres" style={{ marginTop: "0.5rem" }}>
                              {m.genre.slice(0, 2).map(g => <span key={g} className="genre-tag" style={{ background: "rgba(79,195,247,0.1)", color: "var(--kids-blue)" }}>{g}</span>)}
                            </div>
                            <button className={`kids-watch-btn ${watchHistory.includes(m.id) ? "marked" : ""}`}
                                    onClick={e => { e.stopPropagation(); toggleWatch(m.id); }}>
                              {watchHistory.includes(m.id) ? "✓ Watched!" : "▶ Mark Watched"}
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
                </>
            )}
          </main>

          {/* MODAL */}
          {selectedMovie && (
              <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setSelectedMovie(null)}>✕</button>
                  <div className="modal-poster">{selectedMovie.poster}</div>
                  <div className="modal-title">{selectedMovie.title}</div>
                  <div className="modal-row">
                    <span style={{ color: "var(--gold)", fontWeight: 500 }}>★ {selectedMovie.rating}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{selectedMovie.year}</span>
                    <span style={{ background: "var(--surface2)", border: "1px solid var(--border)", fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: 4 }}>{selectedMovie.ageRating}</span>
                    {selectedMovie.kids && <span className="age-shield" style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>🛡️ Kids Safe</span>}
                  </div>
                  <div className="modal-desc">{selectedMovie.description}</div>
                  <div className="movie-genres" style={{ marginBottom: "1.25rem" }}>
                    {selectedMovie.genre.map(g => <span key={g} className="rec-tag">{g}</span>)}
                  </div>
                  <button
                      className={`modal-watch-btn ${watchHistory.includes(selectedMovie.id) ? "marked" : ""}`}
                      onClick={() => { toggleWatch(selectedMovie.id); setSelectedMovie(null); }}
                  >
                    {watchHistory.includes(selectedMovie.id) ? "✓ Remove from Watch History" : "▶ Mark as Watched"}
                  </button>
                </div>
              </div>
          )}

          {toast && <div className="toast">{toast}</div>}
        </div>
      </>
  );
}

function MovieCard({ movie, watched, onToggle, onClick, isRec }) {
  return (
      <div className={`movie-card ${watched ? "watched" : ""}`} onClick={onClick}>
        <div className="movie-poster">
          {movie.poster}
          <span className="age-badge">{movie.ageRating}</span>
          {watched && <span className="watched-badge">✓ Watched</span>}
          {isRec && !watched && <span className="watched-badge" style={{ background: "rgba(245,200,66,0.85)" }}>✨ Rec</span>}
        </div>
        <div className="movie-info">
          <div className="movie-title">{movie.title}</div>
          <div className="movie-meta">
            <span className="movie-year">{movie.year}</span>
            <span className="movie-rating">★ {movie.rating}</span>
          </div>
          <div className="movie-genres">
            {movie.genre.slice(0, 2).map(g => <span key={g} className="genre-tag">{g}</span>)}
          </div>
          <button className={`watch-btn ${watched ? "marked" : ""}`}
                  onClick={e => { e.stopPropagation(); onToggle(movie.id); }}>
            {watched ? "✓ Watched" : "+ Mark Watched"}
          </button>
        </div>
      </div>
  );
}
