// Define the User type
type User = {
    uuid: string;
    firstName: string;
    lastName: string;
    profile: string ;
    bio: string;
  };
  
  // Define the Content type
export  type Blog = {
    uuid: string;
    title: string;
    likesCount: number;
    viewsCount: number;
    countComments: number;
    isVerified: boolean;
    description: string;
    thumbnail: string[]; // Array of URLs
    user: User; // Nested User type
    createdAt: string; // ISO date string
    lastModifiedAt: string; // ISO date string
  };
  
  