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
    hobbies: string[];
    hobbiesWantToLearn: string[];
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

class ApiService {
  // Get user by NetID
  async getUserByNetId(netId: string) {
    console.log("🔍 API: getUserByNetId - netId:", netId);
    console.log(
      "🔍 API: getUserByNetId - URL:",
      `${API_BASE_URL}/netid/${netId}`
    );

    const response = await fetch(`${API_BASE_URL}/netid/${netId}`);

    console.log("📊 API: getUserByNetId - Response status:", response.status);
    console.log("📊 API: getUserByNetId - Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API: getUserByNetId - Error response:", errorText);
      throw new Error(
        `Failed to fetch user: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ API: getUserByNetId - Success, data:", data);
    return data;
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

  // Add user to favorites
  async addFavorite(userId: string, favoriteUserId: string) {
    const response = await fetch(`${API_BASE_URL}/${userId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favoriteUserId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add favorite");
    }

    return response.json();
  }

  // Remove user from favorites
  async removeFavorite(userId: string, favoriteUserId: string) {
    const response = await fetch(`${API_BASE_URL}/${userId}/favorites`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favoriteUserId }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }

    return response.json();
  }

  // Get user's favorites
  async getFavorites(userId: string) {
    console.log("🔍 API: getFavorites - userId:", userId);
    console.log(
      "🔍 API: getFavorites - URL:",
      `${API_BASE_URL}/${userId}/favorites`
    );

    const response = await fetch(`${API_BASE_URL}/${userId}/favorites`);

    console.log("📊 API: getFavorites - Response status:", response.status);
    console.log("📊 API: getFavorites - Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API: getFavorites - Error response:", errorText);
      throw new Error(
        `Failed to fetch favorites: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ API: getFavorites - Success, data:", data);
    return data;
  }

  // Send swap request to user
  async sendSwapRequest(
    userId: string,
    targetNetId: string,
    location?: string
  ) {
    console.log("🔄 API: sendSwapRequest - userId:", userId);
    console.log("🔄 API: sendSwapRequest - targetNetId:", targetNetId);
    console.log("🔄 API: sendSwapRequest - location:", location);

    const response = await fetch(`${API_BASE_URL}/${userId}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        netid: targetNetId,
        location: location || "",
        date: new Date().toISOString(),
      }),
    });

    console.log("📊 API: sendSwapRequest - Response status:", response.status);
    console.log("📊 API: sendSwapRequest - Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API: sendSwapRequest - Error response:", errorText);
      throw new Error(
        `Failed to send swap request: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ API: sendSwapRequest - Success, data:", data);
    return data;
  }
}

export const apiService = new ApiService();
