"use client";

import { useState, useEffect } from "react";

interface ApiResponse {
  status: string;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [apiStatus, setApiStatus] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/health");
        const data = await response.json();
        setApiStatus(data);
      } catch (error) {
        console.error("Failed to fetch API status:", error);
        setApiStatus({
          status: "ERROR",
          message: "Backend server not running",
          timestamp: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApiStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🎯 HobbySwap
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with fellow hobby enthusiasts and discover new passions
          </p>

          {/* API Status Card */}
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Backend Status
            </h2>
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Checking...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    apiStatus?.status === "OK"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {apiStatus?.status}
                </div>
                <p className="text-gray-600 text-sm">{apiStatus?.message}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(apiStatus?.timestamp || "").toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Get Started
            </button>
            <button className="bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-3 px-8 rounded-lg border border-indigo-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Trade & Swap
            </h3>
            <p className="text-gray-600">
              Exchange your hobby items with other enthusiasts in your community
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Connect
            </h3>
            <p className="text-gray-600">
              Find like-minded hobbyists and build lasting friendships
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Discover
            </h3>
            <p className="text-gray-600">
              Explore new hobbies and expand your creative horizons
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
