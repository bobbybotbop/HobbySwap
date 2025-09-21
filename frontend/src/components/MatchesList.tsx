"use client";

import { useState, useEffect } from "react";
import { apiService, Match } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  Star,
  ArrowRight,
  RefreshCw,
  Filter,
  SortAsc,
} from "lucide-react";

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

  useEffect(() => {
    fetchMatches();
  }, [userId]);

  const handleUserSelect = (match: Match) => {
    if (onUserSelect) {
      onUserSelect(match.user);
    }
  };

  // Sort matches based on current sort option
  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === "score") {
      return b.score - a.score; // Highest score first
    } else {
      return a.user.personalInformation.name.localeCompare(
        b.user.personalInformation.name
      );
    }
  });

  const renderMatchCard = (match: Match, index: number) => (
    <div
      key={`${match.user._id}-${index}`}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleUserSelect(match)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {match.user.personalInformation.image ? (
            <img
              src={match.user.personalInformation.image}
              alt={match.user.personalInformation.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {match.user.personalInformation.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">
              {match.user.personalInformation.name}
            </h3>
            <p className="text-sm text-gray-500">
              {match.user.personalInformation.location ||
                "Location not specified"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-semibold">{match.score}</span>
          <span className="text-xs text-gray-500 ml-1">
            ({match.theyKnowYouWant.length + match.theyWantYouKnow.length}{" "}
            shared)
          </span>
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
          {matches.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {matches.length} {matches.length === 1 ? "match" : "matches"}{" "}
              found
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
      ) : matches.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {sortedMatches.map((match, index) => (
            <div
              key={`${match.user._id}-${index}`}
              className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]"
            >
              {renderMatchCard(match, index)}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No matches found
          </h3>
          <p className="text-gray-600">
            Try updating your hobbies or check back later for new users.
          </p>
        </div>
      )}
    </div>
  );
}
