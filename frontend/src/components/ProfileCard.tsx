import React, { useState } from "react";
import { MapPin, Star, BookOpen, ArrowRight } from "lucide-react";
import { Profile } from "@/types/profile";
import ProfileModal from "./ProfileModal";
import { apiService } from "@/lib/api";

interface ProfileCardProps {
  profile: Profile;
  currentUserId?: string;
  isFavorited?: boolean;
  onFavoriteToggle?: (profileId: string, isFavorited: boolean) => Promise<void>;
  onSwapRequest?: (profileId: string, profileName: string) => Promise<void>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  currentUserId,
  isFavorited = false,
  onFavoriteToggle,
  onSwapRequest,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (!onFavoriteToggle || isFavoriting) return;

    setIsFavoriting(true);
    try {
      if (isFavorited) {
        await apiService.removeFavorite(currentUserId || "", profile.id);
        await onFavoriteToggle(profile.id, false);
      } else {
        await apiService.addFavorite(currentUserId || "", profile.id);
        await onFavoriteToggle(profile.id, true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleSwapClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (!onSwapRequest || isSwapping) return;

    setIsSwapping(true);
    try {
      await onSwapRequest(profile.id, profile.name);
    } catch (error) {
      console.error("Error sending swap request:", error);
    } finally {
      setIsSwapping(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-md border border-gray-100 overflow-hidden">
      {/* Full Width Image with Overlay */}
      <div className="relative h-64">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Star Icon - Top Right */}
        {currentUserId && (
          <button
            onClick={handleFavoriteClick}
            disabled={isFavoriting}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isFavorited
                ? "bg-yellow-500 text-white shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            } ${
              isFavoriting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Name and Location Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1">{profile.name}</h3>
          <div className="flex items-center text-white">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm">{profile.location}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Hobbies Section */}
        <div className="space-y-3 mb-4">
          {/* Hobbies I Know */}
          <div>
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-yellow-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">I Know</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.hobbiesKnown.slice(0, 10).map((hobby, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                >
                  {hobby}
                </span>
              ))}
              {profile.hobbiesKnown.length > 10 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{profile.hobbiesKnown.length - 10}
                </span>
              )}
            </div>
          </div>

          {/* Hobbies I Want to Learn */}
          <div>
            <div className="flex items-center mb-2">
              <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">
                Want to Learn
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.hobbiesWantToLearn.slice(0, 10).map((hobby, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                >
                  {hobby}
                </span>
              ))}
              {profile.hobbiesWantToLearn.length > 10 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{profile.hobbiesWantToLearn.length - 10}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            More info
          </button>
          <button
            onClick={handleSwapClick}
            disabled={isSwapping || !currentUserId}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isSwapping || !currentUserId
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            <span>{isSwapping ? "Sending..." : "Swap"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        profile={profile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProfileCard;
