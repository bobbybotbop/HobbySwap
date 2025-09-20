import { useState } from "react";
import { CurrentUserProfile } from "@/types/profile";

// Example current user profile data
const initialCurrentUser: CurrentUserProfile = {
  id: 0,
  name: "John Doe",
  location: "New York",
  image:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
  hobbiesKnown: ["Web Development", "React", "Node.js"],
  hobbiesWantToLearn: ["Photography", "Cooking", "Yoga"],
  email: "john.doe@example.com",
  phone: "5551234567",
  role: "Software Developer",
  bio: "hi!! i want to learn more hobbies because I love entertainment!!!!!!",
  socialMedia: {
    twitter: "https://twitter.com/johndoe",
    instagram: "https://instagram.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
  },
};

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] =
    useState<CurrentUserProfile>(initialCurrentUser);

  const updateCurrentUser = (updates: Partial<CurrentUserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
      socialMedia: {
        ...prev.socialMedia,
        ...updates.socialMedia,
      },
    }));
  };

  const updateHobbiesKnown = (hobbies: string[]) => {
    setCurrentUser((prev) => ({
      ...prev,
      hobbiesKnown: hobbies,
    }));
  };

  const updateHobbiesWantToLearn = (hobbies: string[]) => {
    setCurrentUser((prev) => ({
      ...prev,
      hobbiesWantToLearn: hobbies,
    }));
  };

  return {
    currentUser,
    updateCurrentUser,
    updateHobbiesKnown,
    updateHobbiesWantToLearn,
  };
};
