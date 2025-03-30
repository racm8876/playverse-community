
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import { getBlogs } from "../lib/api";
import { Blog } from "../lib/types";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Search } from "lucide-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const tags = Array.from(
    new Set(
      blogs.flatMap(blog => blog.tags)
    )
  );

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const blogsData = await getBlogs();
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;
    
    if (searchQuery) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(blog => 
        blog.tags.includes(selectedTag)
      );
    }
    
    setFilteredBlogs(filtered);
  }, [searchQuery, selectedTag, blogs]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedTag("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gaming News & Articles</h1>
          <p className="text-foreground/70">
            Stay up-to-date with the latest gaming news, tips, and stories.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 mb-8 border border-muted">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
              <Input
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Select Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
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
              {filteredBlogs.length} articles found
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-muted animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
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

export default Blogs;
