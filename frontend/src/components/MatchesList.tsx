"use client";

import { useState, useEffect } from "react";
import { apiService, Match } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Users, Star, ArrowRight, RefreshCw } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";

interface MatchesListProps {
  userId: string;
  onUserSelect?: (user: any) => void;
}

export default function MatchesList({ userId, onUserSelect }: MatchesListProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHobby, setSearchHobby] = useState("");
  const [searchResults, setSearchResults] = useState<Match[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "search">("all");

  // Fetch all matches
  const fetchMatches = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await apiService.getUserMatches(userId);
      setMatches(response.matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search for specific hobby teachers
  const searchHobbyTeachers = async () => {
    if (!userId || !searchHobby.trim()) return;
    
    setSearchLoading(true);
    try {
      const response = await apiService.searchHobbyTeachers(userId, searchHobby);
      setSearchResults(response.matches);
      setActiveTab("search");
    } catch (error) {
      console.error("Error searching hobby teachers:", error);
    } finally {
      setSearchLoading(false);
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

  const renderMatchCard = (match: Match, index: number) => (
    <div
      key={`${match.user._id}-${index}`}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleUserSelect(match)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {match.user.personalInformation.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {match.user.personalInformation.name}
            </h3>
            <p className="text-sm text-gray-500">
              {match.user.personalInformation.location || "Location not specified"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-semibold">{match.score}</span>
        </div>
      </div>

      <div className="space-y-3">
        {match.theyKnowYouWant.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">
              🎯 They can teach you:
            </h4>
            <div className="flex flex-wrap gap-2">
              {match.theyKnowYouWant.map((hobby, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {match.theyWantYouKnow.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-2">
              🎓 You can teach them:
            </h4>
            <div className="flex flex-wrap gap-2">
              {match.theyWantYouKnow.map((hobby, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          className="w-full group"
          onClick={(e) => {
            e.stopPropagation();
            handleUserSelect(match);
          }}
        >
          View Profile
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );

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
            Find people who can teach you new skills and learn from you
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchMatches}
          disabled={loading}
          className="flex items-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Search for specific hobby teachers</h3>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter a hobby (e.g., guitar, cooking, photography)"
            value={searchHobby}
            onChange={(e) => setSearchHobby(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchHobbyTeachers()}
            className="flex-1"
          />
          <Button
            onClick={searchHobbyTeachers}
            disabled={searchLoading || !searchHobby.trim()}
            className="flex items-center"
          >
            {searchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All Matches ({matches.length})
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "search"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Search Results ({searchResults.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Finding your matches...</span>
        </div>
      ) : activeTab === "all" ? (
        matches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match, index) => renderMatchCard(match, index))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600">
              Try updating your hobbies or check back later for new users.
            </p>
          </div>
        )
      ) : (
        searchResults.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((match, index) => renderMatchCard(match, index))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-600">
              No one can teach "{searchHobby}" yet. Try a different hobby or check back later.
            </p>
          </div>
        )
      )}
    </div>
  );
}
