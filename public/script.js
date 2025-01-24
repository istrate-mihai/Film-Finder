import config from './config.js';

const tmdbKey     = config.apiKey;
const tmdbBaseUrl = 'https://api.themoviedb.org/3/';
const playBtn     = document.getElementById('playBtn');

const getGenres = async () => {
  const genreRequestEndPoint  = 'genre/movie/list?';
  const requestParams         = 'api_key=' + tmdbKey;
  const urlToFetch            = tmdbBaseUrl + genreRequestEndPoint + requestParams;

  try {
    const response = await fetch(urlToFetch);

    if (response.ok) {
      const jsonResponse = await response.json();
      const genres       = jsonResponse.genres;

      return genres;
    }
  } catch(error) {
    console.log(error);
  }
};

const getMovies = async () => {
  const selectedGenre         = getSelectedGenre();
  const discoverMovieEndpoint = 'discover/movie?';
  const requestParams         = 'api_key=' + tmdbKey + '&with_genres=' + selectedGenre;

  const urlToFetch = tmdbBaseUrl + discoverMovieEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);

    if (response.ok) {
      const jsonResponse = await response.json();
      const movies       = jsonResponse.results;

      return movies;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMovieInfo = async (movie) => {
  const movieId       = movie.id;
  const movieEndpoint = 'movie/' + movieId;
  const requestParams = '?api_key=' + tmdbKey;
  const urlToFetch    = tmdbBaseUrl + movieEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);

    if (response.ok) {
      const movieInfo = await response.json();
      return movieInfo;
    }
  } catch(error) {
    console.log(error);
  }
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');

  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };

  const movies      = await getMovies();
  const randomMovie = getRandomMovie(movies);
  const info        = await getMovieInfo(randomMovie);

  displayMovie(info);
  showBtns();
};

// Clear the current movie from the screen
const clearCurrentMovie = () => {
  const moviePosterDiv           = document.getElementById('moviePoster');
  const movieTextDiv             = document.getElementById('movieText');
  moviePosterDiv.innerHTML       = '';
  movieTextDiv.innerHTML         = '';
  const likeDislikeContainer     = document.getElementById('likeOrDislikeBtns');
  likeDislikeContainer.className = 'hidden';
}
// After liking a movie, clears the current movie from the screen and gets another random movie
const likeMovie = () => {
  clearCurrentMovie();
  showRandomMovie();
};

// After disliking a movie, clears the current movie from the screen and gets another random movie
const dislikeMovie = () => {
  clearCurrentMovie();
  showRandomMovie();
};

// Displays the like and dislike buttons on the page
const showBtns = () => {
  const btnDiv       = document.getElementById('likeOrDislikeBtns');
  btnDiv.removeAttribute('hidden');
  const likeBtn      = document.getElementById('likeBtn');
  const dislikeBtn   = document.getElementById('dislikeBtn');
  likeBtn.onclick    = likeMovie;
  dislikeBtn.onclick = dislikeMovie;
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;
