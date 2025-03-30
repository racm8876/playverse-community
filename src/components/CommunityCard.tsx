
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Community {
  id: string;
  name: string;
  description: string;
  image: string;
  game: string;
  members: number;
  tags: string[];
}

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={community.image || "/placeholder.svg"} 
          alt={community.name}
          className="object-cover w-full h-full transition-transform hover:scale-105" 
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex gap-2 flex-wrap mb-2">
          <Badge variant="outline">{community.game}</Badge>
        </div>
        <CardTitle className="line-clamp-1 text-lg">{community.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-foreground/70 text-sm line-clamp-3">{community.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {community.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="flex items-center gap-1 text-sm text-foreground/70">
          <Users size={16} />
          <span>{community.members.toLocaleString()} members</span>
        </div>
        <Button size="sm">Join</Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
