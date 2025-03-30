import { Blog } from "./types";
import { Game } from "./types";
import { Community } from "./types";

const API_URL = "http://localhost:8080"; // Backend API URL

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
}

// Get authentication token from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// API functions for games
export const getGames = async (): Promise<Game[]> => {
  try {
    const response = await fetch(`${API_URL}/games`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Game[]>(response);
  } catch (error) {
    console.error("Error fetching games:", error);
    // Fallback to mock data if the API fails
    return getMockGames();
  }
};

// API functions for communities
export const getCommunities = async (): Promise<Community[]> => {
  try {
    const response = await fetch(`${API_URL}/community`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Community[]>(response);
  } catch (error) {
    console.error("Error fetching communities:", error);
    // Fallback to mock data if the API fails
    return getMockCommunities();
  }
};

// API functions for blogs
export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await fetch(`${API_URL}/blogs`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Blog[]>(response);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    // Fallback to mock data if the API fails
    return getMockBlogs();
  }
};

// Mock data functions as fallbacks
const getMockGames = async (): Promise<Game[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(gamesData), 800);
  });
};

const getMockCommunities = async (): Promise<Community[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(communitiesData), 800);
  });
};

const getMockBlogs = async (): Promise<Blog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(blogsData), 800);
  });
};

// Mock data for games
const gamesData: Game[] = [
  {
    id: "1",
    title: "Elden Ring",
    description: "An action RPG developed by FromSoftware and published by Bandai Namco Entertainment.",
    image: "/placeholder.svg",
    genre: "Action RPG",
    platform: ["PC", "PlayStation", "Xbox"],
    releaseDate: "2022-02-25",
    rating: 9.5,
    price: "$59.99"
  },
  {
    id: "2",
    title: "Starfield",
    description: "An upcoming action role-playing game developed by Bethesda Game Studios.",
    image: "/placeholder.svg",
    genre: "RPG",
    platform: ["PC", "Xbox"],
    releaseDate: "2023-09-06",
    rating: 8.9,
    price: "$69.99"
  },
  {
    id: "3",
    title: "Baldur's Gate 3",
    description: "A role-playing video game developed and published by Larian Studios.",
    image: "/placeholder.svg",
    genre: "RPG",
    platform: ["PC", "PlayStation"],
    releaseDate: "2023-08-03",
    rating: 9.7,
    price: "$59.99"
  },
  {
    id: "4",
    title: "Tears of the Kingdom",
    description: "An action-adventure game developed and published by Nintendo.",
    image: "/placeholder.svg",
    genre: "Adventure",
    platform: ["Nintendo Switch"],
    releaseDate: "2023-05-12",
    rating: 9.8,
    price: "$69.99"
  },
  {
    id: "5",
    title: "Final Fantasy XVI",
    description: "An action role-playing game developed and published by Square Enix.",
    image: "/placeholder.svg",
    genre: "Action RPG",
    platform: ["PlayStation"],
    releaseDate: "2023-06-22",
    rating: 8.7,
    price: "$69.99"
  },
  {
    id: "6",
    title: "Cyberpunk 2077",
    description: "An open-world action-adventure RPG developed and published by CD Projekt.",
    image: "/placeholder.svg",
    genre: "Action RPG",
    platform: ["PC", "PlayStation", "Xbox"],
    releaseDate: "2020-12-10",
    rating: 7.5,
    price: "$49.99"
  }
];

// Mock data for communities
const communitiesData: Community[] = [
  {
    id: "1",
    name: "Elden Ring Explorers",
    description: "A community for players who love to explore the vast open world of Elden Ring and share their discoveries.",
    image: "/placeholder.svg",
    game: "Elden Ring",
    members: 12540,
    tags: ["Exploration", "Lore", "Builds"]
  },
  {
    id: "2",
    name: "Starfield Pioneers",
    description: "Join fellow space explorers as we chart the vast universe of Starfield.",
    image: "/placeholder.svg",
    game: "Starfield",
    members: 8720,
    tags: ["Space", "Exploration", "Modding"]
  },
  {
    id: "3",
    name: "Baldur's Gate 3 Tacticians",
    description: "Strategic discussions, party builds, and story theories for Baldur's Gate 3.",
    image: "/placeholder.svg",
    game: "Baldur's Gate 3",
    members: 15230,
    tags: ["Strategy", "D&D", "RPG"]
  },
  {
    id: "4",
    name: "Hyrule Historians",
    description: "Discussing the deep lore and history of the Legend of Zelda universe.",
    image: "/placeholder.svg",
    game: "Tears of the Kingdom",
    members: 21450,
    tags: ["Lore", "Zelda", "Nintendo"]
  },
  {
    id: "5",
    name: "Final Fantasy Fans",
    description: "A community for all Final Fantasy enthusiasts to discuss games, lore, and more.",
    image: "/placeholder.svg",
    game: "Final Fantasy XVI",
    members: 32150,
    tags: ["JRPG", "Square Enix", "Final Fantasy"]
  },
  {
    id: "6",
    name: "Night City Legends",
    description: "Share your experiences, builds, and screenshots from the streets of Night City.",
    image: "/placeholder.svg",
    game: "Cyberpunk 2077",
    members: 9840,
    tags: ["Cyberpunk", "Photo Mode", "Builds"]
  }
];

// Mock data for blogs
const blogsData: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Elden Ring: A Beginner's Guide",
    content: "Elden Ring can be intimidating for newcomers. Here's our comprehensive guide to help you start your journey in the Lands Between with confidence and prepare you for the challenges that await.",
    author: "John Smith",
    date: "2023-05-15",
    image: "/placeholder.svg",
    tags: ["Guide", "Elden Ring", "Beginners"],
    readTime: "8 min read"
  },
  {
    id: "2",
    title: "Starfield's Space Exploration Mechanics Explained",
    content: "Dive deep into the space exploration mechanics of Starfield. From ship customization to planetary exploration, we cover everything you need to know about traversing the cosmos in Bethesda's newest RPG.",
    author: "Emma Johnson",
    date: "2023-09-10",
    image: "/placeholder.svg",
    tags: ["Preview", "Starfield", "Space"],
    readTime: "12 min read"
  },
  {
    id: "3",
    title: "Top 10 Baldur's Gate 3 Party Compositions",
    content: "Looking for the most effective party compositions in Baldur's Gate 3? We've compiled the top 10 party setups that will help you overcome any challenge the game throws at you.",
    author: "Michael Brown",
    date: "2023-08-20",
    image: "/placeholder.svg",
    tags: ["Strategy", "Baldur's Gate 3", "Party Builds"],
    readTime: "15 min read"
  },
  {
    id: "4",
    title: "Hidden Secrets in Tears of the Kingdom",
    content: "The vast open world of Hyrule in Tears of the Kingdom is filled with hidden secrets. From mysterious shrines to powerful weapons, discover the most intriguing secrets you might have missed.",
    author: "Sarah Wilson",
    date: "2023-07-08",
    image: "/placeholder.svg",
    tags: ["Secrets", "Zelda", "Exploration"],
    readTime: "10 min read"
  },
  {
    id: "5",
    title: "The Evolution of Final Fantasy Combat Systems",
    content: "From the turn-based battles of early Final Fantasy games to the action-oriented combat of Final Fantasy XVI, we trace the evolution of the series' battle systems and what it means for the future of JRPGs.",
    author: "David Chen",
    date: "2023-06-30",
    image: "/placeholder.svg",
    tags: ["Analysis", "Final Fantasy", "Combat"],
    readTime: "18 min read"
  },
  {
    id: "6",
    title: "Cyberpunk 2077: Two Years Later",
    content: "It's been two years since the rocky launch of Cyberpunk 2077. We revisit Night City to see how the game has evolved through patches and updates, and whether it now fulfills the promises made before its release.",
    author: "Lisa Rodriguez",
    date: "2023-04-22",
    image: "/placeholder.svg",
    tags: ["Review", "Cyberpunk 2077", "Updates"],
    readTime: "14 min read"
  }
];
