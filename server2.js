const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// PostgreSQL pool setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'moviebase',
    password: 'postgres',
    port: 5432,
});
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
// CRUD Operations

// Create a movie
app.post('/movies', async (req, res) => {
    const { title, production_date, producer, rating } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO movies (title, production_date, producer, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [title,production_date , producer, rating]
        );
        const movie = result.rows[0];
        movie.production_date = formatDate(movie.production_date);
        res.json(movie);
        
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Read all movies
app.get('/movies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movies');
        const movies = result.rows.map(movie => ({
            ...movie,
            production_date: formatDate(movie.production_date)
        }));
        res.json(movies);
        //res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Read a single movie by ID
app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
        const movie = result.rows[0];
        if (movie) {
            movie.production_date = formatDate(movie.production_date);
            res.json(movie);
        } else {
            res.status(404).send('Movie not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


  
       // res.json(result.rows[0]);
  


// Update a movie
app.put('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { title, production_date, producer, rating } = req.body;
    try {
        const result = await pool.query(
            'UPDATE movies SET title = $1, production_date = $2, producer = $3, rating = $4 WHERE id = $5 RETURNING *',
            [title, production_date, producer, rating, id]
        );
        const movie = result.rows[0];
        movie.production_date = formatDate(movie.production_date);
        res.json(movie);
        //res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM movies WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
