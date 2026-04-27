-- ============================================================
--  Movie Recommendation App — DBMS Project
--  Run once to set up all tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS movie_recommendation_db;
USE movie_recommendation_db;

-- ── Genres lookup table (normalised) ────────────────────────
CREATE TABLE IF NOT EXISTS genres (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- ── Movies ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS movies (
  id          INT PRIMARY KEY,
  title       VARCHAR(255)   NOT NULL,
  year        INT            NOT NULL,
  rating      DECIMAL(3,1)   NOT NULL,
  age_rating  VARCHAR(10)    NOT NULL,
  is_kids     BOOLEAN        DEFAULT FALSE,
  poster      VARCHAR(20)    NOT NULL,
  description TEXT
);
ALTER TABLE movies
ADD COLUMN language VARCHAR(50) DEFAULT 'English', -- Language [cite: 12]
ADD COLUMN content_rating VARCHAR(10),            -- Content Rating [cite: 14]
ADD COLUMN box_office BIGINT;                      -- BoxOffice [cite: 15]


-- ── Junction table: movie ↔ genres (many-to-many) ──────────
CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)  ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id)  ON DELETE CASCADE
);

-- ── Users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users
ADD COLUMN email VARCHAR(100) UNIQUE, -- Email [cite: 3]
ADD COLUMN age INT,                   -- Age [cite: 4]
ADD COLUMN favorite_genre VARCHAR(50); -- FavoriteGenre [cite: 5]

-- ── Watch History ───────────────────────────────────────────
DROP TABLE IF EXISTS watch_history;
CREATE TABLE watch_history (
    watch_id INT AUTO_INCREMENT PRIMARY KEY, -- WatchID [cite: 39]
    user_id INT NOT NULL,                    -- UserID [cite: 40]
    movie_id INT NOT NULL,                   -- MovieID [cite: 41]
    watch_data DATE NOT NULL,                -- WatchData [cite: 39]
    duration INT,                            -- Duration [cite: 8]
    mood_preference VARCHAR(100),            -- MoodPreference [cite: 9]
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- ── Ratings (bonus table to showcase more DBMS ops) ─────────
CREATE TABLE IF NOT EXISTS user_ratings (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT            NOT NULL,
  movie_id   INT            NOT NULL,
  rating     DECIMAL(2,1)   NOT NULL CHECK (rating BETWEEN 0.5 AND 5.0),
  rated_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_rating (user_id, movie_id),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- ── Useful Views ─────────────────────────────────────────────

-- Full movie view with comma-separated genres
CREATE OR REPLACE VIEW movie_details AS
  SELECT
    m.id,
    m.title,
    m.year,
    m.rating,
    m.age_rating,
    m.is_kids,
    m.poster,
    m.description,
    GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ',') AS genres
  FROM movies m
  JOIN movie_genres mg ON m.id = mg.movie_id
  JOIN genres g        ON mg.genre_id = g.id
  GROUP BY m.id;

-- Watch history view with movie info
CREATE OR REPLACE VIEW watch_history_details AS
  SELECT
    wh.id,
    wh.user_id,
    u.username,
    wh.movie_id,
    m.title,
    m.poster,
    m.rating,
    wh.watched_at
  FROM watch_history wh
  JOIN users  u ON wh.user_id  = u.id
  JOIN movies m ON wh.movie_id = m.id;

CREATE TABLE IF NOT EXISTS reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY, -- ReviewID [cite: 31]
    user_id INT NOT NULL,                     -- UserID [cite: 59]
    movie_id INT NOT NULL,                    -- MovieID [cite: 60]
    rating DECIMAL(2,1),                      -- Rating [cite: 61]
    review_text TEXT,                         -- Review Text [cite: 62]
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Review Date [cite: 63]
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
