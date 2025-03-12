let currentMovie
let clueIndex = 0

const clueOrder = ["Profanity", "Sex", "Violence", "Drugs", "Intense Scene"]
var movies = require("/movies.json");

function startNewGame() {
    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format
    document.getElementById("today").textContent = today;

    currentMovie = movies.find(movies => movies.date === today);
    if (!currentMovie) {
        document.getElementById("date").textContent = "movie not found";
    } else {
        document.getElementById("date").textContent = currentMovie.date;
    }
    clueIndex = 0;
    document.getElementById("rating").textContent = currentMovie.rating;
    //document.getElementById("movie").textContent = currentMovie.title;

    document.getElementById("clue0").textContent = `${currentMovie.clues[clueOrder[clueIndex]]}`;
    document.getElementById("message").textContent = "";
    document.getElementById("guessInput").value = "";
}

function checkGuess() {
    let userGuess = document
        .getElementById("guessInput")
        .value.trim()
        .toLowerCase()
    document.getElementById("date").textContent = userGuess + " " + currentMovie.title.toLowerCase();
    if (userGuess === currentMovie.title.toLowerCase()) {
        document.getElementById("message").textContent =
            "Correct! The movie was " + currentMovie.title + "!"
    } else {
        clueIndex++
        if (clueIndex < clueOrder.length) {
            document.getElementById("clue" + clueIndex).textContent =
                `${clueOrder[clueIndex]}: ${currentMovie.clues[clueOrder[clueIndex]]}`
        } else {
            document.getElementById("message").textContent =
                "Out of clues! The movie was " + currentMovie.title + ". Try again!"
            setTimeout(selectMovieForToday, 2000)
        }
    }
}
