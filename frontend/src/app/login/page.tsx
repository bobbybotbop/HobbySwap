"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Profile } from "@/types/profile";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    netid: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.netid.trim()) {
      setError("NetID is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const generateRandomUser = (netid: string): Profile => {
    const names = [
      "Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Avery", "Quinn",
      "Sage", "River", "Phoenix", "Skyler", "Blake", "Cameron", "Drew", "Emery",
      "Finley", "Hayden", "Jamie", "Kendall", "Logan", "Parker", "Reese", "Sawyer"
    ];
    
    const locations = ["North", "South", "East", "West", "Central", "Off Campus"];
    
    const allHobbies = [
      "Photography", "Cooking", "Guitar", "Piano", "Singing", "Dancing", "Yoga", "Meditation",
      "Basketball", "Soccer", "Tennis", "Swimming", "Running", "Cycling", "Hiking", "Rock Climbing",
      "Painting", "Drawing", "Sculpting", "Pottery", "Knitting", "Sewing", "Woodworking", "Carpentry",
      "Coding", "Web Development", "Mobile Apps", "Game Design", "Data Science", "AI/ML", "Blockchain", "DevOps",
      "Reading", "Writing", "Poetry", "Journalism", "Blogging", "Podcasting", "Video Editing", "Film Making",
      "Gardening", "Baking", "Mixology", "Coffee Brewing", "Wine Tasting", "Chess", "Board Games", "Puzzles",
      "Languages", "Travel", "Photography", "Astronomy", "Physics", "Chemistry", "Biology", "Psychology",
      "Fashion", "Makeup", "Hair Styling", "Interior Design", "Architecture", "Graphic Design", "UI/UX", "Marketing"
    ];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate 3-6 random hobbies for each category
    const shuffleArray = (array: string[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    const shuffledHobbies = shuffleArray(allHobbies);
    const hobbiesKnown = shuffledHobbies.slice(0, Math.floor(Math.random() * 4) + 3);
    const hobbiesWantToLearn = shuffledHobbies.slice(4, 4 + Math.floor(Math.random() * 4) + 3);
    
    // Random profile images
    const profileImages = [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
    ];
    
    const randomImage = profileImages[Math.floor(Math.random() * profileImages.length)];
    
    return {
      id: "68cf6cddb67d9ed6afd18539", // Use existing backend user ID
      name: randomName,
      location: randomLocation,
      image: randomImage,
      hobbiesKnown: hobbiesKnown,
      hobbiesWantToLearn: hobbiesWantToLearn,
      netID: netid.trim(),
      bio: `Hi! I'm ${randomName} and I love sharing hobbies! I'm passionate about ${hobbiesKnown[0]} and excited to learn ${hobbiesWantToLearn[0]}.`,
      instagram: `@${randomName.toLowerCase()}_hobbies`,
      email: `${netid.trim()}@example.com`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // Simulate successful login without backend verification
      console.log("✅ Login simulated successfully");
      
      setSuccess(true);

      // Generate a random user profile
      const userProfile = generateRandomUser(formData.netid.trim());
      console.log("🎲 Generated random user:", userProfile);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userProfile));
      localStorage.setItem("netid", formData.netid.trim());

      // Redirect to main page after successful login
      setTimeout(() => {
        router.push("/?tab=Search");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-purple-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Login Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Welcome back! Redirecting you to HobbySwap...
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Go to HobbySwap
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HobbySwap</h1>
          <p className="text-gray-600">
            Welcome back! Please sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NetID Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="netid"
              placeholder="NetID"
              value={formData.netid}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
