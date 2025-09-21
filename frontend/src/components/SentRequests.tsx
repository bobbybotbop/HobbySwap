"use client";

import { useState, useEffect } from "react";
import { SwapRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Calendar, Clock, MapPin, MessageSquare, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SentRequestsProps {
  userId: string;
}

const SentRequests: React.FC<SentRequestsProps> = ({ userId }) => {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSentRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate successful API call with demo data
      console.log("📤 Showing demo sent requests data");
      setSwapRequests([
        {
          _id: "demo_sent_001",
          receiverId: {
            _id: "demo_receiver_001",
            personalInformation: {
              name: "Marcus",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
              location: "West"
            }
          },
          selectedDate: "2025-01-25",
          selectedTime: "16:00",
          duration: 60,
          message: "Hi! I'd love to learn basketball from you!",
          location: "Central Campus",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: "demo_sent_002",
          receiverId: {
            _id: "demo_receiver_002",
            personalInformation: {
              name: "Sophia",
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
              location: "North"
            }
          },
          selectedDate: "2025-01-26",
          selectedTime: "14:00",
          duration: 90,
          message: "Would you like to teach me yoga?",
          location: "North Campus",
          status: "accepted",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } catch (err: unknown) {
      console.error("Failed to load sent requests:", err instanceof Error ? err.message : String(err));
      setSwapRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      // Simulate successful cancellation
      console.log("✅ Request cancelled successfully:", requestId);
      
      // Update local state to show cancellation
      setSwapRequests(prev => 
        prev.map(req => 
          req._id === requestId 
            ? { ...req, status: 'cancelled' as const }
            : req
        )
      );
    } catch (err: unknown) {
      console.error("Failed to cancel request:", err);
      alert("Failed to cancel request. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    if (userId) {
      fetchSentRequests();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="ml-2 text-gray-600">Loading sent requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
        <Button onClick={fetchSentRequests} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sent Requests</h2>
        <Button onClick={fetchSentRequests} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {swapRequests.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium mb-2">No sent requests yet</p>
          <p>Start by sending swap requests to other users!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {swapRequests.map((request) => {
            const receiver = typeof request.receiverId === 'string' 
              ? { personalInformation: { name: 'Unknown User', image: '', location: '' } }
              : request.receiverId;

            return (
              <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={receiver.personalInformation.image || "/default-avatar.png"}
                      alt={receiver.personalInformation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {receiver.personalInformation.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {receiver.personalInformation.location || 'Location not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(request.selectedDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatTime(request.selectedTime)} ({request.duration} min)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{request.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Message sent</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Sent on {formatDate(request.createdAt)}
                  </p>
                  {request.status === 'pending' && (
                    <Button
                      onClick={() => handleCancelRequest(request._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SentRequests;
