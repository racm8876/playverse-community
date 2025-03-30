
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { gameService, blogService, communityService } from "@/lib/apiService";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Game form state
  const [gameForm, setGameForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    genre: '',
    platform: ['PC'],
    releaseDate: '',
    rating: 0
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    tags: []
  });

  // Community form state
  const [communityForm, setCommunityForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    game: '',
    tags: []
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [platformInput, setPlatformInput] = useState('');
  
  // Games for community creation
  const [games, setGames] = useState([]);

  // Fetch games on component mount for community creation dropdown
  React.useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await gameService.getAll();
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  // Handle game form change
  const handleGameFormChange = (e) => {
    const { name, value } = e.target;
    setGameForm({
      ...gameForm,
      [name]: value
    });
  };

  // Handle blog form change
  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    setBlogForm({
      ...blogForm,
      [name]: value
    });
  };

  // Handle community form change
  const handleCommunityFormChange = (e) => {
    const { name, value } = e.target;
    setCommunityForm({
      ...communityForm,
      [name]: value
    });
  };

  // Add platform to game form
  const handleAddPlatform = () => {
    if (platformInput && !gameForm.platform.includes(platformInput)) {
      setGameForm({
        ...gameForm,
        platform: [...gameForm.platform, platformInput]
      });
      setPlatformInput('');
    }
  };

  // Remove platform from game form
  const handleRemovePlatform = (platform) => {
    setGameForm({
      ...gameForm,
      platform: gameForm.platform.filter(p => p !== platform)
    });
  };

  // Add tag to blog form
  const handleAddBlogTag = () => {
    if (tagInput && !blogForm.tags.includes(tagInput)) {
      setBlogForm({
        ...blogForm,
        tags: [...blogForm.tags, tagInput]
      });
      setTagInput('');
    }
  };

  // Remove tag from blog form
  const handleRemoveBlogTag = (tag) => {
    setBlogForm({
      ...blogForm,
      tags: blogForm.tags.filter(t => t !== tag)
    });
  };

  // Add tag to community form
  const handleAddCommunityTag = () => {
    if (tagInput && !communityForm.tags.includes(tagInput)) {
      setCommunityForm({
        ...communityForm,
        tags: [...communityForm.tags, tagInput]
      });
      setTagInput('');
    }
  };

  // Remove tag from community form
  const handleRemoveCommunityTag = (tag) => {
    setCommunityForm({
      ...communityForm,
      tags: communityForm.tags.filter(t => t !== tag)
    });
  };

  // Submit game form
  const handleGameSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create new game
      await gameService.create(gameForm);
      
      // Reset form
      setGameForm({
        title: '',
        description: '',
        imageUrl: '',
        genre: '',
        platform: ['PC'],
        releaseDate: '',
        rating: 0
      });
      
      toast({
        title: "Success",
        description: "Game created successfully!",
      });
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Submit blog form
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create new blog
      await blogService.create(blogForm);
      
      // Reset form
      setBlogForm({
        title: '',
        content: '',
        imageUrl: '',
        tags: []
      });
      
      toast({
        title: "Success",
        description: "Blog created successfully!",
      });
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        title: "Error",
        description: "Failed to create blog. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Submit community form
  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create new community
      await communityService.create(communityForm);
      
      // Reset form
      setCommunityForm({
        name: '',
        description: '',
        imageUrl: '',
        game: '',
        tags: []
      });
      
      toast({
        title: "Success",
        description: "Community created successfully!",
      });
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
          </TabsList>
          
          {/* Games Tab */}
          <TabsContent value="games">
            <Card>
              <CardHeader>
                <CardTitle>Add New Game</CardTitle>
                <CardDescription>
                  Create a new game for the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGameSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={gameForm.title} 
                        onChange={handleGameFormChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Input 
                        id="genre" 
                        name="genre" 
                        value={gameForm.genre} 
                        onChange={handleGameFormChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={gameForm.description} 
                      onChange={handleGameFormChange} 
                      required 
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input 
                        id="imageUrl" 
                        name="imageUrl" 
                        value={gameForm.imageUrl} 
                        onChange={handleGameFormChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="releaseDate">Release Date</Label>
                      <Input 
                        id="releaseDate" 
                        name="releaseDate" 
                        type="date" 
                        value={gameForm.releaseDate} 
                        onChange={handleGameFormChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input 
                      id="rating" 
                      name="rating" 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.1" 
                      value={gameForm.rating} 
                      onChange={handleGameFormChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Platforms</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {gameForm.platform.map((platform) => (
                        <div key={platform} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2">
                          {platform}
                          <button 
                            type="button" 
                            onClick={() => handleRemovePlatform(platform)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={platformInput}
                        onChange={(e) => setPlatformInput(e.target.value)}
                        placeholder="Add platform..."
                      />
                      <Button type="button" onClick={handleAddPlatform} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Game</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Blogs Tab */}
          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <CardTitle>Add New Blog</CardTitle>
                <CardDescription>
                  Create a new blog post for the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="blogTitle">Title</Label>
                    <Input 
                      id="blogTitle" 
                      name="title" 
                      value={blogForm.title} 
                      onChange={handleBlogFormChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="blogContent">Content</Label>
                    <Textarea 
                      id="blogContent" 
                      name="content" 
                      value={blogForm.content} 
                      onChange={handleBlogFormChange} 
                      required 
                      rows={8}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="blogImageUrl">Image URL</Label>
                    <Input 
                      id="blogImageUrl" 
                      name="imageUrl" 
                      value={blogForm.imageUrl} 
                      onChange={handleBlogFormChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blogForm.tags.map((tag) => (
                        <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2">
                          {tag}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveBlogTag(tag)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tag..."
                      />
                      <Button type="button" onClick={handleAddBlogTag} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Blog Post</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Communities Tab */}
          <TabsContent value="communities">
            <Card>
              <CardHeader>
                <CardTitle>Add New Community</CardTitle>
                <CardDescription>
                  Create a new gaming community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommunitySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="communityName">Name</Label>
                    <Input 
                      id="communityName" 
                      name="name" 
                      value={communityForm.name} 
                      onChange={handleCommunityFormChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="communityDescription">Description</Label>
                    <Textarea 
                      id="communityDescription" 
                      name="description" 
                      value={communityForm.description} 
                      onChange={handleCommunityFormChange} 
                      required 
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="communityImageUrl">Image URL</Label>
                    <Input 
                      id="communityImageUrl" 
                      name="imageUrl" 
                      value={communityForm.imageUrl} 
                      onChange={handleCommunityFormChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="communityGame">Associated Game</Label>
                    <Select 
                      value={communityForm.game} 
                      onValueChange={(value) => setCommunityForm({...communityForm, game: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a game" />
                      </SelectTrigger>
                      <SelectContent>
                        {games.map((game) => (
                          <SelectItem key={game._id} value={game._id}>{game.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {communityForm.tags.map((tag) => (
                        <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2">
                          {tag}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveCommunityTag(tag)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tag..."
                      />
                      <Button type="button" onClick={handleAddCommunityTag} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Community</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
