const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

let movies = [{"id":1,"title":"Dune","production_date":"2024-05-08","producer":"Denis Villeneuve","rating":"8.5"},
{"id":2,"title":"Fast X","production_date":"2024-04-29","producer":"Vin Diesel","rating":"7.1"},
{"id":3,"title":"Oblivion","production_date":"2024-05-31","producer":"Joseph Kosinski","rating":"8.1"},
{"id":4,"title":"Bloodshot","production_date":"2021-06-23","producer":"Neal Moritz","rating":"7.7"},
{"id":5,"title":"Skyfall","production_date":"2024-06-01","producer":"Anthony Wade","rating":"7.8"},
{"id":6,"title":"Kung Fu Panda 3","production_date":"2024-05-06","producer":"Alessandro Carloni","rating":"9.2"},
{"id":7,"title":"No Time To Die","production_date":"2024-05-28","producer":"Barbara Broccoli","rating":"8.7"},
{"id":8,"title":"Jason Bourne","production_date":"2024-06-05","producer":"Matt Damon","rating":"6.9"},
{"id":9,"title":"Alien","production_date":"1978-06-23","producer":"Ridley Scott","rating":"9.3"},
{"id":10,"title":"The Terminator","production_date":"1988-05-23","producer":"Gile Anne Hurd","rating":"9.1"}];
let currentId = 11;

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
