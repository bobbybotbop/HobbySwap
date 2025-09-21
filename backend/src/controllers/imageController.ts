import { Request, Response } from "express";
import {
  uploadImageToImgBB,
  validateImageFile,
} from "../services/imageService";

export const uploadProfileImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No image file provided" });
      return;
    }

    // Validate the uploaded file
    const validation = validateImageFile(req.file);
    if (!validation.isValid) {
      res.status(400).json({ message: validation.error });
      return;
    }

    console.log("📤 Uploading profile image:", {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Upload to ImgBB
    const imageUrl = await uploadImageToImgBB(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error: any) {
    console.error("❌ Error uploading image:", error);
    res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
};
