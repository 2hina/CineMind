// seed.js — Populate MySQL with all 25 movies + default user
// Run once: node seed.js

require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'movie_recommendation_db',
  multipleStatements: true,
};

const MOVIES = [
  { id:  1, title: "The Lion King",       genre: ["Animation","Family","Adventure"],             year: 1994, rating: 8.5, ageRating: "G",     kids: true,  poster: "🦁", description: "A young lion prince flees his kingdom after the murder of his father." },
  { id:  2, title: "Inception",           genre: ["Sci-Fi","Thriller","Action"],                 year: 2010, rating: 8.8, ageRating: "PG-13", kids: false, poster: "🌀", description: "A thief who steals corporate secrets through dream-sharing technology." },
  { id:  3, title: "Toy Story",           genre: ["Animation","Family","Comedy"],                year: 1995, rating: 8.3, ageRating: "G",     kids: true,  poster: "🤠", description: "A cowboy doll is profoundly threatened when a new spaceman toy arrives." },
  { id:  4, title: "The Dark Knight",     genre: ["Action","Crime","Drama"],                     year: 2008, rating: 9.0, ageRating: "PG-13", kids: false, poster: "🦇", description: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy." },
  { id:  5, title: "Finding Nemo",        genre: ["Animation","Family","Adventure"],             year: 2003, rating: 8.1, ageRating: "G",     kids: true,  poster: "🐠", description: "After his son is taken, a clownfish sets out on a journey to bring him home." },
  { id:  6, title: "Interstellar",        genre: ["Sci-Fi","Drama","Adventure"],                 year: 2014, rating: 8.6, ageRating: "PG-13", kids: false, poster: "🚀", description: "A team of explorers travel through a wormhole in space to ensure humanity's survival." },
  { id:  7, title: "Moana",               genre: ["Animation","Family","Adventure","Musical"],   year: 2016, rating: 7.6, ageRating: "PG",    kids: true,  poster: "🌊", description: "A young Polynesian girl sets out to save her people with the help of a demigod." },
  { id:  8, title: "Pulp Fiction",        genre: ["Crime","Drama","Thriller"],                   year: 1994, rating: 8.9, ageRating: "R",     kids: false, poster: "💼", description: "The lives of two mob hitmen, a boxer, and others intertwine in tales of violence." },
  { id:  9, title: "Frozen",              genre: ["Animation","Family","Musical","Fantasy"],     year: 2013, rating: 7.4, ageRating: "PG",    kids: true,  poster: "❄️", description: "When the kingdom of Arendelle is trapped in eternal winter, a princess sets out on a quest." },
  { id: 10, title: "The Matrix",          genre: ["Sci-Fi","Action","Thriller"],                 year: 1999, rating: 8.7, ageRating: "R",     kids: false, poster: "💊", description: "A computer programmer discovers that reality as he knows it is a simulation." },
  { id: 11, title: "Coco",               genre: ["Animation","Family","Musical","Adventure"],   year: 2017, rating: 8.4, ageRating: "PG",    kids: true,  poster: "💀", description: "A young boy travels to the Land of the Dead to find his great-great-grandfather." },
  { id: 12, title: "Avengers: Endgame",  genre: ["Action","Sci-Fi","Adventure"],               year: 2019, rating: 8.4, ageRating: "PG-13", kids: false, poster: "⚡", description: "The Avengers assemble once more to reverse the actions of Thanos." },
  { id: 13, title: "Zootopia",           genre: ["Animation","Family","Comedy","Crime"],        year: 2016, rating: 8.0, ageRating: "PG",    kids: true,  poster: "🦊", description: "A bunny cop and a con artist fox team up to solve a conspiracy." },
  { id: 14, title: "Parasite",           genre: ["Drama","Thriller","Comedy"],                  year: 2019, rating: 8.5, ageRating: "R",     kids: false, poster: "🏠", description: "A poor family schemes to become employed by a wealthy family." },
  { id: 15, title: "Ratatouille",        genre: ["Animation","Family","Comedy","Drama"],        year: 2007, rating: 8.1, ageRating: "G",     kids: true,  poster: "🐀", description: "A rat who dreams of becoming a great chef makes an alliance with a young restaurant cook." },
  { id: 16, title: "The Godfather",      genre: ["Crime","Drama"],                              year: 1972, rating: 9.2, ageRating: "R",     kids: false, poster: "🌹", description: "The Corleone family patriarch transfers control of his empire to his reluctant son." },
  { id: 17, title: "Up",                 genre: ["Animation","Family","Adventure","Comedy"],    year: 2009, rating: 8.2, ageRating: "PG",    kids: true,  poster: "🎈", description: "An old man travels the world in his flying house alongside an enthusiastic stowaway." },
  { id: 18, title: "Spirited Away",      genre: ["Animation","Fantasy","Adventure","Family"],   year: 2001, rating: 8.6, ageRating: "PG",    kids: true,  poster: "🏮", description: "A young girl wanders into a world ruled by gods, witches, and spirits." },
  { id: 19, title: "Forrest Gump",       genre: ["Drama","Romance","Comedy"],                   year: 1994, rating: 8.8, ageRating: "PG-13", kids: false, poster: "🏃", description: "The presidencies of Kennedy and Johnson through the eyes of an Alabama man." },
  { id: 20, title: "The Incredibles",    genre: ["Animation","Action","Family","Comedy"],       year: 2004, rating: 8.0, ageRating: "PG",    kids: true,  poster: "💪", description: "A family of undercover superheroes tries to live a quiet suburban life." },
  { id: 21, title: "Goodfellas",         genre: ["Crime","Drama","Biography"],                  year: 1990, rating: 8.7, ageRating: "R",     kids: false, poster: "🔫", description: "The story of Henry Hill and his life in the mob." },
  { id: 22, title: "WALL-E",             genre: ["Animation","Family","Sci-Fi","Romance"],      year: 2008, rating: 8.4, ageRating: "G",     kids: true,  poster: "🤖", description: "A small waste-collecting robot falls in love and helps save Earth." },
  { id: 23, title: "Fight Club",         genre: ["Drama","Thriller"],                           year: 1999, rating: 8.8, ageRating: "R",     kids: false, poster: "👊", description: "An insomniac office worker and a soap salesman build a network of fight clubs." },
  { id: 24, title: "Encanto",            genre: ["Animation","Family","Musical","Fantasy"],     year: 2021, rating: 7.2, ageRating: "PG",    kids: true,  poster: "🦋", description: "A magical family in Colombia discovers not all of their powers are what they seem." },
  { id: 25, title: "Whiplash",           genre: ["Drama","Music"],                              year: 2014, rating: 8.5, ageRating: "R",     kids: false, poster: "🥁", description: "A young drummer pursues greatness under the tutelage of a ruthless conductor." },
];

async function seed() {
  const conn = await mysql.createConnection(DB_CONFIG);
  console.log('✅  Connected to MySQL');

  try {
    // ── Insert default user ─────────────────────────────────
    await conn.execute(
      `INSERT IGNORE INTO users (id, username) VALUES (1, 'guest')`,
    );
    console.log('👤  Default user created (id=1, username="guest")');

    // ── Collect all unique genres ───────────────────────────
    const allGenres = [...new Set(MOVIES.flatMap(m => m.genre))];
    for (const name of allGenres) {
      await conn.execute(`INSERT IGNORE INTO genres (name) VALUES (?)`, [name]);
    }
    console.log(`🎭  Inserted ${allGenres.length} genres`);

    // ── Insert movies + movie_genres ────────────────────────
    for (const m of MOVIES) {
      await conn.execute(
        `INSERT IGNORE INTO movies (id, title, year, rating, age_rating, is_kids, poster, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [m.id, m.title, m.year, m.rating, m.ageRating, m.kids, m.poster, m.description],
      );

      for (const genre of m.genre) {
        await conn.execute(
          `INSERT IGNORE INTO movie_genres (movie_id, genre_id)
           SELECT ?, id FROM genres WHERE name = ?`,
          [m.id, genre],
        );
      }
    }
    console.log(`🎬  Inserted ${MOVIES.length} movies with genre mappings`);
    console.log('\n🎉  Seed complete! Run "node server.js" to start the API.');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await conn.end();
  }
}

seed();
