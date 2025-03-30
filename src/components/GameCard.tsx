
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  genre: string;
  platform: string[];
  releaseDate: string;
  rating: number;
  price: string;
}

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={game.image || "/placeholder.svg"} 
          alt={game.title}
          className="object-cover w-full h-full transition-transform hover:scale-105" 
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{game.genre}</Badge>
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 stroke-yellow-400" size={14} />
            <span className="text-sm font-medium">{game.rating}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-1 text-lg">{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-foreground/70 text-sm line-clamp-2">{game.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="flex flex-wrap gap-1">
          {game.platform.slice(0, 3).map((platform) => (
            <Badge key={platform} variant="secondary" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>
        <span className="font-medium">{game.price}</span>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
