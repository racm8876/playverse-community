
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to PlayVerse
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your ultimate destination for games, communities, and gaming blogs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h2 className="text-2xl font-bold mb-3">Explore Games</h2>
              <p className="text-muted-foreground mb-4">Discover new and trending games across all platforms.</p>
              <Link to="/games">
                <Button>Browse Games</Button>
              </Link>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h2 className="text-2xl font-bold mb-3">Join Communities</h2>
              <p className="text-muted-foreground mb-4">Connect with like-minded gamers and make new friends.</p>
              <Link to="/communities">
                <Button>Find Communities</Button>
              </Link>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <h2 className="text-2xl font-bold mb-3">Read Blogs</h2>
              <p className="text-muted-foreground mb-4">Stay updated with the latest gaming news and reviews.</p>
              <Link to="/blogs">
                <Button>View Blogs</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Join PlayVerse Today!</h2>
            <p className="text-muted-foreground mb-6">Create an account to track your favorite games, join communities, and participate in discussions.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg">Sign Up</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
