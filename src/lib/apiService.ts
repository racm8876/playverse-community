
import { Blog, Game, Community } from "./types";

const API_URL = "http://localhost:8080";

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Get authentication token from localStorage
const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Game API services
export const gameService = {
  getAll: async (): Promise<Game[]> => {
    const response = await fetch(`${API_URL}/games`, {
      headers: getHeaders()
    });
    return handleResponse<Game[]>(response);
  },
  
  getById: async (id: string): Promise<Game> => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      headers: getHeaders()
    });
    return handleResponse<Game>(response);
  },

  create: async (gameData: {
    title: string;
    description: string;
    imageUrl: string;
    genre: string;
    platform: string[];
    releaseDate: string;
    rating: number;
  }): Promise<Game> => {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(gameData)
    });
    return handleResponse<Game>(response);
  }
};

// Community API services
export const communityService = {
  getAll: async (): Promise<Community[]> => {
    const response = await fetch(`${API_URL}/community`, {
      headers: getHeaders()
    });
    return handleResponse<Community[]>(response);
  },
  
  getById: async (id: string): Promise<Community> => {
    const response = await fetch(`${API_URL}/community/${id}`, {
      headers: getHeaders()
    });
    return handleResponse<Community>(response);
  },
  
  join: async (communityId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/community/${communityId}/join`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse<{ message: string }>(response);
  },
  
  leave: async (communityId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/community/${communityId}/leave`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse<{ message: string }>(response);
  },

  create: async (communityData: {
    name: string;
    description: string;
    imageUrl: string;
    game: string;
    tags: string[];
  }): Promise<Community> => {
    const response = await fetch(`${API_URL}/community`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(communityData)
    });
    return handleResponse<Community>(response);
  }
};

// Blog API services
export const blogService = {
  getAll: async (): Promise<Blog[]> => {
    const response = await fetch(`${API_URL}/blogs`, {
      headers: getHeaders(false)
    });
    return handleResponse<Blog[]>(response);
  },
  
  getById: async (id: string): Promise<Blog> => {
    const response = await fetch(`${API_URL}/blogs/${id}`, {
      headers: getHeaders(false)
    });
    return handleResponse<Blog>(response);
  },
  
  addComment: async (blogId: string, comment: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/blogs/${blogId}/comment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text: comment })
    });
    return handleResponse<{ message: string }>(response);
  },
  
  like: async (blogId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/blogs/${blogId}/like`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse<{ message: string }>(response);
  },

  create: async (blogData: {
    title: string;
    content: string;
    imageUrl: string;
    tags: string[];
  }): Promise<Blog> => {
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(blogData)
    });
    return handleResponse<Blog>(response);
  }
};

// User API services
export const userService = {
  updateProfile: async (userData: {
    username?: string;
    email?: string;
    bio?: string;
    profilePicture?: string;
  }): Promise<{ message: string; user: any }> => {
    const response = await fetch(`${API_URL}/auth/updateUser`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse<{ message: string; user: any }>(response);
  }
};
