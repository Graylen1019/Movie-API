let movies;

document
  //add event listener to the form and make it search for movie
  .querySelector(".search__form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchInput = document.querySelector(".search__input").value;
    await renderMovies(searchInput);
  });

async function renderMovies(searchQuery = "") {
  const moviesWrapper = document.querySelector(".movies__wrapper");
  const filterSelect = document.querySelector("#filter");

  const moviesData = await fetch(
    `https://www.omdbapi.com/?s=${searchQuery}&apikey=d591ddbf`
  );
  const moviesResponse = await moviesData.json();

  //.slice(0, 6) to show only 6 movies
  let moviesList = (moviesResponse.Search || []).slice(0, 6);

  // Show loading state
  moviesWrapper.innerHTML = `<div class="movies__loading"></div>`;

  setTimeout(() => {
    // Check if there are any movies found
    if (moviesList.length === 0) {
      moviesWrapper.innerHTML = `<div class="movies__error--wrapper">
                                  <p class="movies__error">No movies found.<br> Please try a different search!</p>
                                  <i class="fa-solid fa-ban error-img"></i>
                                </div>`;
      return;
    }

    // Sort movies based on the selected filter
    const filterValue = filterSelect.value;
    if (filterValue === "YEAR_ASC") {
      moviesList.sort((a, b) => a.Year - b.Year);
    } else if (filterValue === "YEAR_DSC") {
      moviesList.sort((a, b) => b.Year - a.Year);
    }

    // Reset the filter dropdown to default value
    filter.value = "DEFAULT";

    const moviesHTML = moviesList
      //filter the movies to show only movies and not series
      .filter((movie) => movie.Type === "movie")
      //map through the movies and return the html for each movie
      .map((movie) => {
        return `<div class="movie">
      <figure class="movie__img--wrapper">
      <img src="${movie.Poster}" alt="${movie.Title}" class="movie__image" />
      </figure>
      <h2 class="movie__title">${movie.Title}</h2>
      <p class="movie__description">Year: ${movie.Year}</p>
      </div>`;
    })
      .join("");

    moviesWrapper.innerHTML = moviesHTML;
  }, 2000);
}

// Add event listener to the filter dropdown
document.querySelector("#filter").addEventListener("change", () => {
  const searchInput = document.querySelector(".search__input").value;
  renderMovies(searchInput);
});

renderMovies();
