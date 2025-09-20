import React from "react";
import { X, MapPin, Star, BookOpen, Instagram } from "lucide-react";
import { Profile } from "@/types/profile";

interface ProfileModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden relative ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          title="Close modal"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - Content */}
          <div className="lg:w-1/2 p-8 overflow-y-auto bg-white/80 backdrop-blur-sm">
            {/* Bio Section */}
            {profile.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  About
                </h3>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Hobbies I Know */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Hobbies I Know
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.hobbiesKnown.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full font-medium border border-green-200"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            {/* Hobbies I Want to Learn */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Want to Learn
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.hobbiesWantToLearn.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full font-medium border border-blue-200"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            {/* Instagram */}
            {profile.instagram && (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Instagram className="w-5 h-5 text-pink-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Instagram
                  </h3>
                </div>
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {profile.instagram}
                </a>
              </div>
            )}
          </div>

          {/* Right Side - Image with fade effect */}
          <div className="relative lg:w-1/2 h-64 lg:h-auto">
            <img
              src={profile.image}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            {/* Fade effect on the right */}
            <div className="absolute inset-0 bg-gradient-to-l from-green-50/30 to-transparent"></div>

            {/* Name and Location Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
                  {profile.name}
                </h2>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 drop-shadow-md" />
                  <span className="text-lg drop-shadow-md">
                    {profile.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
