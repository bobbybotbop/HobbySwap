import { useState, useCallback } from "react";
import { Profile } from "@/types/profile";

// Example current user profile data
const initialCurrentUser: Profile = {
  id: 0,
  name: "John Doe",
  location: "West",
  image:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
  hobbiesKnown: ["Web Development", "React", "Node.js"],
  hobbiesWantToLearn: ["Photography", "Cooking", "Yoga"],
  netID: "jd123",
  bio: "hi!! i want to learn more hobbies because I love entertainment!!!!!!",
  instagram: "https://instagram.com/johndoe",
  email: "john.doe@example.com",
  socialMedia: {
    instagram: "https://instagram.com/johndoe",
  },
};

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<Profile>(initialCurrentUser);

  const updateCurrentUser = useCallback((updates: Partial<Profile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const updateHobbiesKnown = useCallback((hobbies: string[]) => {
    setCurrentUser((prev) => ({
      ...prev,
      hobbiesKnown: hobbies,
    }));
  }, []);

  const updateHobbiesWantToLearn = useCallback((hobbies: string[]) => {
    setCurrentUser((prev) => ({
      ...prev,
      hobbiesWantToLearn: hobbies,
    }));
  }, []);

  const replaceCurrentUser = useCallback((newUser: Profile) => {
    setCurrentUser(newUser);
  }, []);

  return {
    currentUser,
    updateCurrentUser,
    updateHobbiesKnown,
    updateHobbiesWantToLearn,
    replaceCurrentUser,
  };
};
