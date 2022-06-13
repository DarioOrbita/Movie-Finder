//Global variables
var searchFormEl = document.querySelector("#search-form");
var movieInputEl = document.querySelector("#movie");


// Get the modal
var modal = document.getElementById("searchErrorModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// End of the modal


var formSubmitHandler = function(event) {
  event.preventDefault();
  var movieSearch = movieInputEl.value.trim();

  if(movieSearch){
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
  let apiUrl = `http://www.omdbapi.com/?apikey=6f4894da&s=${title}&type=movie`;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.Response == "True") {
          console.log(data);
        } else {
          console.log("No results found");
        }
      });
    }
  });
};

getMovieData("Titanic");

// Rapid API key and information
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "1774a9d9a4msh3d5ab8dccfaba81p16aa11jsn04224306a9e9",
    "X-RapidAPI-Host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
  },
};

const getPlatforms = function (title) {
  let apiUrl = `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${title}&country=us`;
  // MUST Inlcude options in fetch request
  fetch(apiUrl, options).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    }
  });
};

getPlatforms("Titanic");

searchFormEl.addEventListener('submit', formSubmitHandler)


