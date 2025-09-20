export interface Profile {
  id: number;
  name: string;
  location: string;
  image: string;
  hobbiesKnown: string[];
  hobbiesWantToLearn: string[];
  netID: string;
  bio: string;  
  instagram: string;
  email: string;
  socialMedia: {
    instagram: string;
  };
}
