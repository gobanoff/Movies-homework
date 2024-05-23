const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

let movies = [];
let currentId = 1;

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
app.post('/movies', (req, res) => {
    const { title, production_date, producer, rating } = req.body;
    const newMovie = {
        id: currentId++,
        title,
        production_date,
        producer,
        rating
    };
    movies.push(newMovie);
    newMovie.production_date = formatDate(newMovie.production_date);
    res.json(newMovie);
});

// Read all movies
app.get('/movies', (req, res) => {
    const formattedMovies = movies.map(movie => ({
        ...movie,
        production_date: formatDate(movie.production_date)
    }));
    res.json(formattedMovies);
});

// Read a single movie by ID
app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(m => m.id == id);
    if (movie) {
        movie.production_date = formatDate(movie.production_date);
        res.json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

// Update a movie
app.put('/movies/:id', (req, res) => {
    const { id } = req.params;
    const { title, production_date, producer, rating } = req.body;
    const movieIndex = movies.findIndex(m => m.id == id);
    if (movieIndex !== -1) {
        const updatedMovie = {
            id: parseInt(id),
            title,
            production_date,
            producer,
            rating
        };
        movies[movieIndex] = updatedMovie;
        updatedMovie.production_date = formatDate(updatedMovie.production_date);
        res.json(updatedMovie);
    } else {
        res.status(404).send('Movie not found');
    }
});

// Delete a movie
app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(m => m.id == id);
    if (movieIndex !== -1) {
        movies.splice(movieIndex, 1);
        res.sendStatus(204);
    } else {
        res.status(404).send('Movie not found');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
