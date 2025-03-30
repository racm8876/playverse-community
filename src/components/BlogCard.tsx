
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  readTime: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={blog.image || "/placeholder.svg"} 
          alt={blog.title}
          className="object-cover w-full h-full transition-transform hover:scale-105" 
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex gap-2 flex-wrap mb-2">
          {blog.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="line-clamp-2 text-lg">{blog.title}</CardTitle>
        <CardDescription className="flex items-center text-xs gap-1">
          <User size={12} /> {blog.author}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-foreground/70 text-sm line-clamp-3">{blog.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-foreground/60 flex justify-between">
        <div className="flex items-center gap-1">
          <CalendarIcon size={12} />
          <span>{formatDistanceToNow(new Date(blog.date), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{blog.readTime}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
