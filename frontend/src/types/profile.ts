export interface Profile {
  id: number;
  name: string;
  location: string;
  image: string;
  hobbiesKnown: string[];
  hobbiesWantToLearn: string[];
  email?: string;
  phone?: string;
  role?: string;
  bio?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface CurrentUserProfile extends Profile {
  email: string;
  phone: string;
  role: string;
  bio: string;
  socialMedia: {
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}
