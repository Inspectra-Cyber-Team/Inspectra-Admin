export type AdminDetail = {
    data: data;
  };
  
  type data = {
    uuid: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    profile: string; // Assuming this is a file name or URL.
    bio: string;
    createdAt: string; // ISO 8601 date-time string.
    isActive: boolean;
    lastModifiedAt: string; // ISO 8601 date-time string.
    isVerified: boolean;
    isDeleted: boolean;
  };