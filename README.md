# CineMind – Movie Recommendation System

A full-stack movie recommendation system built with **React** and **Node.js / Express**, featuring a SQL-powered recommendation engine, MySQL database, and a cinematic dark-themed frontend — with a dedicated Kids Zone for family-friendly browsing.

---

## Features

- **Browse** – Explore curated films with genre filters, search, age ratings, and live result counts
- **SQL Recommendations** – Genre-overlap JOIN queries surface personalised picks based on your watch history
- **Watch History** – Mark movies as watched; history is persisted in MySQL and survives page refreshes
- **Kids Zone** – Filtered G/PG content in a separate, child-friendly UI with safety badges
- **Movie Modal** – Detailed view with description, rating, year, age rating, and watch toggle
- **Normalised Schema** – Movies, genres, users, watch history, and ratings stored across 5 relational tables
- **Stats API** – Aggregate queries (top genres, top-rated films, total watches) ready for demo/report use
- **Responsive UI** – Works on desktop and mobile with a sticky header and fluid grid

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React (JSX), CSS-in-JS              |
| Backend    | Node.js, Express.js                 |
| Database   | MySQL 8+                            |
| ORM/Driver | mysql2 (promise-based pool)         |
| Config     | dotenv                              |
| Dev Tools  | nodemon                             |

---

## Project Structure

```
cinemind/
├── MovieRecommendationApp.jsx   # React frontend — all UI, state, API calls
│
└── backend/
    ├── server.js                # Express app — all REST API routes
    ├── db.js                    # MySQL connection pool
    ├── schema.sql               # Database schema (tables + views)
    ├── seed.js                  # Seed script — populates all 25 movies
    ├── package.json             # Backend dependencies
    └── .env.example             # Environment variable template
```

---

## Database Schema

```
movies         – id, title, year, rating, age_rating, is_kids, poster, description
genres         – id, name  (normalised lookup)
movie_genres   – movie_id ↔ genre_id  (many-to-many junction)
users          – id, username, created_at
watch_history  – user_id ↔ movie_id, watched_at
user_ratings   – user_id, movie_id, rating (0.5–5.0), rated_at

Views:
  movie_details          – movies joined with comma-separated genres
  watch_history_details  – watch history joined with movie + user info
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+ (running locally or on a server)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cinemind.git
cd cinemind
```

### 2. Set up the database

Log into MySQL and run the schema:

```bash
mysql -u root -p < backend/schema.sql
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `.env` with your credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=movie_recommendation_db
PORT=5000
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Seed the database

```bash
node seed.js
```

### 6. Start the API server

```bash
node server.js
# API running at http://localhost:5000
```

### 7. Start the React frontend

```bash
# From the project root
npm run dev     # or however your React project is configured
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | All movies (supports `?genre=` and `?search=` filters) |
| GET | `/api/movies/:id` | Single movie by ID |
| GET | `/api/genres` | All distinct genre names |
| GET | `/api/watchhistory/:userId` | Movie IDs watched by a user |
| GET | `/api/watchhistory/:userId/details` | Full movie objects in watch history |
| POST | `/api/watchhistory` | Mark a movie as watched |
| DELETE | `/api/watchhistory/:userId/:movieId` | Remove from watch history |
| GET | `/api/recommendations/:userId` | SQL-powered personalised recommendations |
| POST | `/api/ratings` | Add or update a user rating |
| GET | `/api/ratings/:userId` | All ratings by a user |
| GET | `/api/stats` | Aggregate stats (top genres, top-rated, totals) |

---

## Data Models

- **Movie** – title, year, IMDB-style rating, age rating (G / PG / PG-13 / R), kids flag, emoji poster, description
- **Genre** – normalised name; linked to movies via junction table
- **User** – username, created timestamp (default guest user seeded)
- **Watch History** – per-user watch log with timestamp; unique constraint prevents duplicates
- **User Rating** – 0.5–5.0 star rating per user per movie; upsertable

---

## Recommendation Logic

The recommendation engine is entirely SQL-based — no external libraries:

```sql
SELECT movie_details.*, COUNT(DISTINCT genre_id) AS genre_overlap
FROM movie_details
JOIN movie_genres ON movie_details.id = movie_genres.movie_id
WHERE movie_details.id NOT IN (
    SELECT movie_id FROM watch_history WHERE user_id = ?
)
AND genre_id IN (
    SELECT genre_id FROM watch_history
    JOIN movie_genres USING (movie_id)
    WHERE user_id = ?
    GROUP BY genre_id ORDER BY COUNT(*) DESC LIMIT 5
)
GROUP BY movie_details.id
ORDER BY genre_overlap DESC, rating DESC
LIMIT 6;
```

This makes it a strong DBMS project showcase — the intelligence lives in the query, not application code.

---

## Acknowledgements

- Movie data curated manually for the project
- UI design inspired by modern streaming platforms
- Built as a DBMS course project demonstrating normalisation, views, joins, and subqueries
