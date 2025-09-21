import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

interface ImgBBResponse {
  data: {
    url: string;
    display_url: string;
    id: string;
    title: string;
    url_viewer: string;
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

export const uploadImageToImgBB = async (
  file: Buffer,
  filename: string,
  mimetype: string
): Promise<string> => {
  const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is not configured");
  }

  try {
    // Convert buffer to base64
    const base64 = file.toString("base64");

    // Create form data
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64);
    formData.append("name", filename);

    console.log("📤 Uploading image to ImgBB...");

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

export const validateImageFile = (
  file: Express.Multer.File
): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.mimetype.startsWith("image/")) {
    return { isValid: false, error: "Please select a valid image file" };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: "Image size must be less than 10MB" };
  }

  return { isValid: true };
};
