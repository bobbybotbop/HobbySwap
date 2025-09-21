"use client";

import { useState, useEffect, useCallback } from "react";
import { apiService, SemanticMatch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, Users, RefreshCw, SortAsc, Star } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { Profile } from "@/types/profile";

interface MatchesListProps {
  currentUser: any;
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
  currentUser,
  onUserSelect,
}: MatchesListProps) {
  const [matches, setMatches] = useState<SemanticMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [semanticAnalysis, setSemanticAnalysis] = useState<any>(null);

  // Fetch semantic search matches with caching
  const fetchMatches = useCallback(
    async (forceRefresh = false) => {
      if (!currentUser || !currentUser.id) {
        console.log("🔍 MatchesList: No currentUser provided, skipping fetch");
        return;
      }

      // Check if we have cached matches and they're not too old (5 minutes)
      const cacheValid =
        lastFetched &&
        Date.now() - lastFetched.getTime() < 5 * 60 * 1000 &&
        matches.length > 0;

      if (!forceRefresh && cacheValid) {
        console.log("🔍 MatchesList: Using cached matches");
        return;
      }

      console.log(
        "🔍 MatchesList: Fetching semantic matches for user:",
        currentUser.id
      );
      setLoading(true);

      try {
        const response = await apiService.getSemanticMatches(currentUser);
        console.log("🔍 MatchesList: Semantic matches response:", response);

        setMatches(response.matches);
        setSemanticAnalysis(response.semanticAnalysis);
        setLastFetched(new Date());
      } catch (error) {
        console.error(
          "❌ MatchesList: Error fetching semantic matches:",
          error
        );
      } finally {
        setLoading(false);
      }
    },
    [currentUser, matches.length, lastFetched]
  );

  // Remove auto-fetch to prevent infinite loading
  // Users must manually click refresh to get matches

  const handleUserSelect = (match: SemanticMatch) => {
    if (onUserSelect) {
      onUserSelect(match.user);
    }
  };

  // Convert semantic match to Profile format
  const convertMatchToProfile = (match: SemanticMatch): Profile => {
    console.log("🔍 Converting match to profile:", {
      matchUser: match.user,
      hobbies: match.user.hobbies,
      hobbiesWantToLearn: match.user.hobbiesWantToLearn,
    });

    return {
      id: match.user._id,
      name: match.user.personalInformation.name,
      location: match.user.personalInformation.location || "Not specified",
      image:
        match.user.personalInformation.image ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
      hobbiesKnown: match.user.hobbies || [],
      hobbiesWantToLearn: match.user.hobbiesWantToLearn || [],
      netID: match.user.personalInformation.netid,
      bio:
        match.user.personalInformation.bio ||
        `Hi! I'm ${match.user.personalInformation.name} and I can help you learn new skills!`,
      instagram: match.user.personalInformation.instagram || "",
      email: `${match.user.personalInformation.netid}@example.com`,
    };
  };

  // Sort matches based on current sort option
  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === "score") {
      return b.matchScore - a.matchScore; // Highest score first
    } else {
      return a.user.personalInformation.name.localeCompare(
        b.user.personalInformation.name
      );
    }
  });

  const handleRefresh = () => {
    fetchMatches(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Semantic Search Matches
          </h2>
          <p className="text-gray-600 mt-1">
            Click refresh to find skill-based matches using semantic search
          </p>
          {matches.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {matches.length} {matches.length === 1 ? "match" : "matches"}{" "}
              found
            </p>
          )}
          {lastFetched && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastFetched.toLocaleTimeString()}
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
            onClick={handleRefresh}
            disabled={loading || !currentUser}
            className="flex items-center"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Searching..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Semantic Analysis Info */}
      {/* {semanticAnalysis && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <h3 className="font-medium text-purple-900">Semantic Analysis</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-purple-700 font-medium">
                {semanticAnalysis.totalHobbiesAnalyzed}
              </span>
              <span className="text-purple-600 ml-1">hobbies analyzed</span>
            </div>
            <div>
              <span className="text-purple-700 font-medium">
                {semanticAnalysis.transferableMatchesFound}
              </span>
              <span className="text-purple-600 ml-1">transferable skills</span>
            </div>
            <div>
              <span className="text-purple-700 font-medium">
                {semanticAnalysis.usersWithTransferableSkills}
              </span>
              <span className="text-purple-600 ml-1">potential mentors</span>
            </div>
          </div>
        </div>
      )} */}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="ml-2 text-gray-600">
            Finding semantic matches...
          </span>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {sortedMatches.map((match, index) => {
            const profile = convertMatchToProfile(match);
            return (
              <div key={`${match.user._id}-${index}`} className="relative">
                <ProfileCard profile={profile} />
                {/* Match Score Badge */}
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {match.matchScore}
                </div>
                {/* Transferable Skills Info */}
                <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                  <div className="font-medium text-purple-900 mb-1">
                    Matched Hobbies:
                  </div>
                  <div className="text-purple-700">
                    {match.transferableHobbies.join(", ")}
                  </div>
                  {match.explanation && (
                    <div className="text-purple-600 mt-1 italic">
                      "{match.explanation}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {matches.length === 0 && !loading
              ? "Click Refresh to Find Semantic Matches"
              : "No semantic matches found"}
          </h3>
          <p className="text-gray-600">
            {matches.length === 0 && !loading
              ? "Click the Refresh button above to find skill-based matches using semantic search."
              : "No users found with matching skills for your hobbies. Try updating your hobbies or check back later for new users."}
          </p>
          {matches.length === 0 && !loading && (
            <div className="mt-6">
              <Button
                onClick={handleRefresh}
                disabled={!currentUser}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              >
                Find Hobby Matches
              </Button>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            <p>Debug info:</p>
            <p>• Current user: {currentUser?.name || "None"}</p>
            <p>• User ID: {currentUser?.id || "None"}</p>
            <p>• Hobbies known: {currentUser?.hobbiesKnown?.length || 0}</p>
            <p>
              • Hobbies want to learn:{" "}
              {currentUser?.hobbiesWantToLearn?.length || 0}
            </p>
            <p>• Loading: {loading ? "Yes" : "No"}</p>
            <p>
              • Last fetched:{" "}
              {lastFetched ? lastFetched.toLocaleTimeString() : "Never"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
