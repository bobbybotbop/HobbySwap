import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";
import sharp from "sharp";

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit (will be compressed to 10MB)
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

interface CompressionResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
  width: number;
  height: number;
}

export const compressImage = async (
  file: Buffer,
  maxSizeBytes: number = 10 * 1024 * 1024, // 10MB default
  targetFormat: "jpeg" | "png" | "webp" = "jpeg"
): Promise<CompressionResult> => {
  const originalSize = file.length;

  console.log(
    `🗜️ Compressing image: ${originalSize} bytes -> target: ${maxSizeBytes} bytes`
  );

  try {
    // Get image metadata
    const metadata = await sharp(file).metadata();
    console.log(
      `📊 Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}, size: ${metadata.size} bytes`
    );

    // If already under size limit, return as is
    if (originalSize <= maxSizeBytes) {
      console.log("✅ Image already under size limit, no compression needed");
      return {
        buffer: file,
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1,
        format: metadata.format || "unknown",
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    }

    // Calculate compression ratio needed
    const compressionRatio = maxSizeBytes / originalSize;
    console.log(
      `🎯 Target compression ratio: ${(compressionRatio * 100).toFixed(1)}%`
    );

    // Start with high quality and reduce if needed
    let quality = 90;
    let scale = 1;
    let compressedBuffer: Buffer;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      attempts++;
      console.log(
        `🔄 Compression attempt ${attempts}: quality=${quality}, scale=${scale}`
      );

      let sharpInstance = sharp(file);

      // Apply scaling if needed
      if (scale < 1) {
        const newWidth = Math.floor((metadata.width || 1000) * scale);
        const newHeight = Math.floor((metadata.height || 1000) * scale);
        sharpInstance = sharpInstance.resize(newWidth, newHeight, {
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      // Apply format conversion and compression
      switch (targetFormat) {
        case "jpeg":
          compressedBuffer = await sharpInstance
            .jpeg({
              quality,
              progressive: true,
              mozjpeg: true,
            })
            .toBuffer();
          break;
        case "png":
          compressedBuffer = await sharpInstance
            .png({
              quality,
              progressive: true,
              compressionLevel: 9,
            })
            .toBuffer();
          break;
        case "webp":
          compressedBuffer = await sharpInstance
            .webp({
              quality,
              effort: 6,
            })
            .toBuffer();
          break;
        default:
          compressedBuffer = await sharpInstance
            .jpeg({
              quality,
              progressive: true,
              mozjpeg: true,
            })
            .toBuffer();
      }

      const compressedSize = compressedBuffer.length;
      console.log(
        `📦 Compressed size: ${compressedSize} bytes (${(
          (compressedSize / originalSize) *
          100
        ).toFixed(1)}% of original)`
      );

      // If we've achieved the target size, we're done
      if (compressedSize <= maxSizeBytes) {
        console.log(
          `✅ Compression successful: ${originalSize} -> ${compressedSize} bytes`
        );

        const newMetadata = await sharp(compressedBuffer).metadata();
        return {
          buffer: compressedBuffer,
          originalSize,
          compressedSize,
          compressionRatio: compressedSize / originalSize,
          format: newMetadata.format || targetFormat,
          width: newMetadata.width || 0,
          height: newMetadata.height || 0,
        };
      }

      // Reduce quality for next attempt
      if (quality > 20) {
        quality = Math.max(20, Math.floor(quality * 0.8));
      } else if (scale > 0.5) {
        // If quality is already low, start reducing scale
        scale = Math.max(0.5, scale * 0.9);
        quality = 90; // Reset quality when scaling
      } else {
        // Last resort: use minimum quality
        quality = 10;
      }
    } while (attempts < maxAttempts);

    // If we couldn't compress enough, return the best we could do
    console.log(
      `⚠️ Could not compress to target size after ${maxAttempts} attempts, using best result`
    );
    const finalMetadata = await sharp(compressedBuffer).metadata();

    return {
      buffer: compressedBuffer,
      originalSize,
      compressedSize: compressedBuffer.length,
      compressionRatio: compressedBuffer.length / originalSize,
      format: finalMetadata.format || targetFormat,
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0,
    };
  } catch (error) {
    console.error("❌ Error compressing image:", error);
    throw new Error(
      `Image compression failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

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
  mimetype: string,
  maxSizeBytes: number = 10 * 1024 * 1024 // 10MB default
): Promise<string> => {
  const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is not configured");
  }

  try {
    console.log(
      `📤 Starting image upload process for: ${filename} (${mimetype}, ${file.length} bytes)`
    );

    // Compress the image first
    const compressionResult = await compressImage(file, maxSizeBytes);

    console.log(
      `🗜️ Compression complete: ${compressionResult.originalSize} -> ${
        compressionResult.compressedSize
      } bytes (${(compressionResult.compressionRatio * 100).toFixed(
        1
      )}% of original)`
    );
    console.log(
      `📐 Final dimensions: ${compressionResult.width}x${compressionResult.height}, format: ${compressionResult.format}`
    );

    // Use compressed buffer for upload
    const compressedFile = compressionResult.buffer;

    // Convert compressed buffer to base64
    const base64 = compressedFile.toString("base64");

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
      // Try to get error details from response body
      let errorDetails = "";
      try {
        const errorData = await response.json();
        errorDetails = JSON.stringify(errorData, null, 2);
      } catch (e) {
        // If we can't parse JSON, get text response
        try {
          errorDetails = await response.text();
        } catch (textError) {
          errorDetails = "Unable to read error response";
        }
      }

      throw new Error(
        `ImgBB API error: ${response.status} ${response.statusText}
API Key: ${IMGBB_API_KEY ? `${IMGBB_API_KEY.substring(0, 8)}...` : "NOT SET"}
Request URL: https://api.imgbb.com/1/upload
Request Method: POST
File Details: ${filename} (${mimetype}, ${compressionResult.originalSize} -> ${
          compressionResult.compressedSize
        } bytes)
Compression: ${(compressionResult.compressionRatio * 100).toFixed(
          1
        )}% of original, ${compressionResult.width}x${
          compressionResult.height
        }px
Response Headers: ${JSON.stringify(
          Object.fromEntries(response.headers.entries()),
          null,
          2
        )}
Error Response Body: ${errorDetails}`
      );
    }

    const data: ImgBBResponse = await response.json();

    if (!data.success) {
      throw new Error(
        `ImgBB upload failed: ${data.status || "Unknown error"}
File Details: ${filename} (${mimetype}, ${compressionResult.originalSize} -> ${
          compressionResult.compressedSize
        } bytes)
Compression: ${(compressionResult.compressionRatio * 100).toFixed(
          1
        )}% of original, ${compressionResult.width}x${
          compressionResult.height
        }px
API Response: ${JSON.stringify(data, null, 2)}
API Key: ${IMGBB_API_KEY ? `${IMGBB_API_KEY.substring(0, 8)}...` : "NOT SET"}`
      );
    }

    console.log("✅ Image uploaded to ImgBB:", data.data.url);
    return data.data.url;
  } catch (error) {
    console.error("❌ Error uploading to ImgBB:", error);

    // If it's not already our enhanced error, wrap it with more context
    if (error instanceof Error && !error.message.includes("ImgBB")) {
      // Try to get compression info if available
      let compressionInfo = "";
      try {
        const compressionResult = await compressImage(file, maxSizeBytes);
        compressionInfo = `Compression: ${compressionResult.originalSize} -> ${
          compressionResult.compressedSize
        } bytes (${(compressionResult.compressionRatio * 100).toFixed(
          1
        )}% of original)`;
      } catch (compressionError) {
        compressionInfo = `Compression failed: ${
          compressionError instanceof Error
            ? compressionError.message
            : "Unknown error"
        }`;
      }

      throw new Error(
        `Failed to upload image to ImgBB: ${error.message}
File Details: ${filename} (${mimetype}, ${file.length} bytes)
${compressionInfo}
API Key: ${IMGBB_API_KEY ? `${IMGBB_API_KEY.substring(0, 8)}...` : "NOT SET"}
Original Error: ${error.stack || error.message}`
      );
    }

    throw error;
  }
};

export const validateImageFile = (
  file: Express.Multer.File,
  maxSizeMB: number = 50 // Increased limit since we compress
): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.mimetype.startsWith("image/")) {
    return { isValid: false, error: "Please select a valid image file" };
  }

  // Check file size (increased limit since we compress to 10MB)
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Image size must be less than ${maxSizeMB}MB (will be compressed to 10MB or less)`,
    };
  }

  // Check for reasonable minimum size
  const minSize = 1024; // 1KB minimum
  if (file.size < minSize) {
    return {
      isValid: false,
      error: "Image file appears to be too small or corrupted",
    };
  }

  return { isValid: true };
};

// Utility function to get compression preview without actually compressing
export const getCompressionPreview = async (
  file: Buffer,
  maxSizeBytes: number = 10 * 1024 * 1024
): Promise<{
  originalSize: number;
  estimatedCompressionRatio: number;
  estimatedCompressedSize: number;
  dimensions: { width: number; height: number };
  format: string;
}> => {
  try {
    const metadata = await sharp(file).metadata();
    const originalSize = file.length;

    // Estimate compression ratio based on file type and size
    let estimatedRatio = 1;
    if (metadata.format === "jpeg" || metadata.format === "jpg") {
      estimatedRatio = Math.max(0.3, maxSizeBytes / originalSize);
    } else if (metadata.format === "png") {
      estimatedRatio = Math.max(0.4, maxSizeBytes / originalSize);
    } else if (metadata.format === "webp") {
      estimatedRatio = Math.max(0.2, maxSizeBytes / originalSize);
    } else {
      estimatedRatio = Math.max(0.5, maxSizeBytes / originalSize);
    }

    return {
      originalSize,
      estimatedCompressionRatio: estimatedRatio,
      estimatedCompressedSize: Math.floor(originalSize * estimatedRatio),
      dimensions: {
        width: metadata.width || 0,
        height: metadata.height || 0,
      },
      format: metadata.format || "unknown",
    };
  } catch (error) {
    throw new Error(
      `Failed to get compression preview: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
