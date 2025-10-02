import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Film } from "lucide-react";

interface Movie {
  title: string;
  rating: string;
  date: string;
  year: string;
  fbombs: string;
  clues: {
    Profanity: string;
    Sex: string;
    Violence: string;
    Drugs: string;
    "Intense Scene": string;
  };
}

const clueOrder: (keyof Movie["clues"])[] = [
  "Profanity",
  "Sex",
  "Violence",
  "Drugs",
  "Intense Scene",
];

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [clueIndex, setClueIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/movies.json")
      .then((res) => res.json())
      .then((data: Movie[]) => {
        setMovies(data);
        const today = new Date().toISOString().split("T")[0];
        const todaysMovie = data.find((movie) => movie.date === today);
        if (todaysMovie) {
          setCurrentMovie(todaysMovie);
        } else {
          // Fallback to first movie if no match for today
          setCurrentMovie(data[0]);
        }
      })
      .catch((error) => {
        console.error("Error loading movies:", error);
        toast({
          title: "Error",
          description: "Failed to load movie data",
          variant: "destructive",
        });
      });
  }, [toast]);

  const handleInputChange = (value: string) => {
    setGuess(value);
    
    if (value.trim().length > 0) {
      const filtered = movies
        .map((m) => m.title)
        .filter((title) => title.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (title: string) => {
    setGuess(title);
    setShowSuggestions(false);
    setSuggestions([]);
    // Blur the input to prevent additional typing
    inputRef.current?.blur();
  };

  const handleGuess = () => {
    if (!currentMovie || gameOver) return;

    const userGuess = guess.trim();
    
    // Validate that the guess is an actual movie title from the list
    const isValidMovie = movies.some(
      (movie) => movie.title.toLowerCase() === userGuess.toLowerCase()
    );

    if (!isValidMovie) {
      toast({
        title: "Invalid Entry",
        description: "Please select a valid movie title from the suggestions.",
        variant: "destructive",
      });
      return;
    }

    const correctTitle = currentMovie.title.toLowerCase();

    if (userGuess.toLowerCase() === correctTitle) {
      setWon(true);
      setGameOver(true);
      toast({
        title: "🎉 Correct!",
        description: `The movie was "${currentMovie.title}"! You got it in ${
          clueIndex + 1
        } ${clueIndex === 0 ? "guess" : "guesses"}!`,
      });
    } else {
      if (clueIndex < clueOrder.length - 1) {
        setClueIndex(clueIndex + 1);
        toast({
          title: "Incorrect",
          description: "Try again with the next clue!",
          variant: "destructive",
        });
      } else {
        setGameOver(true);
        toast({
          title: "Game Over",
          description: `The movie was "${currentMovie.title}". Better luck tomorrow!`,
          variant: "destructive",
        });
      }
    }
    setGuess("");
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGuess();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  if (!currentMovie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Film className="mx-auto mb-4 h-12 w-12 animate-pulse text-primary" />
          <p className="text-xl text-muted-foreground">Loading today's puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Film className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">
              Parental <span className="text-primary">Guidance</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Guess the movie from its parental guide
          </p>
        </header>

        <Card className="mb-6 border-border bg-card p-6 shadow-lg">
          <div className="mb-6 flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="rounded-lg bg-secondary px-4 py-2">
              <span className="font-semibold text-category">Rating:</span>{" "}
              <span className="text-foreground">{currentMovie.rating}</span>
            </div>
            <div className="rounded-lg bg-secondary px-4 py-2">
              <span className="font-semibold text-category">Year:</span>{" "}
              <span className="text-foreground">{currentMovie.year}</span>
            </div>
            <div className="rounded-lg bg-secondary px-4 py-2">
              <span className="font-semibold text-category">F-Bombs:</span>{" "}
              <span className="text-foreground">{currentMovie.fbombs}</span>
            </div>
          </div>

          <div className="space-y-3">
            {clueOrder.map((category, index) => (
              <div
                key={category}
                className={`rounded-lg border border-border p-4 transition-all duration-300 ${
                  index <= clueIndex
                    ? "bg-clue-revealed opacity-100"
                    : "bg-clue-bg opacity-40"
                }`}
              >
                <div className="font-semibold text-category">{category}:</div>
                <div className="mt-1 text-sm text-foreground md:text-base">
                  {index <= clueIndex ? (
                    currentMovie.clues[category]
                  ) : (
                    <span className="text-muted-foreground">???</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {!gameOver && (
          <Card className="border-border bg-card p-6 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter movie title..."
                  value={guess}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  className="border-border bg-input text-foreground placeholder:text-muted-foreground"
                  disabled={gameOver}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
                    {suggestions.map((title, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectSuggestion(title)}
                        className="w-full px-4 py-2 text-left text-foreground hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={handleGuess}
                disabled={gameOver || !guess.trim()}
                className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Submit Guess
              </Button>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {clueIndex + 1} of {clueOrder.length} clues revealed
            </p>
          </Card>
        )}

        {gameOver && (
          <Card
            className={`border-2 p-6 text-center shadow-lg ${
              won ? "border-success bg-success/10" : "border-error bg-error/10"
            }`}
          >
            <h2
              className={`mb-2 text-2xl font-bold ${
                won ? "text-success" : "text-error"
              }`}
            >
              {won ? "🎉 Congratulations!" : "Game Over"}
            </h2>
            <p className="text-lg text-foreground">
              The movie was{" "}
              <span className="font-bold text-primary">"{currentMovie.title}"</span>
            </p>
            {won && (
              <p className="mt-2 text-muted-foreground">
                You solved it in {clueIndex + 1}{" "}
                {clueIndex === 0 ? "guess" : "guesses"}!
              </p>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Come back tomorrow for a new puzzle!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
