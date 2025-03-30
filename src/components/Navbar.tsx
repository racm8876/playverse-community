
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Menu, X, Gamepad, Users, BookOpen, User } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-card border-b border-muted py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Gamepad size={24} className="text-primary" />
          <span className="font-bold text-xl">PlayVerse</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/games" className="text-foreground/70 hover:text-primary transition-colors">
            Games
          </Link>
          <Link to="/communities" className="text-foreground/70 hover:text-primary transition-colors">
            Communities
          </Link>
          <Link to="/blogs" className="text-foreground/70 hover:text-primary transition-colors">
            Blogs
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <img 
                  src={user?.profilePicture || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-muted"
                />
                <span>{user?.username}</span>
              </Link>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="p-1">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background pt-16">
          <div className="flex flex-col items-center space-y-6 p-4">
            <Link to="/games" className="flex items-center space-x-2" onClick={closeMenu}>
              <Gamepad size={20} />
              <span>Games</span>
            </Link>
            <Link to="/communities" className="flex items-center space-x-2" onClick={closeMenu}>
              <Users size={20} />
              <span>Communities</span>
            </Link>
            <Link to="/blogs" className="flex items-center space-x-2" onClick={closeMenu}>
              <BookOpen size={20} />
              <span>Blogs</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2" onClick={closeMenu}>
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <Button variant="outline" onClick={() => { logout(); closeMenu(); }}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-4 w-full items-center">
                <Link to="/login" className="w-full" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" className="w-full" onClick={closeMenu}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
