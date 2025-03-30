
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CommunityCard from "../components/CommunityCard";
import { getCommunities } from "../lib/api";
import { Community } from "../lib/types";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Search } from "lucide-react";

const Communities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const games = Array.from(new Set(communities.map(community => community.game)));
  const tags = Array.from(
    new Set(
      communities.flatMap(community => community.tags)
    )
  );

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        const communitiesData = await getCommunities();
        setCommunities(communitiesData);
        setFilteredCommunities(communitiesData);
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    let filtered = communities;
    
    if (searchQuery) {
      filtered = filtered.filter(community => 
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedGame) {
      filtered = filtered.filter(community => community.game === selectedGame);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(community => 
        community.tags.includes(selectedTag)
      );
    }
    
    setFilteredCommunities(filtered);
  }, [searchQuery, selectedGame, selectedTag, communities]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedGame("");
    setSelectedTag("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gaming Communities</h1>
          <p className="text-foreground/70">
            Join communities of gamers who share your interests and passion.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 mb-8 border border-muted">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
              <Input
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger>
                <SelectValue placeholder="Select Game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-games">All Games</SelectItem>
                {games.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Select Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-tags">All Tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between mt-4">
            <span className="text-sm text-foreground/70">
              {filteredCommunities.length} communities found
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
        ) : filteredCommunities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No communities found</h3>
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

export default Communities;
