"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  image: string;
  isOnline: boolean;
}

const profilesData = [
  {
    name: "Olivia",
    age: 29,
    location: "New York",
    image:
      "https://plus.unsplash.com/premium_photo-1682096181675-12f8293cd31e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isOnline: false,
  },
  {
    name: "Natalia",
    age: 20,
    location: "Kiev",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
    isOnline: true,
  },
  {
    name: "Ava",
    age: 22,
    location: "London",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
    isOnline: false,
  },
  {
    name: "Emilia",
    age: 23,
    location: "London",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
    isOnline: false,
  },
  {
    name: "Elizabeth",
    age: 21,
    location: "Hamburg",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop",
    isOnline: false,
  },
  {
    name: "Camila",
    age: 24,
    location: "Munich",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    isOnline: false,
  },
  {
    name: "Layla",
    age: 20,
    location: "Krakow",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
    isOnline: false,
  },
  {
    name: "Isabella",
    age: 25,
    location: "Oslo",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop",
    isOnline: true,
  },
];

// Generate profiles with IDs based on index
const profiles: Profile[] = profilesData.map((profile, index) => ({
  id: index + 1,
  ...profile,
}));

export default function Home() {
  const [activeTab, setActiveTab] = useState("Main");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [hobby, setHobby] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-purple-100 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg ml-8 mt-8 mb-8 rounded-xl">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-black">HobbySwap</h1>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">J</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">John</span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Popularity:{" "}
                <span className="text-green-600 font-semibold">very high</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { name: "Main", icon: "🏠", active: true },
              { name: "Game", icon: "🎮" },
              { name: "Messages", icon: "💬" },
              { name: "My couples", icon: "💕" },
              { name: "Who like me", icon: "💖" },
              { name: "Favorites", icon: "⭐" },
              { name: "Settings", icon: "⚙️" },
              { name: "Help", icon: "❓" },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    item.active
                      ? "bg-red-50 text-red-600 border-l-4 border-red-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className=" px-6 py-4 flex items-center justify-end">
          <div className="mt-4 flex items-center space-x-3 text-black">
            {/* Location Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between min-w-[120px]"
                >
                  {location || "Location"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={location}
                  onValueChange={setLocation}
                >
                  <DropdownMenuRadioItem value="">
                    All Locations
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="north">
                    North
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="west">
                    West
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="central">
                    Central
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="off-campus">
                    Off Campus
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Age Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between min-w-[120px]"
                >
                  {age || "Age"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Age</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={age} onValueChange={setAge}>
                  <DropdownMenuRadioItem value="">
                    All Ages
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="freshman">
                    Freshman
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sophomore">
                    Sophomore
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="junior">
                    Junior
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="senior">
                    Senior
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="graduate">
                    Graduate
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hobby Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between min-w-[120px]"
                >
                  {hobby || "Hobby Category"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Hobby Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={hobby} onValueChange={setHobby}>
                  <DropdownMenuRadioItem value="">
                    All Categories
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="indoors">
                    Indoors
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="outdoors">
                    Outdoors
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="tech">
                    Tech
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="creative">
                    Creative
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="writing">
                    Writing
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
              Show
            </Button>
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-64 object-cover"
                  />
                  {profile.isOnline && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {profile.name}, {profile.age}
                  </h3>
                  <div className="flex items-center mt-2">
                    <svg
                      className="w-4 h-4 text-red-500 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600 text-sm">
                      {profile.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
