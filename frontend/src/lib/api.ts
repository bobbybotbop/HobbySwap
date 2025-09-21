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
}

export const apiService = new ApiService();
