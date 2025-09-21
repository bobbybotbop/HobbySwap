const API_BASE_URL = "http://localhost:6767/api/users";

export interface UpdatePersonalInfoRequest {
  personalInformation: {
    name: string;
    email: string;
    location?: string;
    instagram?: string;
    bio?: string;
    image?: string;
  };
}

export interface UpdateHobbiesRequest {
  hobbies: string[];
}

export interface UpdateHobbiesWantToLearnRequest {
  hobbiesWantToLearn: string[];
}

export interface UpdateBioRequest {
  personalInformation: {
    bio: string;
  };
}

export interface Match {
  user: {
    _id: string;
    name: string;
    personalInformation: {
      name: string;
      image?: string;
      location?: string;
      bio?: string;
    };
  };
  score: number;
  theyKnowYouWant: string[];
  theyWantYouKnow: string[];
}

export interface MatchResponse {
  message: string;
  matches: Match[];
  totalMatches: number;
}

export interface HobbySearchResponse {
  message: string;
  hobby: string;
  matches: Match[];
  totalMatches: number;
}

export interface NormalizeHobbiesRequest {
  hobbies: string[];
}

export interface NormalizeHobbiesResponse {
  message: string;
  originalHobbies: string[];
  normalizedHobbies: Array<{
    hobby: string;
    related: string[];
  }>;
}

export interface SwapRequest {
  _id: string;
  senderId: string | {
    _id: string;
    personalInformation: {
      name: string;
      image?: string;
      location?: string;
    };
  };
  receiverId: string | {
    _id: string;
    personalInformation: {
      name: string;
      image?: string;
      location?: string;
    };
  };
  selectedDate: string;
  selectedTime: string;
  duration: number;
  message: string;
  location: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SendSwapRequestRequest {
  senderId: string;
  receiverId: string;
  selectedDate: string;
  selectedTime: string;
  duration: number;
  message: string;
  location: string;
}

export interface SendSwapRequestResponse {
  message: string;
  swapRequest: SwapRequest;
}

export interface GetSwapRequestsResponse {
  message: string;
  swapRequests: SwapRequest[];
  totalRequests: number;
}

export interface UpdateSwapRequestStatusRequest {
  status: 'accepted' | 'declined' | 'cancelled';
}

export interface UpdateSwapRequestStatusResponse {
  message: string;
  swapRequest: SwapRequest;
}

class ApiService {
  // Get user by NetID
  async getUserByNetId(netId: string) {
    const response = await fetch(`${API_BASE_URL}/netid/${netId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json();
  }

  // Update personal information
  async updatePersonalInformation(
    userId: string,
    data: UpdatePersonalInfoRequest
  ) {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update personal information");
    }

    return response.json();
  }

  // Update hobbies
  async updateHobbies(userId: string, data: UpdateHobbiesRequest) {
    const response = await fetch(`${API_BASE_URL}/updateHobbies/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update hobbies");
    }

    return response.json();
  }

  // Update hobbies want to learn
  async updateHobbiesWantToLearn(
    userId: string,
    data: UpdateHobbiesWantToLearnRequest
  ) {
    const response = await fetch(
      `${API_BASE_URL}/updateHobbiesToLearn/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update hobbies want to learn");
    }

    return response.json();
  }

  // Upload image to backend (which handles ImgBB upload)
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/upload-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.imageUrl;
  }

  // Get hobby matches for a user
  async getUserMatches(userId: string): Promise<MatchResponse> {
    console.log("🔍 Fetching matches for userId:", userId);
    console.log("🔍 API URL:", `${API_BASE_URL}/${userId}/matches`);
    
    // First check if backend is healthy
    try {
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      if (!healthResponse.ok) {
        throw new Error("Backend is not healthy");
      }
      console.log("🔍 Backend health check passed");
    } catch (error) {
      console.error("🔍 Backend health check failed:", error);
      throw new Error("Backend is not available");
    }
    
    const response = await fetch(`${API_BASE_URL}/${userId}/matches`);
    
    console.log("🔍 Response status:", response.status);
    console.log("🔍 Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("🔍 Error response:", errorText);
      throw new Error("Failed to fetch user matches");
    }
    
    return response.json();
  }

  // Search for users who can teach a specific hobby
  async searchHobbyTeachers(userId: string, hobby: string): Promise<HobbySearchResponse> {
    const response = await fetch(
      `${API_BASE_URL}/search-teachers?userId=${userId}&hobby=${encodeURIComponent(hobby)}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to search hobby teachers");
    }
    
    return response.json();
  }

  // Normalize hobby names using AI
  async normalizeHobbies(data: NormalizeHobbiesRequest): Promise<NormalizeHobbiesResponse> {
    const response = await fetch(`${API_BASE_URL}/normalize-hobbies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to normalize hobbies");
    }

    return response.json();
  }

  // Send a swap request
  async sendSwapRequest(data: SendSwapRequestRequest): Promise<SendSwapRequestResponse> {
    const response = await fetch(`${API_BASE_URL}/swap-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send swap request");
    }

    return response.json();
  }

  // Get sent swap requests for a user
  async getSentSwapRequests(userId: string): Promise<GetSwapRequestsResponse> {
    const response = await fetch(`${API_BASE_URL}/${userId}/sent-requests`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch sent swap requests");
    }
    
    return response.json();
  }

  // Get received swap requests for a user
  async getReceivedSwapRequests(userId: string): Promise<GetSwapRequestsResponse> {
    const response = await fetch(`${API_BASE_URL}/${userId}/received-requests`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch received swap requests");
    }
    
    return response.json();
  }

  // Update swap request status
  async updateSwapRequestStatus(
    requestId: string, 
    data: UpdateSwapRequestStatusRequest
  ): Promise<UpdateSwapRequestStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/swap-requests/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update swap request status");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
