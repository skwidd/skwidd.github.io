let movies
let currentMovie
let clueIndex = 0

const clueOrder = ["Profanity", "Sex", "Violence", "Drugs", "Intense Scene"]

// Load movies from JSON file
fetch("movies.json")
    .then((response) => response.json())
    .then((data) => {
        movies = data
        startNewGame()
    })

function startNewGame() {
    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format
    currentMovie = movies.find(({date}) => movies.date === today) || movies[Math.floor(Math.random() * movies.length)];
    clueIndex = 0;
    document.getElementById("rating").textContent = currentMovie.rating;
    //document.getElementById("movie").textContent = currentMovie.title;
    document.getElementById("date").textContent = ${ currentMovie.date };
    document.getElementById("today").textContent = today;
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
