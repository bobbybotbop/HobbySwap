import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, MessageSquare, Send, Loader2 } from "lucide-react";
import { Profile } from "@/types/profile";

interface SwapModalProps {
  profile: Profile;
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSwap: (swapData: SwapRequestData) => Promise<void>;
}

interface SwapRequestData {
  receiverId: string;
  selectedDate: string;
  selectedTime: string;
  duration: number;
  message: string;
  location: string;
}

const SwapModal: React.FC<SwapModalProps> = ({
  profile,
  currentUserId,
  isOpen,
  onClose,
  onConfirmSwap,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [swapStatus, setSwapStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Form state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60); // Default 1 hour
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  // Check if user is trying to swap with themselves
  const isSelfSwap = currentUserId && (profile.id === currentUserId || profile.id.toString() === currentUserId.toString());

  const handleClose = () => {
    // Reset form state on close
    setSelectedDate('');
    setSelectedTime('');
    setDuration(60);
    setMessage('');
    setLocation('');
    setSwapStatus('idle');
    onClose();
  };

  const handleConfirmSwap = async () => {
    // Basic validation
    if (!selectedDate || !selectedTime || !location || !message.trim()) {
      alert('Please fill in all required fields (date, time, location, and message)');
      return;
    }


    setIsLoading(true);
    setSwapStatus('idle'); // Reset status before new attempt

    try {
      const swapData: SwapRequestData = {
        receiverId: profile.id.toString(),
        selectedDate,
        selectedTime,
        duration,
        message,
        location,
      };
      await onConfirmSwap(swapData);
      setSwapStatus('success');
    } catch (error) {
      console.error("Error confirming swap:", error);
      setSwapStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = selectedDate && selectedTime && location && message.trim();
  const messageCharCount = message.length;
  const maxMessageChars = 500;

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          title="Close modal"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">Propose a Swap with {profile.name}</h2>
          <p className="text-red-100">
            Exchange skills and connect over shared passions!
          </p>
        </div>

        {/* Content */}
        <div className="p-6 pb-8">
          {isSelfSwap ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Can&apos;t Swap With Yourself</h3>
              <p className="text-gray-600 mb-4">
                You can&apos;t send a swap request to yourself! Try finding someone else to exchange hobbies with.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          ) : swapStatus === 'idle' ? (
            <>
              {/* What you'll exchange - Quick Preview */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Exchange Preview:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">You will teach:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {profile.hobbiesWantToLearn.length > 0 ? (
                        profile.hobbiesWantToLearn.map((hobby, i) => <li key={i}>{hobby}</li>)
                      ) : (
                        <li>No specific hobbies</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">You will learn:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {profile.hobbiesKnown.length > 0 ? (
                        profile.hobbiesKnown.map((hobby, i) => <li key={i}>{hobby}</li>)
                      ) : (
                        <li>No specific hobbies</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="swap-date" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline-block w-4 h-4 mr-1 text-gray-500" />
                    Select Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="swap-date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={minDate}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="swap-time" className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline-block w-4 h-4 mr-1 text-gray-500" />
                    Select Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="swap-time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Duration & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="swap-duration" className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline-block w-4 h-4 mr-1 text-gray-500" />
                    Duration
                  </label>
                  <select
                    id="swap-duration"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="swap-location" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline-block w-4 h-4 mr-1 text-gray-500" />
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="swap-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a location</option>
                    <option value="North Campus">North Campus</option>
                    <option value="West Campus">West Campus</option>
                    <option value="Central Campus">Central Campus</option>
                    <option value="Off Campus">Off Campus</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="swap-message" className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="inline-block w-4 h-4 mr-1 text-gray-500" />
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="swap-message"
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    if (e.target.value.length <= maxMessageChars) {
                      setMessage(e.target.value);
                    }
                  }}
                  placeholder={`Hi ${profile.name}, I&apos;d love to swap hobbies! I can teach you ${profile.hobbiesWantToLearn[0] || 'a hobby'} and would love to learn ${profile.hobbiesKnown[0] || 'a hobby'} from you.`}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  maxLength={maxMessageChars}
                ></textarea>
                <p className="text-xs text-gray-500 text-right mt-1">
                  {messageCharCount}/{maxMessageChars} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                <button
                  onClick={handleConfirmSwap}
                  disabled={isLoading || !isFormValid}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isFormValid && !isLoading
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Swap Request
                </button>
              </div>
            </>
          ) : swapStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Swap Request Sent!</h3>
              <p className="text-gray-600 mb-4">
                Your swap request has been successfully sent to {profile.name}. You&apos;ll be notified when they respond!
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Send Request</h3>
              <p className="text-gray-600 mb-4">
                There was an error sending your swap request. Please try again.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapModal;
