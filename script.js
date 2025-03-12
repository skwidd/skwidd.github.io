let clueIndex = 0
let movies;

fetch('./movies.json')
.then(res => res.json())
.then(data => {
    console.log(data);
    movies = data;
});

const clueOrder = ["Profanity", "Sex", "Violence", "Drugs", "Intense Scene"]
function startNewGame() {
    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format
    const currentMovie = movies.find(movies => movies.date === today);
    //document.getElementById("message").textContent = movies[0].title;
    console.log(currentMovie.title);
    clueIndex = 0;
    document.getElementById("rating").textContent = currentMovie.rating;
    document.getElementById("year").textContent = currentMovie.year;
    document.getElementById("fbombs").textContent = currentMovie.fbombs;
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
