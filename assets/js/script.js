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
  let apiUrl = `https://www.omdbapi.com/?apikey=6f4894da&s=${title}&type=movie`;
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
        let movieData = data;
        fullMovieData.push(movieData);
        // Send to get platforms
        getPlatforms(data.imdbID);
      });
    });
  }
  // Delay displayMoviePosters by 1sec to allow array to update from fetch
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
    // Div to hold image and title
    let movieCoverEl = document.createElement("div");
    movieCoverEl.setAttribute("id", `movie-poster-container-${i}`);
    movieCoverEl.classList.add("border-2", "flex-wrap", "border-red-800", "bg-slate-400", "movie-option");

    // Add title of movie
    let title = document.createElement("h2");
    title.innerHTML = `${fullMovieData[i].Title} (${fullMovieData[i].Year})`;
    movieCoverEl.appendChild(title);

    // Img element to put poster
    let poster = document.createElement("img");
    // Give class of poster
    poster.classList.add("poster");

    if (fullMovieData[i].Poster == "N/A") {
      poster.setAttribute("src", `assets/images/poster_na.jpg`);
    } else {
      // Set img src to selected[i] poster url
      poster.setAttribute("src", `${fullMovieData[i].Poster}`);
    }

    // Ammend poster to div
    movieCoverEl.appendChild(poster);

    // Append div to poster grid
    posterGridEl.appendChild(movieCoverEl);
  }

  // Select each div with the class movie-option
  let movieOption = document.querySelectorAll(".movie-option");
  // Make each option clickable
  movieOption.forEach(function (item) {
    //  Listen for user click
    item.addEventListener("click", function (event) {
      let selection = event.target.parentNode.id;
      selection = selection.split("-");
      selection = selection[3];

      if (selection == null) {
        console.log("click on poster");
      } else {
        displayMovieModal(selection);
        console.log(fullMovieData[selection]);
      }
    });
  });
};

searchFormEl.addEventListener("submit", formSubmitHandler);

// Function to open and populate movieModal
let displayMovieModal = function (arrObj) {
  // Create div to hold modal content
  let movieModal = document.createElement("div");
  movieModal.classList.add("modal");

  // Create div to hold all movie data
  let movieModalContent = document.createElement("div");
  // Give id of movie-modal for styling and locating in the DOM
  movieModalContent.setAttribute("id", "movie-modal");
  movieModalContent.classList.add("modal-content");

  // Span to hold 'x' | Close modal
  let closeMovieEl = document.createElement("span");
  closeMovieEl.classList.add("close");
  closeMovieEl.textContent = `x`;

  // Pull correct movie information from saved fullMovieData[i]
  let movieArr = fullMovieData[arrObj];

  // Create and store movie year data
  let yearEl = document.createElement("span");
  let year = movieArr.Year 
  let plots = movieArr.Plot;
  yearEl.textContent = ` (${year})` + ' - ' + plots;



  // Create h2 to hold movie title
  let titleEl = document.createElement("h2");
  let title = movieArr.Title;
  titleEl.textContent = title;
  // Append first to keep at top of modal
  titleEl.appendChild(yearEl);

  let posterRatingEl = document.createElement("div");
    posterRatingEl.classList.add('poster-rating');

  let poster = document.createElement("img");
  // Give class of poster
  poster.classList.add("poster");

  if (fullMovieData[arrObj].Poster == "N/A") {
    poster.setAttribute("src", `assets/images/poster_na.jpg`);
  } else {
    // Set img src to selected[i] poster url
    poster.setAttribute("src", `${fullMovieData[arrObj].Poster}`);
  }
  posterRatingEl.appendChild(poster);
  // Create and store review
  let reviewDiv = document.createElement("div");
  
   // This gets the source of the review 
  let reviewEl = document.createElement("div");
  let review = movieArr.Ratings[0].Source;
  reviewEl.textContent = `Reviewer: ${review}`;
  
  // This gets the rating/score for the movie
  let ratingsEl = document.createElement("div");
  let rating = movieArr.Ratings[0].Value;
  reviewEl.textContent = `Score: ${rating}`;
 
  

  // Append first to keep at top of modal
  reviewDiv.appendChild(reviewEl);
  reviewDiv.appendChild(ratingsEl);
  posterRatingEl.appendChild(reviewDiv);

 

  // Create unordered list to hold movie data (Plot, rating, runtime, etc.)
  let infoList = document.createElement("ul");

  // Create li to hold movie rating
  let ratedEl = document.createElement("li");
  let rated = movieArr.Rated;
  ratedEl.textContent = `Rated: ${rated}`;

  // Creae li to hold movie runtime
  let runtimeEl = document.createElement("li");
  let runtime = movieArr.Runtime;
  runtimeEl.textContent = `Length: ${runtime}`;

  // Create li to hold actors
  let actorsEl = document.createElement("li");
  let actors = movieArr.Actors;
  actorsEl.textContent = `Starring: ${actors}`;

  // Create li to hold plot
  let plotEl = document.createElement("li");
  let plot = movieArr.Plot;
  plotEl.textContent = plot;

  // Creare li to hold director info
  let directorEl = document.createElement("li");
  let director = movieArr.Director;
  directorEl.textContent = `Director: ${director}`;

  // Create array to hold review ratings (i.e. Rotten Tomatoes)
  let ratings = [];

  // Add div for sreaming services
  let streamingEl = document.createElement("div");
  streamingEl.setAttribute("id", "streaming-services");

  // Get streaming info from select object
  let streaming = platformInfo(arrObj);
  if (streaming == null) {
    console.log("No streaming");
  } else {
    streaming.forEach(function (data) {
      // Div to hold service
      let service = document.createElement("div");

      // Get icon
      let iconEl = document.createElement("img");
      iconEl.setAttribute("src", data.icon);

      // Get link to service page
      let link = document.createElement("a");
      link.setAttribute("href", data.url);
      link.setAttribute("target", "_blank");


      

      // Make icon clickable by putting into link
      link.appendChild(iconEl);

      // Add link + icon to service holder
      service.appendChild(link);

      // Add serive to streaming-services div
      streamingEl.appendChild(service);
    });
  }
  console.log(fullMovieData);

  // Append all list items to unordered list
  infoList.appendChild(ratedEl);
  infoList.appendChild(runtimeEl);
  infoList.appendChild(actorsEl);
  infoList.appendChild(plotEl);
  infoList.appendChild(directorEl);

  // Append elements in order in which to be displayed (close button, title, poster, unordered list)
  movieModalContent.appendChild(closeMovieEl);
  movieModalContent.appendChild(titleEl);
  movieModalContent.appendChild(posterRatingEl);
  movieModalContent.appendChild(infoList);
  movieModalContent.appendChild(streamingEl);
  

  // Append modal container with movieModalContent
  movieModal.appendChild(movieModalContent);

  // Set content to display on page
  movieModal.style.display = "block";

  // Add modal to main grid
  posterGridEl.appendChild(movieModal);

  // Listen for user to close modal
  window.onclick = function (event) {
    if (event.target == closeMovieEl) {
      movieModal.style.display = "none";
      console.log(event.target);
    }
  };
};

// Get stored streamingInfo information
let platformInfo = function (n) {
  // If no streaming available, return null
  if (streamingInfo[n] == null) {
    console.log("No streaming");
    return null;
  }
  // Else get selected movie's streaming information
  let locations = streamingInfo[n].locations;

  // Array to hold information that will be displayed in movie modal
  let streamForDisplay = [];
  // For each location, gather neccessary information (service name, icon, and url)
  locations.forEach(function (data) {
    // Store data in new object
    streamArrObj = { service: data.display_name, icon: data.icon, url: data.url };
    // Push new object to streamForDisplay array
    streamForDisplay.push(streamArrObj);
  });
  // Return streamForDisplay array
  return streamForDisplay;
};
