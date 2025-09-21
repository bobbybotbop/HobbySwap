// ImgBB API integration for image uploads
// Documentation: https://api.imgbb.com/

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is not configured");
  }

  // Convert file to base64
  const base64 = await fileToBase64(file);

  // Create form data
  const formData = new FormData();
  formData.append("key", IMGBB_API_KEY);
  formData.append("image", base64);
  formData.append("name", file.name);

  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `ImgBB API error: ${response.status} ${response.statusText}`
      );
    }

    const data: ImgBBResponse = await response.json();

    if (!data.success) {
      throw new Error("Failed to upload image to ImgBB");
    }

    console.log("✅ Image uploaded to ImgBB:", data.data.url);
    return data.data.url;
  } catch (error) {
    console.error("❌ Error uploading to ImgBB:", error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "Please select a valid image file" };
  }

  // Check file size (ImgBB supports up to 32MB, but we'll limit to 10MB for better UX)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: "Image size must be less than 10MB" };
  }

  return { isValid: true };
};
