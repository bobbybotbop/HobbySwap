"use client";

import { useState, useEffect } from "react";
import { SwapRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Calendar, Clock, MapPin, MessageSquare, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ReceivedRequestsProps {
  userId: string;
}

const ReceivedRequests: React.FC<ReceivedRequestsProps> = ({ userId }) => {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceivedRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate successful API call with demo data
      console.log("📥 Showing demo received requests data");
      setSwapRequests([
        {
          _id: "demo_received_001",
          senderId: {
            _id: "demo_sender_001",
            personalInformation: {
              name: "Alex",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
              location: "Central"
            }
          },
          receiverId: "current_user",
          selectedDate: "2025-01-27",
          selectedTime: "10:00",
          duration: 120,
          message: "I'd love to learn swimming from you!",
          location: "West Campus",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "demo_received_002",
          senderId: {
            _id: "demo_sender_002",
            personalInformation: {
              name: "Maya",
              image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
              location: "Off Campus"
            }
          },
          receiverId: "current_user",
          selectedDate: "2025-01-28",
          selectedTime: "15:30",
          duration: 75,
          message: "Can you teach me how to bake?",
          location: "North Campus",
          status: "accepted",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } catch (err: unknown) {
      console.error("Failed to load received requests:", err instanceof Error ? err.message : String(err));
      setSwapRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // Simulate successful acceptance
      console.log("✅ Request accepted successfully:", requestId);
      
      // Update local state to show acceptance
      setSwapRequests(prev => 
        prev.map(req => 
          req._id === requestId 
            ? { ...req, status: 'accepted' as const }
            : req
        )
      );
    } catch (err: unknown) {
      console.error("Failed to accept request:", err);
      alert("Failed to accept request. Please try again.");
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      // Simulate successful decline
      console.log("✅ Request declined successfully:", requestId);
      
      // Update local state to show decline
      setSwapRequests(prev => 
        prev.map(req => 
          req._id === requestId 
            ? { ...req, status: 'declined' as const }
            : req
        )
      );
    } catch (err: unknown) {
      console.error("Failed to decline request:", err);
      alert("Failed to decline request. Please try again.");
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
      fetchReceivedRequests();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="ml-2 text-gray-600">Loading received requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
        <Button onClick={fetchReceivedRequests} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Received Requests</h2>
        <Button onClick={fetchReceivedRequests} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {swapRequests.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium mb-2">No received requests yet</p>
          <p>When someone sends you a swap request, it will appear here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {swapRequests.map((request) => {
            const sender = typeof request.senderId === 'string' 
              ? { personalInformation: { name: 'Unknown User', image: '', location: '' } }
              : request.senderId;

            return (
              <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={sender.personalInformation.image || "/default-avatar.png"}
                      alt={sender.personalInformation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {sender.personalInformation.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {sender.personalInformation.location || 'Location not specified'}
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
                    <span className="text-sm">Message received</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Received on {formatDate(request.createdAt)}
                  </p>
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAcceptRequest(request._id)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDeclineRequest(request._id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
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

export default ReceivedRequests;
