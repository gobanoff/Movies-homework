document.addEventListener("DOMContentLoaded", () => {
  const movieForm = document.getElementById("movie-form");
  const moviesList = document.getElementById("movies-list");

  const API_URL = "http://localhost:3000/movies";

  // Fetch and display movies
  const fetchMovies = async () => {
    const response = await fetch(API_URL);
    const movies = await response.json();
    moviesList.innerHTML = "";
    movies.forEach((movie) => {
      const formattedDate = new Date(movie.production_date)
        .toISOString()
        .split("T")[0];
      const li = document.createElement("li");
      li.innerHTML = `
     <span><span class="title">${movie.title} </span>(Producer: ${movie.producer}, Rating: ${movie.rating}, Date: ${formattedDate})</span>
     <button data-id="${movie.id}" class="delete">Delete</button>
            `;
      moviesList.appendChild(li);
    });
  };

  // Add a new movie
  movieForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const production_date = document.getElementById("production_date").value;
    const producer = document.getElementById("producer").value;
    const rating = document.getElementById("rating").value;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, production_date, producer, rating }),
    });

    fetchMovies();
    movieForm.reset();
  });

  // Delete a movie
  moviesList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete")) {
      const id = e.target.getAttribute("data-id");
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchMovies();
    }
  });

  fetchMovies();
});
