
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";
import { getGames } from "../lib/api";
import { Game } from "../lib/types";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Search } from "lucide-react";

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

  const genres = Array.from(new Set(games.map(game => game.genre)));
  const platforms = Array.from(
    new Set(
      games.flatMap(game => game.platform)
    )
  );

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const gamesData = await getGames();
        setGames(gamesData);
        setFilteredGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = games;
    
    if (searchQuery) {
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedGenre) {
      filtered = filtered.filter(game => game.genre === selectedGenre);
    }
    
    if (selectedPlatform) {
      filtered = filtered.filter(game => 
        game.platform.includes(selectedPlatform)
      );
    }
    
    setFilteredGames(filtered);
  }, [searchQuery, selectedGenre, selectedPlatform, games]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedPlatform("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Games</h1>
          <p className="text-foreground/70">
            Browse and discover games from various genres and platforms.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 mb-8 border border-muted">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-genres">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-platforms">All Platforms</SelectItem>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between mt-4">
            <span className="text-sm text-foreground/70">
              {filteredGames.length} games found
            </span>
            <button
              onClick={handleReset}
              className="text-sm text-primary hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-muted animate-pulse rounded-lg h-72"></div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No games found</h3>
            <p className="text-foreground/70">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
      
      <footer className="bg-card py-8 border-t border-muted mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-foreground/70">
            &copy; {new Date().getFullYear()} PlayVerse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Games;
