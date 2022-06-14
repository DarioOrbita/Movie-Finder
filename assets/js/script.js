//Global variables
var searchFormEl = document.querySelector("#search-form");
var movieInputEl = document.querySelector("#movie");

// Holds basic movie data (Poster, Title, Year, IMDb ID)
let movies = [];
// Holds reviews, ratings, runtime, actors, etc.
let fullMovieData = [];
// Holds streaming info for each movie
let streamingInfo = [];

// Poster Grid Container
const posterGridEl = document.querySelector("#results-container");

// Get the modal
var modal = document.getElementById("searchErrorModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// End of the modal

var formSubmitHandler = function (event) {
  event.preventDefault();
  movies = [];
  streamingInfo = [];
  fullMovieData = [];
  var movieSearch = movieInputEl.value.trim();

  if (movieSearch) {
    getMovieData(movieSearch);
    movieInputEl.value = "";
  } else {
    // alert("Please enter a valid movie name!");
    modal.style.display = "block";
  }
  console.log(event);
};

// OMDb API key: 6f4894da
const getMovieData = function (title) {
  // Fetch array of movie results
  let apiUrl = `http://www.omdbapi.com/?apikey=6f4894da&s=${title}&type=movie`;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      // Parse and return array
      response.json().then(function (data) {
        // If data is found
        if (data.Response == "True") {
          let searchResultArray = data.Search;
          for (i = 0; i < searchResultArray.length; i++) {
            // Create variable to hold individual array
            let movieObject = searchResultArray[i].imdbID;
            // Push to movies array to use throughout project
            movies.push(movieObject);
          }
          // Push movies array to get more in depth data
          singleMovieData(movies);
        } else {
          console.log("No results found");
        }
      });
    }
  });
};

// Get more in-depth data about movie, used to pass to getPlatforms and for getting all the data needed for display.
const singleMovieData = function (data) {
  for (i = 0; i < data.length; i++) {
    let id = data[i];

    let apiUrl = `http://www.omdbapi.com/?apikey=6f4894da&i=${id}&type=movie`;
    fetch(apiUrl).then(function (response) {
      // Parse and return array
      response.json().then(function (data) {
        setTimeout(function () {
          let movieData = data;
          fullMovieData.push(movieData);
          // Send to get platforms
          getPlatforms(data.imdbID);
        }, 1000);
      });
    });
  }
  // Delay displayMoviePosters by 2sec to allow array to update from fetch
  setTimeout(displayMoviePosters, 2000);
};

// Searh for streaming services
const getPlatforms = function (id) {
  // Search for id passed into function
  let apiUrl = `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id=${id}&source=imdb&country=us`;
  // Settings / API key
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "1774a9d9a4msh3d5ab8dccfaba81p16aa11jsn04224306a9e9",
      "X-RapidAPI-Host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
    },
  };
  // MUST Inlcude options in fetch request
  fetch(apiUrl, options).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.collection.locations == null) {
          console.log("not streaming");
        } else {
          let streamingObject = data.collection;
          streamingInfo.push(streamingObject);
          console.log(streamingInfo);
        }
      });
    }
  });
};

// Display movie posters
let displayMoviePosters = function () {
  // Clear anything in the poster container
  posterGridEl.innerHTML = "";

  // Go through fullMovieData array to find poster img URLs
  for (i = 0; i < fullMovieData.length; i++) {
    // If not movie poster  url found, skip and console log
    if (fullMovieData[i].Poster == "N/A") {
      console.log("Movie poster not here");
      // Else, create div and img to hold poster
    } else {
      // Div to hold image and title
      let movieCoverEl = document.createElement("div");
      movieCoverEl.setAttribute("id", `movie-poster-container-${i}`);
      movieCoverEl.classList.add("border-2", "flex-wrap", "bg-slate-700", "text-center", "text-white");

      // Add title of movie
      let title = document.createElement("h2");
      title.innerHTML = `${fullMovieData[i].Title} (${fullMovieData[i].Year})`;
      movieCoverEl.appendChild(title);

      // Img element to put poster
      let poster = document.createElement("img");
      // Give class of poster
      poster.classList.add("poster", "max-h-96", "mx-auto");
      poster.setAttribute("movie-id", fullMovieData[i].imdbID);
      // Set img src to selected[i] poster url
      poster.setAttribute("src", `${fullMovieData[i].Poster}`);
      // Ammend poster to div
      movieCoverEl.appendChild(poster);

      // Append div to poster grid
      posterGridEl.appendChild(movieCoverEl);
    }
  }
  console.log(fullMovieData);
};

searchFormEl.addEventListener("submit", formSubmitHandler);
