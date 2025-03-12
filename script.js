let clueIndex = 0
const clueOrder = ["Profanity", "Sex", "Violence", "Drugs", "Intense Scene"]
function startNewGame() {
    const movies = require('./movies.json');
    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format
    document.getElementById("message").textContent = movies[0].title;
    currentMovie = movies.find(movies => movies.date === today);
    clueIndex = 0;
    document.getElementById("rating").textContent = currentMovie.rating;
    document.getElementById("year").textContent = currentMovie.year;
    document.getElementById("runtime").textContent = currentMovie.runtime;
    document.getElementById("clue0").textContent = `${currentMovie.clues[clueOrder[clueIndex]]}`;
    document.getElementById("message").textContent = "";
    document.getElementById("guessInput").value = "";
}

function checkGuess() {
    let userGuess = document
        .getElementById("guessInput")
        .value.trim()
        .toLowerCase()
    //document.getElementById("message").textContent = userGuess + " " + currentMovie.title.toLowerCase();
    if (userGuess === currentMovie.title.toLowerCase()) {
        document.getElementById("message").textContent =
            "Correct! The movie was " + currentMovie.title + "!   You got it in " + (clueIndex + 1) + " Guesses";
    } else {
        clueIndex++
        if (clueIndex < clueOrder.length) {
            document.getElementById("clue" + clueIndex).textContent =
                `${currentMovie.clues[clueOrder[clueIndex]]}`
        } else {
            document.getElementById("message").textContent =
                "Out of clues! The movie was " + currentMovie.title + ". Try again!"
            setTimeout(selectMovieForToday, 2000)
        }
    }
}
