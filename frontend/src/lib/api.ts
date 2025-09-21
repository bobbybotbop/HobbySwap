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

export interface Match {
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
    console.log("🌐 API: getUserMatches - Starting request");
    console.log("📝 API: getUserMatches - User ID:", userId);
    console.log(
      "🔗 API: getUserMatches - URL:",
      `${API_BASE_URL}/${userId}/matches`
    );

    try {
      const response = await fetch(`${API_BASE_URL}/${userId}/matches`);

      console.log("📊 API: getUserMatches - Response status:", response.status);
      console.log("📊 API: getUserMatches - Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API: getUserMatches - Error response:", errorText);
        throw new Error(
          `Failed to fetch user matches: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ API: getUserMatches - Success, data:", data);
      return data;
    } catch (error: any) {
      console.error("❌ API: getUserMatches - Error:", error);
      throw error;
    }
  }

  // Search for users who can teach a specific hobby
  async searchHobbyTeachers(
    userId: string,
    hobby: string
  ): Promise<HobbySearchResponse> {
    const response = await fetch(
      `${API_BASE_URL}/search-teachers?userId=${userId}&hobby=${encodeURIComponent(
        hobby
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to search hobby teachers");
    }

    return response.json();
  }

  // Normalize hobby names using AI
  async normalizeHobbies(
    data: NormalizeHobbiesRequest
  ): Promise<NormalizeHobbiesResponse> {
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
}

export const apiService = new ApiService();
