// server.js — Movie Recommendation API (DBMS Project)
// Start: node server.js

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ────────────────────────────────────────────────────────────
//  Helper: parse comma-separated genres string → array
// ────────────────────────────────────────────────────────────
function formatMovie(row) {
  return {
    ...row,
    is_kids: Boolean(row.is_kids),
    // map DB columns to the shape the React app expects
    ageRating: row.age_rating,
    kids:      Boolean(row.is_kids),
    genre:     row.genres ? row.genres.split(',') : [],
  };
}

// ============================================================
//  MOVIES
// ============================================================

// GET /api/movies — all movies (with genre filter & search)
app.get('/api/movies', async (req, res) => {
  try {
    const { genre, search } = req.query;
    let sql    = `SELECT * FROM movie_details WHERE 1=1`;
    const params = [];

    if (genre && genre !== 'All') {
      // FIND_IN_SET works because genres is stored as comma-separated
      sql += ` AND FIND_IN_SET(?, genres)`;
      params.push(genre);
    }
    if (search) {
      sql += ` AND title LIKE ?`;
      params.push(`%${search}%`);
    }
    sql += ` ORDER BY rating DESC`;

    const [rows] = await db.execute(sql, params);
    res.json(rows.map(formatMovie));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/movies/:id — single movie
app.get('/api/movies/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM movie_details WHERE id = ?`,
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Movie not found' });
    res.json(formatMovie(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
//  GENRES
// ============================================================

// GET /api/genres — all distinct genre names
app.get('/api/genres', async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT name FROM genres ORDER BY name`);
    res.json(rows.map(r => r.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
//  WATCH HISTORY
// ============================================================

// GET /api/watchhistory/:userId — IDs the user has watched
app.get('/api/watchhistory/:userId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT movie_id FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC`,
      [req.params.userId],
    );
    res.json(rows.map(r => r.movie_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/watchhistory/:userId/details — full movie objects watched
app.get('/api/watchhistory/:userId/details', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT md.*, wh.watched_at
       FROM watch_history wh
       JOIN movie_details md ON wh.movie_id = md.id
       WHERE wh.user_id = ?
       ORDER BY wh.watched_at DESC`,
      [req.params.userId],
    );
    res.json(rows.map(formatMovie));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/watchhistory — mark a movie as watched
app.post('/api/watchhistory', async (req, res) => {
  const { userId, movieId } = req.body;
  if (!userId || !movieId)
    return res.status(400).json({ error: 'userId and movieId required' });
  try {
    await db.execute(
      `INSERT IGNORE INTO watch_history (user_id, movie_id) VALUES (?, ?)`,
      [userId, movieId],
    );
    res.json({ success: true, action: 'added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/watchhistory/:userId/:movieId — unmark watched
app.delete('/api/watchhistory/:userId/:movieId', async (req, res) => {
  try {
    await db.execute(
      `DELETE FROM watch_history WHERE user_id = ? AND movie_id = ?`,
      [req.params.userId, req.params.movieId],
    );
    res.json({ success: true, action: 'removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
//  RECOMMENDATIONS  (pure SQL — great DBMS showcase)
// ============================================================

// GET /api/recommendations/:userId
// Finds movies whose genres overlap with the user's most-watched genres,
// that the user has NOT already watched, sorted by rating.
app.get('/api/recommendations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user has any watch history first
    const [[{ cnt }]] = await db.execute(
      `SELECT COUNT(*) AS cnt FROM watch_history WHERE user_id = ?`,
      [userId],
    );
    if (cnt === 0) return res.json([]);

    const [rows] = await db.execute(
      `SELECT md.*,
              COUNT(DISTINCT mg.genre_id) AS genre_overlap
       FROM movie_details md
       JOIN movie_genres mg ON md.id = mg.movie_id
       WHERE md.id NOT IN (
               SELECT movie_id FROM watch_history WHERE user_id = ?
             )
         AND mg.genre_id IN (
               -- Top genres from the user's watch history
               SELECT mg2.genre_id
               FROM   watch_history wh
               JOIN   movie_genres mg2 ON wh.movie_id = mg2.movie_id
               WHERE  wh.user_id = ?
               GROUP  BY mg2.genre_id
               ORDER  BY COUNT(*) DESC
               LIMIT  5
             )
       GROUP BY md.id
       ORDER BY genre_overlap DESC, md.rating DESC
       LIMIT 6`,
      [userId, userId],
    );

    // Attach a human-readable reason for the recommendation
    const watchedGenres = await getTopGenres(userId);
    const recs = rows.map(r => {
      const movie     = formatMovie(r);
      const matched   = movie.genre.filter(g => watchedGenres.includes(g));
      movie.matchedGenres = matched;
      movie.matchTags     = matched;
      movie.reason    = `Recommended because you enjoy ${matched.slice(0, 2).join(' & ')} movies.`;
      return movie;
    });

    res.json(recs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getTopGenres(userId) {
  const [rows] = await db.execute(
    `SELECT g.name
     FROM   watch_history wh
     JOIN   movie_genres mg ON wh.movie_id = mg.movie_id
     JOIN   genres g        ON mg.genre_id = g.id
     WHERE  wh.user_id = ?
     GROUP  BY g.name
     ORDER  BY COUNT(*) DESC
     LIMIT  5`,
    [userId],
  );
  return rows.map(r => r.name);
}

// ============================================================
//  USER RATINGS  (bonus DBMS table)
// ============================================================

// POST /api/ratings — add or update a rating
app.post('/api/ratings', async (req, res) => {
  const { userId, movieId, rating } = req.body;
  if (!userId || !movieId || rating == null)
    return res.status(400).json({ error: 'userId, movieId, rating required' });
  if (rating < 0.5 || rating > 5)
    return res.status(400).json({ error: 'Rating must be 0.5 – 5.0' });
  try {
    await db.execute(
      `INSERT INTO user_ratings (user_id, movie_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [userId, movieId, rating],
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ratings/:userId — all ratings by a user
app.get('/api/ratings/:userId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT ur.movie_id, m.title, ur.rating, ur.rated_at
       FROM   user_ratings ur
       JOIN   movies m ON ur.movie_id = m.id
       WHERE  ur.user_id = ?
       ORDER  BY ur.rated_at DESC`,
      [req.params.userId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
//  STATS — handy for a project demo / report
// ============================================================

// GET /api/stats — fun aggregate statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [[totals]] = await db.execute(
      `SELECT
         (SELECT COUNT(*) FROM movies)        AS total_movies,
         (SELECT COUNT(*) FROM genres)        AS total_genres,
         (SELECT COUNT(*) FROM users)         AS total_users,
         (SELECT COUNT(*) FROM watch_history) AS total_watches,
         (SELECT AVG(rating) FROM movies)     AS avg_rating`
    );

    const [topGenres] = await db.execute(
      `SELECT g.name, COUNT(*) AS movie_count
       FROM   movie_genres mg
       JOIN   genres g ON mg.genre_id = g.id
       GROUP  BY g.name
       ORDER  BY movie_count DESC
       LIMIT  5`
    );

    const [topRated] = await db.execute(
      `SELECT title, rating FROM movies ORDER BY rating DESC LIMIT 5`
    );

    res.json({ totals, topGenres, topRated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
app.listen(PORT, () =>
  console.log(`\n🎬  Movie Recommendation API running at http://localhost:${PORT}\n`),
);
