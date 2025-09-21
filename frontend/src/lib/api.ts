const API_BASE_URL = "http://localhost:6767/api/users";

export interface UpdatePersonalInfoRequest {
  personalInformation: {
    name: string;
    netid: string;
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

export interface SemanticMatch {
  user: {
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
  };
  transferableHobbies: string[];
  explanation: string;
  matchScore: number;
}

export interface SemanticMatchResponse {
  message: string;
  matches: SemanticMatch[];
  totalMatches: number;
  semanticAnalysis: {
    totalHobbiesAnalyzed: number;
    transferableMatchesFound: number;
    usersWithTransferableSkills: number;
  };
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

  // Get semantic search hobby matches
  async getSemanticMatches(currentUser: any): Promise<SemanticMatchResponse> {
    console.log("🌐 API: getSemanticMatches - Starting request");
    console.log("📝 API: getSemanticMatches - Current user:", currentUser);

    // Transform current user data to match backend expectations
    const transformedUser = {
      _id: currentUser.id,
      personalInformation: {
        name: currentUser.name,
        image: currentUser.image,
        location: currentUser.location,
        bio: currentUser.bio,
        netid: currentUser.netID,
        instagram: currentUser.instagram,
      },
      hobbies: currentUser.hobbiesKnown || [],
      hobbiesWantToLearn: currentUser.hobbiesWantToLearn || [],
    };

    console.log(
      "🔄 API: getSemanticMatches - Transformed user:",
      transformedUser
    );

    try {
      const response = await fetch(`${API_BASE_URL}/semantic-matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUser: transformedUser }),
      });

      console.log(
        "📊 API: getSemanticMatches - Response status:",
        response.status
      );
      console.log("📊 API: getSemanticMatches - Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "❌ API: getSemanticMatches - Error response:",
          errorText
        );
        throw new Error(
          `Failed to fetch semantic matches: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ API: getSemanticMatches - Success, data:", data);
      return data;
    } catch (error: any) {
      console.error("❌ API: getSemanticMatches - Error:", error);
      throw error;
    }
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
