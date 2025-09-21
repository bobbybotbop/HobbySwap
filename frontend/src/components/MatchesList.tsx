"use client";

import { useState, useEffect } from "react";
import { apiService, Match } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Star, RefreshCw, SortAsc } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { Profile } from "@/types/profile";

interface MatchesListProps {
  userId: string;
  onUserSelect?: (user: {
    _id: string;
    name: string;
    personalInformation: {
      name: string;
      image?: string;
      location?: string;
      bio?: string;
      netid: string;
      instagram?: string;
    };
  }) => void;
}

export default function MatchesList({
  userId,
  onUserSelect,
}: MatchesListProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  // Fetch all matches
  const fetchMatches = async () => {
    if (!userId) {
      console.log("🔍 MatchesList: No userId provided, skipping fetch");
      return;
    }

    console.log("🔍 MatchesList: Fetching matches for userId:", userId);
    setLoading(true);
    try {
      const response = await apiService.getUserMatches(userId);
      console.log("🔍 MatchesList: Raw API response:", response);
      console.log(
        "🔍 MatchesList: Number of matches received:",
        response.matches?.length || 0
      );
      setMatches(response.matches);
    } catch (error) {
      console.error("❌ MatchesList: Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [userId]);

  const handleUserSelect = (match: Match) => {
    if (onUserSelect) {
      onUserSelect(match.user);
    }
  };

  // Convert backend match to Profile format
  const convertMatchToProfile = (match: Match): Profile => {
    return {
      id: match.user._id,
      name: match.user.personalInformation.name,
      location: match.user.personalInformation.location || "Not specified",
      image:
        match.user.personalInformation.image ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
      hobbiesKnown: match.theyWantYouKnow, // Hobbies they want to learn from you
      hobbiesWantToLearn: match.theyKnowYouWant, // Hobbies you want to learn from them
      netID: match.user.personalInformation.netid,
      bio:
        match.user.personalInformation.bio ||
        `Hi! I'm ${match.user.personalInformation.name} and I love sharing hobbies!`,
      instagram: match.user.personalInformation.instagram || "",
      email: `${match.user.personalInformation.netid}@example.com`,
    };
  };

  // Filter matches to only show users who want to learn hobbies that others want to teach
  // This means we only show matches where theyKnowYouWant.length > 0 (they can teach you something)
  const filteredMatches = matches.filter(
    (match) => match.theyKnowYouWant.length > 0
  );

  console.log("🔍 MatchesList: Total matches:", matches.length);
  console.log(
    "🔍 MatchesList: Filtered matches (theyKnowYouWant > 0):",
    filteredMatches.length
  );
  console.log("🔍 MatchesList: All matches data:", matches);
  console.log("🔍 MatchesList: Filtered matches data:", filteredMatches);

  // Sort matches based on current sort option
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === "score") {
      return b.score - a.score; // Highest score first
    } else {
      return a.user.personalInformation.name.localeCompare(
        b.user.personalInformation.name
      );
    }
  });

  console.log("🔍 MatchesList: Sorted matches:", sortedMatches);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Hobby Matches
          </h2>
          <p className="text-gray-600 mt-1">
            Find people who can teach you new skills
          </p>
          {filteredMatches.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {filteredMatches.length}{" "}
              {filteredMatches.length === 1 ? "match" : "matches"} found
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === "score" ? "name" : "score")}
            className="flex items-center"
          >
            <SortAsc className="w-4 h-4 mr-2" />
            Sort by {sortBy === "score" ? "Name" : "Score"}
          </Button>
          <Button
            variant="outline"
            onClick={fetchMatches}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Finding your matches...</span>
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {sortedMatches.map((match, index) => {
            const profile = convertMatchToProfile(match);
            console.log(`🔍 MatchesList: Rendering match ${index}:`, match);
            console.log(`🔍 MatchesList: Converted profile ${index}:`, profile);
            return (
              <ProfileCard
                key={`${match.user._id}-${index}`}
                profile={profile}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No learning matches found
          </h3>
          <p className="text-gray-600">
            No users found who can teach you the hobbies you want to learn. Try
            updating your hobbies or check back later for new users.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Debug info:</p>
            <p>• Total matches: {matches.length}</p>
            <p>• Filtered matches: {filteredMatches.length}</p>
            <p>• Loading: {loading ? "Yes" : "No"}</p>
            <p>• UserId: {userId || "None"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
