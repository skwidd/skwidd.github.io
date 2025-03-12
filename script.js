let movies;
let currentMovie;
let clueIndex = 0;

// Load movies from JSON file
fetch('movies.json')
    .then(response => response.json())
    .then(data => {
        movies = data;
        startNewGame();
    });

function startNewGame() {
    currentMovie = movies[Math.floor(Math.random() * movies.length)];
    clueIndex = 0;
    document.getElementById("clue").textContent = currentMovie.clues[clueIndex];
    document.getElementById("message").textContent = "";
    document.getElementById("guessInput").value = "";
}

function checkGuess() {
    let userGuess = document.getElementById("guessInput").value.trim().toLowerCase();
    if (userGuess === currentMovie.title.toLowerCase()) {
        document.getElementById("message").textContent = "Correct! The movie was " + currentMovie.title + "!";
    } else {
        clueIndex++;
        if (clueIndex < currentMovie.clues.length) {
            document.getElementById("clue").textContent = currentMovie.clues[clueIndex];
        } else {
            document.getElementById("message").textContent = "Out of clues! The movie was " + currentMovie.title + ". Try again!";
            setTimeout(startNewGame, 2000);
        }
    }
}
