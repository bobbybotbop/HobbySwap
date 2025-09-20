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
import {
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Tag,
  Plus,
  X,
} from "lucide-react";
import { SmileSquare, Star, CogFour, Send, Inbox } from "@mynaui/icons-react";
import ProfileCard from "@/components/ProfileCard";
import { Profile } from "@/types/profile";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const profilesData = [
  {
    name: "Olivia",
    location: "New York",
    image:
      "https://plus.unsplash.com/premium_photo-1682096181675-12f8293cd31e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hobbiesKnown: ["Photography", "Cooking", "Yoga"],
    hobbiesWantToLearn: ["Guitar", "Pottery", "Rock Climbing"],
  },
  {
    name: "Natalia",
    location: "Kiev",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
    hobbiesKnown: ["Painting", "Dancing", "Languages"],
    hobbiesWantToLearn: ["Piano", "Gardening", "Chess"],
  },
  {
    name: "Ava",
    location: "London",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
    hobbiesKnown: ["Writing", "Running", "Reading"],
    hobbiesWantToLearn: ["Sewing", "Meditation", "Calligraphy"],
  },
  {
    name: "Emilia",
    location: "London",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
    hobbiesKnown: ["Swimming", "Baking", "Knitting"],
    hobbiesWantToLearn: ["Violin", "Woodworking", "Astronomy"],
  },
  {
    name: "Elizabeth",
    location: "Hamburg",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop",
    hobbiesKnown: ["Cycling", "Drawing", "Hiking"],
    hobbiesWantToLearn: ["Coding", "Martial Arts", "Origami"],
  },
  {
    name: "Camila",
    location: "Munich",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    hobbiesKnown: ["Tennis", "Singing", "Scrapbooking"],
    hobbiesWantToLearn: ["Surfing", "Jewelry Making", "Archery"],
  },
  {
    name: "Layla",
    location: "Krakow",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
    hobbiesKnown: ["Volleyball", "Crafts", "Travel"],
    hobbiesWantToLearn: ["Skiing", "Digital Art", "Mixology"],
  },
  {
    name: "Isabella",
    location: "Oslo",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop",
    hobbiesKnown: ["Skiing", "Photography", "Cooking"],
    hobbiesWantToLearn: ["Ice Skating", "Pottery", "Languages"],
  },
];

// Generate profiles with IDs based on index
const profiles: Profile[] = profilesData.map((profile, index) => ({
  id: index + 1,
  ...profile,
}));

export default function Home() {
  const [activeTab, setActiveTab] = useState("For You");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [hobby, setHobby] = useState("");
  const [newHobbyKnown, setNewHobbyKnown] = useState("");
  const [newHobbyWantToLearn, setNewHobbyWantToLearn] = useState("");
  const [showAddHobbyKnown, setShowAddHobbyKnown] = useState(false);
  const [showAddHobbyWantToLearn, setShowAddHobbyWantToLearn] = useState(false);
  const { currentUser, updateCurrentUser } = useCurrentUser();

  const handleAddHobbyKnown = () => {
    if (newHobbyKnown.trim()) {
      updateCurrentUser({
        hobbiesKnown: [...currentUser.hobbiesKnown, newHobbyKnown.trim()],
      });
      setNewHobbyKnown("");
      setShowAddHobbyKnown(false);
    }
  };

  const handleAddHobbyWantToLearn = () => {
    if (newHobbyWantToLearn.trim()) {
      updateCurrentUser({
        hobbiesWantToLearn: [
          ...currentUser.hobbiesWantToLearn,
          newHobbyWantToLearn.trim(),
        ],
      });
      setNewHobbyWantToLearn("");
      setShowAddHobbyWantToLearn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-purple-100 flex">
      {/* Left Sidebar */}
      <div className="w-60 bg-white shadow-lg ml-8 mt-8 mb-8 rounded-xl h-[90vh] overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-black">HobbySwap</h1>
        </div>

        {/* User Profile Section */}
        <div
          className="p-6 border-b cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setActiveTab("Profile Edit")}
        >
          <div className="flex flex-col items-center space-y-3">
            {/* Profile Picture */}
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name with Edit Icon */}
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 text-lg">
                {currentUser.name}
              </span>
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
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              {
                name: "For You",
                icon: <SmileSquare className="w-5 h-5" />,
              },
              { name: "Sent", icon: <Send className="w-5 h-5" /> },
              { name: "Recieved", icon: <Inbox className="w-5 h-5" /> },
              { name: "Favorites", icon: <Star className="w-5 h-5" /> },
              { name: "Settings", icon: <CogFour className="w-5 h-5" /> },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg text-left transition-colors ${
                    activeTab === item.name
                      ? "bg-red-100 text-red-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header - Hidden for Profile Edit and Settings tabs */}
        {activeTab !== "Profile Edit" && activeTab !== "Settings" && (
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
                  <DropdownMenuRadioGroup
                    value={hobby}
                    onValueChange={setHobby}
                  >
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
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 px-6 pb-6 ${
            activeTab === "Profile Edit" || activeTab === "Settings"
              ? "pt-8"
              : "pt-2"
          }`}
        >
          {activeTab === "For You" && (
            <div className="grid grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}

          {activeTab === "Favorites" && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <Star className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  No Favorites Yet
                </h2>
                <p className="text-gray-500 mb-6">
                  Start adding profiles to your favorites to see them here
                </p>
                <Button
                  onClick={() => setActiveTab("For You")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Browse Profiles
                </Button>
              </div>
            </div>
          )}

          {activeTab === "Sent" && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <Send className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  No Sent Requests Yet
                </h2>
                <p className="text-gray-500 mb-6">
                  Start sending hobby swap requests to see them here
                </p>
                <Button
                  onClick={() => setActiveTab("For You")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Browse Profiles
                </Button>
              </div>
            </div>
          )}

          {activeTab === "Recieved" && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <Inbox className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  No Received Requests Yet
                </h2>
                <p className="text-gray-500 mb-6">
                  Requests from other users will appear here
                </p>
                <Button
                  onClick={() => setActiveTab("For You")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Browse Profiles
                </Button>
              </div>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <CogFour className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  Settings
                </h2>
                <p className="text-gray-500">Settings panel coming soon</p>
              </div>
            </div>
          )}

          {activeTab === "Profile Edit" && (
            <div className="max-w-6xl bg-white rounded-xl shadow-lg p-6 pl-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Edit Profile
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Profile Preview Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Profile Preview
                    </h2>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-full max-w-sm">
                        <ProfileCard profile={currentUser} />
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Profile Preview
                        </p>
                        <p className="text-xs text-gray-500">
                          This is how your profile will appear to other users.
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        >
                          Upload New Photo
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h2>
                    <div className="space-y-4">
                      {/* Full Name */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={currentUser.name}
                          onChange={(e) =>
                            updateCurrentUser({ name: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={currentUser.email}
                          onChange={(e) =>
                            updateCurrentUser({ email: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <div className="flex">
                          <select
                            className="pl-8 pr-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            aria-label="Country code"
                          >
                            <option value="1">+1</option>
                            <option value="966">+966</option>
                            <option value="44">+44</option>
                          </select>
                          <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={currentUser.phone}
                            onChange={(e) =>
                              updateCurrentUser({ phone: e.target.value })
                            }
                            className="flex-1 pr-4 py-3 border border-gray-300 border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Role */}
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Role"
                          value={currentUser.role}
                          onChange={(e) =>
                            updateCurrentUser({ role: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Location */}
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Location"
                          value={currentUser.location}
                          onChange={(e) =>
                            updateCurrentUser({ location: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Hobbies I Know Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Hobbies I Know
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentUser.hobbiesKnown.map((hobby, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          {hobby}
                          <X
                            className="ml-2 w-4 h-4 cursor-pointer hover:text-red-500"
                            onClick={() => {
                              const updatedHobbies =
                                currentUser.hobbiesKnown.filter(
                                  (_, i) => i !== index
                                );
                              updateCurrentUser({
                                hobbiesKnown: updatedHobbies,
                              });
                            }}
                          />
                        </span>
                      ))}
                    </div>

                    {showAddHobbyKnown ? (
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="Enter new hobby"
                          value={newHobbyKnown}
                          onChange={(e) => setNewHobbyKnown(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddHobbyKnown()
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          autoFocus
                        />
                        <Button
                          onClick={handleAddHobbyKnown}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Add
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddHobbyKnown(false);
                            setNewHobbyKnown("");
                          }}
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowAddHobbyKnown(true)}
                        className="text-green-500 border-green-500 hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add more
                      </Button>
                    )}
                  </div>

                  {/* Hobbies I Want to Learn Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Hobbies I Want to Learn
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentUser.hobbiesWantToLearn.map((hobby, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {hobby}
                          <X
                            className="ml-2 w-4 h-4 cursor-pointer hover:text-red-500"
                            onClick={() => {
                              const updatedHobbies =
                                currentUser.hobbiesWantToLearn.filter(
                                  (_, i) => i !== index
                                );
                              updateCurrentUser({
                                hobbiesWantToLearn: updatedHobbies,
                              });
                            }}
                          />
                        </span>
                      ))}
                    </div>

                    {showAddHobbyWantToLearn ? (
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="Enter new hobby"
                          value={newHobbyWantToLearn}
                          onChange={(e) =>
                            setNewHobbyWantToLearn(e.target.value)
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddHobbyWantToLearn()
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                        <Button
                          onClick={handleAddHobbyWantToLearn}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Add
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddHobbyWantToLearn(false);
                            setNewHobbyWantToLearn("");
                          }}
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowAddHobbyWantToLearn(true)}
                        className="text-blue-500 border-blue-500 hover:bg-blue-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add more
                      </Button>
                    )}
                  </div>

                  {/* Bio Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Bio
                    </h2>
                    <textarea
                      placeholder="Tell us about yourself..."
                      value={currentUser.bio}
                      onChange={(e) =>
                        updateCurrentUser({ bio: e.target.value })
                      }
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Social Media Accounts Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Social Media Accounts
                    </h2>
                    <div className="space-y-4">
                      {/* Twitter */}
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        <input
                          type="url"
                          placeholder="Twitter URL"
                          value={currentUser.socialMedia.twitter}
                          onChange={(e) =>
                            updateCurrentUser({
                              socialMedia: {
                                ...currentUser.socialMedia,
                                twitter: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Instagram */}
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z" />
                        </svg>
                        <input
                          type="url"
                          placeholder="Instagram URL"
                          value={currentUser.socialMedia.instagram}
                          onChange={(e) =>
                            updateCurrentUser({
                              socialMedia: {
                                ...currentUser.socialMedia,
                                instagram: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <input
                          type="url"
                          placeholder="LinkedIn URL"
                          value={currentUser.socialMedia.linkedin}
                          onChange={(e) =>
                            updateCurrentUser({
                              socialMedia: {
                                ...currentUser.socialMedia,
                                linkedin: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 text-blue-500 border-blue-500 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add more
                    </Button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <Button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
