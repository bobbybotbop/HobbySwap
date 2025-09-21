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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // First verify the password
      const verifyResponse = await fetch(
        "http://localhost:6767/api/users/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            netid: formData.netid.trim(),
            password: formData.password,
          }),
        }
      );

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        setError(errorData.message || "Login failed");
        return;
      }

      // If password is verified, get user data
      const userResponse = await fetch(
        `http://localhost:6767/api/users/netid/${formData.netid.trim()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = await userResponse.json();

      if (userResponse.ok) {
        setSuccess(true);

        // Convert backend user to Profile format
        const userProfile: Profile = {
          id: 0,
          name: userData.personalInformation.name,
          location: userData.personalInformation.location || "Not specified",
          image:
            userData.personalInformation.image ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
          hobbiesKnown: userData.hobbies || [],
          hobbiesWantToLearn: userData.hobbiesWantToLearn || [],
          netID: userData.personalInformation.netid,
          bio: `Hi! I'm ${userData.personalInformation.name} and I love sharing hobbies!`,
          instagram: userData.personalInformation.instagram || "",
          email: `${userData.personalInformation.netid}@example.com`,
        };

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userProfile));
        localStorage.setItem("netid", formData.netid.trim());
        localStorage.setItem("userData", JSON.stringify(userData)); // Store raw backend data too

        // Redirect to main page after successful login
        setTimeout(() => {
          router.push("/?tab=For You");
        }, 1000);
      } else {
        setError("Failed to retrieve user data");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
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
