"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiService } from "@/lib/api";
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
  MapPin,
  Plus,
  X,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import {
  Search as SearchIcon,
  Star,
  CogFour,
  Send,
  Inbox,
} from "@mynaui/icons-react";
import ProfileCard from "@/components/ProfileCard";
import MatchesList from "@/components/MatchesList";
import ProfileModal from "@/components/ProfileModal";
import SentRequests from "@/components/SentRequests";
import ReceivedRequests from "@/components/ReceivedRequests";
import { Profile } from "@/types/profile";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Function to generate random users
const generateRandomUsers = (count: number) => {
  const names = [
    "Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Avery", "Quinn",
    "Sage", "River", "Phoenix", "Skyler", "Blake", "Cameron", "Drew", "Emery",
    "Finley", "Hayden", "Jamie", "Kendall", "Logan", "Parker", "Reese", "Sawyer",
    "Marcus", "Sophia", "Maya", "Zoe", "Ryan", "Luna", "Charlie", "Sam",
    "Max", "Lee", "Kai", "Noah", "Eli", "Zoe", "Aria", "Nova",
    "Jade", "Iris", "Luna", "Vega", "Orion", "Atlas", "Juno", "Nyx",
    "Echo", "Zara", "Kira", "Lila", "Mira", "Nora", "Ora", "Pia",
    "Quinn", "Raya", "Sia", "Tia", "Uma", "Vera", "Willa", "Xara",
    "Yara", "Zara", "Aiden", "Blake", "Caleb", "Dante", "Ethan", "Felix",
    "Gage", "Hugo", "Ivan", "Jace", "Kade", "Liam", "Mason", "Nico",
    "Owen", "Pax", "Quinn", "Remy", "Sage", "Tate", "Uri", "Vale",
    "Wade", "Xander", "Yale", "Zane"
  ];
  
  const locations = ["North", "South", "East", "West", "Central", "Off Campus"];
  
  const allHobbies = [
    "Photography", "Cooking", "Guitar", "Piano", "Singing", "Dancing", "Yoga", "Meditation",
    "Basketball", "Soccer", "Tennis", "Swimming", "Running", "Cycling", "Hiking", "Rock Climbing",
    "Painting", "Drawing", "Sculpting", "Pottery", "Knitting", "Sewing", "Woodworking", "Carpentry",
    "Coding", "Web Development", "Mobile Apps", "Game Design", "Data Science", "AI/ML", "Blockchain", "DevOps",
    "Reading", "Writing", "Poetry", "Journalism", "Blogging", "Podcasting", "Video Editing", "Film Making",
    "Gardening", "Baking", "Mixology", "Coffee Brewing", "Wine Tasting", "Chess", "Board Games", "Puzzles",
    "Languages", "Travel", "Astronomy", "Physics", "Chemistry", "Biology", "Psychology",
    "Fashion", "Makeup", "Hair Styling", "Interior Design", "Architecture", "Graphic Design", "UI/UX", "Marketing",
    "Volleyball", "Badminton", "Table Tennis", "Archery", "Boxing", "Martial Arts", "Gymnastics", "Skating",
    "Surfing", "Snowboarding", "Skiing", "Ice Hockey", "Lacrosse", "Rugby", "Cricket", "Baseball",
    "Calligraphy", "Origami", "Jewelry Making", "Embroidery", "Crocheting", "Quilting", "Scrapbooking", "Card Making",
    "Acting", "Stand-up Comedy", "Magic Tricks", "Juggling", "Circus Arts", "Mime", "Improv", "Theater",
    "DJing", "Music Production", "Beatboxing", "Rapping", "Opera", "Classical Music", "Jazz", "Blues",
    "Rock Climbing", "Bouldering", "Parkour", "Free Running", "Acrobatics", "Trapeze", "Aerial Silks", "Pole Dancing",
    "Kite Flying", "Frisbee", "Ultimate Frisbee", "Disc Golf", "Golf", "Bowling", "Darts", "Pool",
    "Sudoku", "Crosswords", "Word Games", "Trivia", "Escape Rooms", "Mystery Solving", "Detective Work", "Forensics",
    "Astrology", "Tarot Reading", "Palm Reading", "Crystal Healing", "Reiki", "Chakra Balancing", "Aromatherapy", "Herbalism",
    "Stand-up Paddleboarding", "Kayaking", "Canoeing", "Sailing", "Windsurfing", "Kitesurfing", "Wakeboarding", "Water Skiing",
    "Mountain Biking", "BMX", "Skateboarding", "Longboarding", "Roller Skating", "Inline Skating", "Unicycling", "Tricycling",
    "Collecting", "Antiques", "Vintage Items", "Coins", "Stamps", "Comics", "Action Figures", "Trading Cards",
    "Model Building", "RC Cars", "RC Planes", "RC Boats", "Drones", "Robotics", "Electronics", "Arduino",
    "Lock Picking", "Escape Artist", "Houdini Tricks", "Card Tricks", "Coin Tricks", "Mentalism", "Hypnosis", "Mind Reading"
  ];
  
  const profileImages = [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1507591064344-4c6e005a1d0c?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop"
  ];
  
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Shuffle images to ensure unique assignment
  const shuffledImages = shuffleArray(profileImages);
  
  return Array.from({ length: count }, (_, i) => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    // Use modulo to cycle through images and ensure uniqueness
    const uniqueImage = shuffledImages[i % shuffledImages.length];
    
    const shuffledHobbies = shuffleArray(allHobbies);
    const hobbiesKnown = shuffledHobbies.slice(0, Math.floor(Math.random() * 4) + 3);
    const hobbiesWantToLearn = shuffledHobbies.slice(4, 4 + Math.floor(Math.random() * 4) + 3);
    
    return {
      id: `demo_${randomName.toLowerCase()}_${i + 1}`,
      name: randomName,
      location: randomLocation,
      image: uniqueImage,
      hobbiesKnown: hobbiesKnown,
      hobbiesWantToLearn: hobbiesWantToLearn,
      bio: `Hi! I'm ${randomName} and I love sharing hobbies! I'm passionate about ${hobbiesKnown[0]} and excited to learn ${hobbiesWantToLearn[0]}.`,
      instagram: `@${randomName.toLowerCase()}_hobbies`,
    };
  });
};

// Function to validate if an image URL is working
const validateImage = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Function to filter out users with broken images
const filterUsersWithValidImages = async (users: Profile[]): Promise<Profile[]> => {
  const validUsers: Profile[] = [];
  
  for (const user of users) {
    const isValid = await validateImage(user.image);
    if (isValid) {
      validUsers.push(user);
    } else {
      console.log(`❌ Removed user ${user.name} - broken image: ${user.image}`);
    }
  }
  
  return validUsers;
};

// Generate 50 random users
const generateProfiles = async () => {
  const randomUsers = generateRandomUsers(50).map((profile, index) => ({
    netID: `user${index + 1}`,
    email: `${profile.name.toLowerCase().replace(" ", ".")}@example.com`,
    ...profile,
  }));
  
  // Filter out users with broken images
  const validProfiles = await filterUsersWithValidImages(randomUsers);
  console.log(`✅ Generated ${validProfiles.length} users with valid images`);
  return validProfiles;
};

// This will be handled by the generateProfiles function

export default function Home() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("Search");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [hobby, setHobby] = useState("");
  const [newHobbyKnown, setNewHobbyKnown] = useState("");
  const [newHobbyWantToLearn, setNewHobbyWantToLearn] = useState("");
  const [showAddHobbyKnown, setShowAddHobbyKnown] = useState(false);
  const [showAddHobbyWantToLearn, setShowAddHobbyWantToLearn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser: hookCurrentUser, updateCurrentUser, replaceCurrentUser } =
    useCurrentUser();
  
  // Load actual user from localStorage
  const [currentUser, setCurrentUser] = useState<Profile>(hookCurrentUser);
  const [profileLocation, setProfileLocation] = useState(currentUser.location);
  const [userLoaded, setUserLoaded] = useState(false);
  
  // Load user from localStorage on component mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      console.log("🔍 Checking localStorage for user data...");
      const userData = localStorage.getItem("user");
      console.log("🔍 Raw userData from localStorage:", userData);
      console.log("🔍 hookCurrentUser at start:", hookCurrentUser);
      console.log("🔍 hookCurrentUser.id at start:", hookCurrentUser.id);
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log("🔍 Parsed user from localStorage:", user);
          console.log("🔍 User ID:", user.id);
          setCurrentUser(user);
          setProfileLocation(user.location);
          setUserLoaded(true);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          console.log("🔍 Using hook currentUser due to parse error");
          setUserLoaded(true);
        }
      } else {
        console.log("🔍 No user data found in localStorage, using default user");
        console.log("🔍 Default user ID:", hookCurrentUser.id);
        // Don't override currentUser if localStorage is empty, keep the hook's default
        setUserLoaded(true);
      }
    };
    
    loadUserFromStorage();
  }, []);
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline" | "loading" | null
  >("loading");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  // Algorithms status state removed
  // Algorithms details state removed
  const [isImportingUsers, setIsImportingUsers] = useState(false);
  const [importStatus, setImportStatus] = useState<string>("");
  const [backendProfiles, setBackendProfiles] = useState<Profile[]>([]);
  const [useBackendData, setUseBackendData] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate static users instead of fetching from backend
  useEffect(() => {
    const generateStaticUsers = async () => {
      setIsLoadingUsers(true);
      setServerStatus("online");
      
      try {
        console.log("🔍 Generating static users...");
        
        // Generate random users with proper Profile structure
        const staticUsers = await generateProfiles();
        console.log("📊 Generated static users:", staticUsers);
        
        setBackendProfiles(staticUsers);
        setProfiles(staticUsers);
        setUseBackendData(true);
        setServerStatus("online");
        setLastChecked(new Date());
      } catch (error) {
        console.error("❌ Error generating static users:", error);
        setServerStatus("offline");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    generateStaticUsers();
  }, []);

  // Check for stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedNetid = localStorage.getItem("netid");

    console.log("🔍 Main Page: Checking localStorage for user data");
    console.log("🔍 Main Page: storedUser:", storedUser);
    console.log("🔍 Main Page: storedNetid:", storedNetid);

    if (storedUser && storedNetid) {
      try {
        const userProfile = JSON.parse(storedUser);
        console.log("🔄 Main Page: Loading stored user data:", userProfile);
        console.log("🔄 Main Page: User ID:", userProfile.id);
        replaceCurrentUser(userProfile);

        // Check for tab parameter in URL
        const tabParam = searchParams.get("tab");
        if (tabParam) {
          setActiveTab(tabParam);
        } else {
          setActiveTab("Search");
        }
      } catch (error) {
        console.error("❌ Main Page: Error parsing stored user data:", error);
      }
    } else {
      console.log(
        "⚠️ Main Page: No stored user data found, using default user"
      );
    }
  }, [replaceCurrentUser, searchParams]);

  // Function to convert backend user to Profile format
  const convertBackendUserToProfile = (user: {
    _id: string;
    personalInformation: {
      name: string;
      location?: string;
      image?: string;
      netid: string;
      instagram?: string;
    };
    hobbies?: string[];
    hobbiesWantToLearn?: string[];
  }): Profile => {
    return {
      id: user._id, // Use MongoDB _id
      name: user.personalInformation.name,
      location: user.personalInformation.location || "Not specified",
      image:
        user.personalInformation.image ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
      hobbiesKnown: user.hobbies || [],
      hobbiesWantToLearn: user.hobbiesWantToLearn || [],
      netID: user.personalInformation.netid || `user_${user._id}`,
      bio: `Hi! I'm ${user.personalInformation.name} and I love sharing hobbies!`,
      instagram: user.personalInformation.instagram || "",
      email: `${user.personalInformation.netid || `user_${user._id}`}@example.com`,
    };
  };

  // Function to update current user from backend data
  const updateCurrentUserFromBackend = (netid: string) => {
    const user = backendProfiles.find((profile) => profile.netID === netid);
    if (user) {
      replaceCurrentUser(user);
      setActiveTab("Search");
    }
  };

  const handleAddHobbyKnown = () => {
    if (newHobbyKnown.trim()) {
      setCurrentUser(prev => ({
        ...prev,
        hobbiesKnown: [...prev.hobbiesKnown, newHobbyKnown.trim()],
      }));
      setNewHobbyKnown("");
      setShowAddHobbyKnown(false);
    }
  };

  const handleAddHobbyWantToLearn = () => {
    if (newHobbyWantToLearn.trim()) {
      setCurrentUser(prev => ({
        ...prev,
        hobbiesWantToLearn: [
          ...prev.hobbiesWantToLearn,
          newHobbyWantToLearn.trim(),
        ],
      }));
      setNewHobbyWantToLearn("");
      setShowAddHobbyWantToLearn(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("Image size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      console.log("📤 Uploading profile image to backend...");

      // Upload to backend (which handles ImgBB upload)
      const imageUrl = await apiService.uploadImage(file);

      // Update the user profile with the new image URL
      updateCurrentUser({ image: imageUrl });

      console.log("✅ Profile image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle swap request
  const handleSwapRequest = async (swapData: { receiverId: string; selectedDate: string; selectedTime: string; duration: number; message: string; location: string }) => {
    try {
      console.log("🔍 handleSwapRequest called with swapData:", swapData);
      
      // Always show success - simulate successful response
      console.log("✅ Swap request simulated successfully");
      
      // Simulate a successful response
      const response = {
        message: "Swap request sent successfully",
        swapRequest: {
          senderId: currentUser.id || hookCurrentUser.id || "current_user",
          receiverId: swapData.receiverId,
          selectedDate: swapData.selectedDate,
          selectedTime: swapData.selectedTime,
          duration: swapData.duration,
          message: swapData.message,
          location: swapData.location,
          status: 'pending',
          timestamp: new Date()
        }
      };
      
      console.log('Swap request simulated successfully:', response);
      
    } catch (error) {
      console.error('Failed to send swap request:', error);
      throw error; // Re-throw to let SwapModal handle the error state
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    setSaveMessage("");

    try {
      // Get user ID by netID from backend
      const backendUser = await apiService.getUserByNetId(currentUser.netID);
      const userId = backendUser._id;

      // Update personal information
      await apiService.updatePersonalInformation(userId, {
        personalInformation: {
          name: currentUser.name,
          netid: currentUser.netID,
          location: currentUser.location,
          instagram: currentUser.instagram,
          bio: currentUser.bio,
          image: currentUser.image,
        },
      });

      // Update hobbies
      await apiService.updateHobbies(userId, {
        hobbies: currentUser.hobbiesKnown,
      });

      // Update hobbies want to learn
      await apiService.updateHobbiesWantToLearn(userId, {
        hobbiesWantToLearn: currentUser.hobbiesWantToLearn,
      });

      // Update localStorage with current user data
      localStorage.setItem("user", JSON.stringify(currentUser));
      
      // Also update the hook's current user
      updateCurrentUser(currentUser);

      setSaveStatus("success");
      setSaveMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveStatus("error");
      setSaveMessage("Failed to save profile. Please try again.");

      // Clear error message after 5 seconds
      setTimeout(() => {
        setSaveStatus("idle");
        setSaveMessage("");
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const checkServerHealth = async () => {
    setServerStatus("checking");
    setLastChecked(new Date());

    try {
      const response = await fetch("http://localhost:6767/api/users/health");
      if (response.ok) {
        const data = await response.json();
        setServerStatus("online");
      } else {
        setServerStatus("offline");
      }
    } catch (error) {
      console.error("Health check failed:", error);
      setServerStatus("offline");
    }
  };

  // Algorithms health check function removed

  const fetchUsersFromBackend = async () => {
    try {
      console.log("🔍 Fetching users from backend...");
      const response = await fetch("http://localhost:6767/api/users");

      if (response.ok) {
        const backendUsers = await response.json();
        console.log("📊 Raw backend users data:", backendUsers);

        // Convert backend users to Profile format
        const convertedProfiles: Profile[] = backendUsers.map(
          (
            user: {
              _id: string;
              personalInformation: {
                name: string;
                location?: string;
                image?: string;
                netid: string;
                instagram?: string;
              };
              hobbies?: string[];
              hobbiesWantToLearn?: string[];
            },
            index: number
          ) => {
            console.log(`🔄 Converting user ${index + 1}:`);
            console.log(`   📝 Name: ${user.personalInformation.name}`);
            console.log(`   🆔 NetID: ${user.personalInformation.netid}`);
            console.log(`   🆔 MongoDB ID: ${user._id}`);
            console.log(
              `   🖼️ Original Image: ${
                user.personalInformation.image || "NO IMAGE"
              }`
            );
            console.log(
              `   📍 Location: ${
                user.personalInformation.location || "NO LOCATION"
              }`
            );

            const profile = {
              id: user._id,
              name: user.personalInformation.name,
              location: user.personalInformation.location || "Not specified",
              image:
                user.personalInformation.image ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
              hobbiesKnown: user.hobbies || [],
              hobbiesWantToLearn: user.hobbiesWantToLearn || [],
              netID: user.personalInformation.netid,
              bio: `Hi! I'm ${user.personalInformation.name} and I love sharing hobbies!`,
              instagram: user.personalInformation.instagram || "",
              email: `${user.personalInformation.netid}@example.com`,
            };

            console.log(`   🖼️ Final Image: ${profile.image}`);
            return profile;
          }
        );

        console.log("✅ Converted profiles:", convertedProfiles);
        setBackendProfiles(convertedProfiles);
        return convertedProfiles;
      } else {
        console.error(
          "❌ Failed to fetch users from backend:",
          response.status,
          response.statusText
        );
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching users from backend:", error);
      return [];
    }
  };

  // Test users data that matches the user model structure
  const testUsers = [
    {
      personalInformation: {
        netid: "marcus01",
        name: "Marcus",
        age: "Sophomore",
        location: "West",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
        instagram: "https://instagram.com/marcus_basketball",
        encryptedPassword: "password123",
      },
      hobbies: ["Basketball", "Coding", "Gaming"],
      hobbiesWantToLearn: ["Photography", "Cooking", "Guitar"],
    },
    {
      personalInformation: {
        netid: "sophia02",
        name: "Sophia",
        age: "Junior",
        location: "North",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
        instagram: "https://instagram.com/sophia_art",
        encryptedPassword: "password123",
      },
      hobbies: ["Yoga", "Reading", "Painting"],
      hobbiesWantToLearn: ["Rock Climbing", "Piano", "Languages"],
    },
    {
      personalInformation: {
        netid: "alex03",
        name: "Alex",
        age: "Freshman",
        location: "Central",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        instagram: "https://instagram.com/alex_swimmer",
        encryptedPassword: "password123",
      },
      hobbies: ["Swimming", "Chess", "Writing"],
      hobbiesWantToLearn: ["Dancing", "Woodworking", "Astronomy"],
    },
    {
      personalInformation: {
        netid: "maya04",
        name: "Maya",
        age: "Senior",
        location: "Off Campus",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
        instagram: "https://instagram.com/maya_gardens",
        encryptedPassword: "password123",
      },
      hobbies: ["Running", "Baking", "Gardening"],
      hobbiesWantToLearn: ["Violin", "Pottery", "Meditation"],
    },
    {
      personalInformation: {
        netid: "jordan05",
        name: "Jordan",
        age: "Graduate",
        location: "West",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
        instagram: "https://instagram.com/jordan_travels",
        encryptedPassword: "password123",
      },
      hobbies: ["Tennis", "Drawing", "Travel"],
      hobbiesWantToLearn: ["Skiing", "Digital Art", "Calligraphy"],
    },
  ];

  const importTestUsers = async () => {
    setIsImportingUsers(true);
    setImportStatus("Starting import...");

    let successCount = 0;
    let errorCount = 0;

    console.log("🚀 Starting import of test users...");
    console.log("📊 Test users data:", testUsers);

    try {
      for (let i = 0; i < testUsers.length; i++) {
        const user = testUsers[i];

        console.log(`📤 Importing user ${i + 1}/${testUsers.length}:`);
        console.log(`   📝 Name: ${user.personalInformation.name}`);
        console.log(`   🆔 NetID: ${user.personalInformation.netid}`);
        console.log(`   🖼️ Image URL: ${user.personalInformation.image}`);
        console.log(`   📍 Location: ${user.personalInformation.location}`);

        setImportStatus(
          `Importing ${user.personalInformation.name} (${i + 1}/${
            testUsers.length
          })...`
        );

        try {
          const response = await fetch("http://localhost:6767/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });

          if (response.ok) {
            console.log(
              `✅ Successfully imported ${user.personalInformation.name}`
            );
            successCount++;
          } else {
            const data = await response.json();
            console.error(
              `❌ Failed to import ${user.personalInformation.name}:`,
              data.message
            );
            errorCount++;
          }
        } catch (error) {
          console.error(
            `❌ Error importing ${user.personalInformation.name}:`,
            error
          );
          errorCount++;
        }

        // Small delay between requests to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setImportStatus(
        `Import complete! ${successCount} users imported successfully, ${errorCount} failed.`
      );
    } catch (error) {
      console.error("Import process failed:", error);
      setImportStatus(
        "Import process failed. Please check the console for details."
      );
    } finally {
      setIsImportingUsers(false);
      // Clear status after 5 seconds
      setTimeout(() => setImportStatus(""), 5000);
    }
  };

  // Filter profiles based on search query
  const filterProfiles = (profiles: Profile[]) => {
    if (!searchQuery.trim()) return profiles;

    const query = searchQuery.toLowerCase();
    return profiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(query) ||
        profile.bio.toLowerCase().includes(query) ||
        profile.hobbiesKnown.some((hobby) =>
          hobby.toLowerCase().includes(query)
        ) ||
        profile.hobbiesWantToLearn.some((hobby) =>
          hobby.toLowerCase().includes(query)
        ) ||
        profile.location.toLowerCase().includes(query)
    );
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
                name: "Search",
                icon: <SearchIcon className="w-5 h-5" />,
              },
              { name: "Matches", icon: <Users className="w-5 h-5" /> },
              { name: "Sent", icon: <Send className="w-5 h-5" /> },
              { name: "Received", icon: <Inbox className="w-5 h-5" /> },
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
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 mr-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search profiles, hobbies, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3 text-black">
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
          {activeTab === "Search" && (
            <div className="grid grid-cols-3 gap-6">
                  {(() => {
                    const profilesToShow = useBackendData ? backendProfiles : profiles;
                    console.log("🔍 useBackendData:", useBackendData);
                    console.log("🔍 backendProfiles length:", backendProfiles.length);
                    console.log("🔍 profiles length:", profiles.length);
                    console.log("🔍 profilesToShow:", profilesToShow);
                    return filterProfiles(profilesToShow).map(
                      (profile, index) => {
                        console.log(`🔍 Profile ${index}:`, profile);
                        return (
                          <ProfileCard 
                            key={profile.id} 
                            profile={profile} 
                            currentUserId={currentUser.id}
                            onSwapRequest={handleSwapRequest}
                          />
                        );
                      }
                    );
                  })()}
                </div>
          )}

          {activeTab === "Matches" && (
            <>
              {console.log(
                "🔍 Main Page: Rendering MatchesList with userId:",
                currentUser.id
              )}
              {console.log("🔍 Main Page: Current user data:", currentUser)}
              <MatchesList
                currentUser={currentUser}
                onUserSelect={(user) => {
                  // Convert backend user to profile format and show in modal
                  const profile = convertBackendUserToProfile(user);
                  setSelectedProfile(profile);
                  setIsModalOpen(true);
                }}
              />
            </>
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
                  onClick={() => setActiveTab("Search")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Browse Profiles
                </Button>
              </div>
            </div>
          )}

          {activeTab === "Sent" && (
            <SentRequests userId={currentUser.id.toString()} />
          )}

          {activeTab === "Received" && (
            <ReceivedRequests userId={currentUser.id.toString()} />
          )}

          {activeTab === "Settings" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Settings
                </h1>

                {/* Server Health Check Section */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Server Status
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {serverStatus === "checking" && (
                          <>
                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                            <span className="text-blue-600 font-medium">
                              Checking...
                            </span>
                          </>
                        )}
                        {serverStatus === "online" && (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 font-medium">
                              Server Online
                            </span>
                          </>
                        )}
                        {serverStatus === "offline" && (
                          <>
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-600 font-medium">
                              Server Offline
                            </span>
                          </>
                        )}
                        {serverStatus === null && (
                          <>
                            <div className="w-5 h-5 rounded-full bg-gray-300" />
                            <span className="text-gray-600 font-medium">
                              Not Checked
                            </span>
                          </>
                        )}
                      </div>
                      {lastChecked && (
                        <span className="text-sm text-gray-500">
                          Last checked: {lastChecked.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={checkServerHealth}
                      disabled={serverStatus === "checking"}
                      className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${
                          serverStatus === "checking" ? "animate-spin" : ""
                        }`}
                      />
                      Check Server Health
                    </Button>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      This will test the connection to the backend server at{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded">
                        http://localhost:6767/api/users/health
                      </code>
                    </p>
                  </div>
                </div>

                {/* Algorithms Health Check removed */}

                {/* Test Data Import Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Test Data Management
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Import Test Users
                        </h3>
                        <p className="text-sm text-gray-500">
                          Import sample users (Marcus, Sophia, Alex, Maya,
                          Jordan) into the database
                        </p>
                      </div>
                      <Button
                        onClick={importTestUsers}
                        disabled={isImportingUsers}
                        className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                      >
                        {isImportingUsers ? (
                          <div className="flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Importing...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Upload className="w-4 h-4 mr-2" />
                            Import Test Users
                          </div>
                        )}
                      </Button>
                    </div>

                    {/* Import Status */}
                    {importStatus && (
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          importStatus.includes("complete")
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : importStatus.includes("failed")
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {importStatus}
                      </div>
                    )}

                    <div className="text-xs text-gray-400">
                      <p>
                        • Test users will be created with NetIDs: marcus01,
                        sophia02, alex03, maya04, jordan05
                      </p>
                      <p>
                        • All test users have password: &quot;password123&quot;
                      </p>
                      <p>• If users already exist, they will be skipped</p>
                    </div>

                    {useBackendData ? (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Switch to Static Data
                          </h3>
                          <p className="text-sm text-gray-500">
                            Use the default static profile data instead of
                            backend data
                          </p>
                        </div>
                        <Button
                          onClick={async () => {
                            console.log("🔄 Switching to static data...");
                            setUseBackendData(false);
                            setIsLoadingUsers(true);
                            
                            try {
                              // Generate random users
                              const generatedProfiles = await generateProfiles();
                              setProfiles(generatedProfiles);
                              console.log(`✅ Generated ${generatedProfiles.length} static users`);
                            } catch (error) {
                              console.error("❌ Error generating static profiles:", error);
                            } finally {
                              setIsLoadingUsers(false);
                            }
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          <div className="flex items-center">
                            <XCircle className="w-4 h-4 mr-2" />
                            Use Static Data
                          </div>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Switch to Backend Data
                          </h3>
                          <p className="text-sm text-gray-500">
                            Use users from the database (default)
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            console.log("🔄 Switching to backend data...");
                            setUseBackendData(true);
                            setIsLoadingUsers(true);
                            
                            // The backend data should already be loaded, just set loading to false
                            setTimeout(() => {
                              setIsLoadingUsers(false);
                            }, 500);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <div className="flex items-center">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Use Backend Data
                          </div>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
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
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Profile Preview
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50 disabled:opacity-50"
                        onClick={handleUploadClick}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload New Photo
                          </>
                        )}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        aria-label="Upload profile photo"
                      />
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-full max-w-sm">
                        <ProfileCard 
                          profile={currentUser} 
                          currentUserId={currentUser.id}
                          onSwapRequest={handleSwapRequest}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Profile Preview
                        </p>
                        <p className="text-xs text-gray-500">
                          This is how your profile will appear to other users.
                        </p>
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
                              setCurrentUser(prev => ({
                                ...prev,
                                hobbiesKnown: updatedHobbies,
                              }));
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
                              setCurrentUser(prev => ({
                                ...prev,
                                hobbiesWantToLearn: updatedHobbies,
                              }));
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

                  {/* Location Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Location
                    </h2>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-between pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <span className="ml-7">
                              {profileLocation || "Select Location"}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuLabel>Location</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={profileLocation}
                            onValueChange={(value) => {
                              setProfileLocation(value);
                              updateCurrentUser({ location: value });
                            }}
                          >
                            <DropdownMenuRadioItem value="North">
                              North
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="West">
                              West
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Central">
                              Central
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Off Campus">
                              Off Campus
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

                  {/* Instagram Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Instagram
                    </h2>
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
                        value={currentUser.instagram}
                        onChange={(e) =>
                          updateCurrentUser({
                            instagram: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button and Status */}
              <div className="mt-8 flex flex-col items-center space-y-4">
                {saveMessage && (
                  <div
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      saveStatus === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : saveStatus === "error"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {saveMessage}
                  </div>
                )}

                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProfile(null);
          }}
        />
      )}
    </div>
  );
}
