
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      // Mock user profile for now
      const userData = {
        id: '1',
        username: 'gamer123',
        email: 'gamer@example.com',
        profilePicture: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
        bio: 'Gaming enthusiast and community member',
        joinedDate: '2023-01-15'
      };
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login response for now
      const mockUser = {
        id: '1',
        username: 'gamer123',
        email,
        profilePicture: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
        bio: 'Gaming enthusiast and community member',
        joinedDate: '2023-01-15'
      };
      const token = 'mock-jwt-token';
      
      localStorage.setItem('token', token);
      setUser(mockUser);
      setIsAuthenticated(true);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock register response
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    console.log('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
