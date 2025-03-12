let movies = [
    {
        "title": "Inception",
        "rating": "PG-13",
        "date": "2025-03-12",
        "year": "2010",
        "runtime": "2h 28m",
        "clues": {
            "Profanity": "A few occasional uses of 'shit', 'crap' and 'piss'.",
            "Sex": "There is a single kiss in a non-romantic context.",
            "Violence": "A man knocks another man off a snowmobile.",
            "Drugs": "People drink wine and beer. Sedative medications and other mysterious concoctions are required to put people into these dreamlike states.",
            "Intense Scene": "Some concepts in the movie are potentially derealizing."
        }
    },
    {
        "title": "The Matrix",
        "rating": "R",
        "date": "2025-03-13",
        "clues": {
            "Profanity": "Several uses of 'shit' and 'damn', one use of 'goddamn'.",
            "Sex": "Brief scene of a man and woman kissing passionately.",
            "Violence": "Multiple intense gunfights and martial arts sequences with characters being shot and hit.",
            "Drugs": "A character takes a red pill which is metaphorical, not a real drug.",
            "Intense Scene": "Scenes of reality-bending and dystopian imagery may be unsettling to some viewers."
        }
    },
    {
        "title": "Titanic",
        "rating": "PG-13",
        "date": "2025-03-14",
        "clues": {
            "Profanity": "Mild profanity including 'hell' and 'damn'.",
            "Sex": "A brief scene of nudity as a woman poses for a painting, followed by an implied love scene.",
            "Violence": "People struggle to escape as the ship sinks, with some falling to their deaths.",
            "Drugs": "Characters drink wine and champagne during dinner scenes.",
            "Intense Scene": "The sinking sequence is very intense and emotional, with people screaming and drowning."
        }
    }
];
let clueIndex = 0

const clueOrder = ["Profanity", "Sex", "Violence", "Drugs", "Intense Scene"]

function startNewGame() {
    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format

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
            "Correct! The movie was " + currentMovie.title + "!"
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
