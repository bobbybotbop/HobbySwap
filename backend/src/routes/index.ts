import express, { Request, Response, Router } from "express";
import {
  createUser,
  getUser,
  getUsers,
  getUserByNetId,
  sendUser,
  updatePassword,
  verifyPassword,
  updateUserPersonalInformation,
  updateUserHobbies,
  updateUserHobbiesWant,
  getAIMatches,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/userController";
import { uploadProfileImage } from "../controllers/imageController";
import { upload } from "../services/imageService";
// Matching controller imports removed

const router = Router();

// Health check route
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Algorithms health check route removed

// API info route
router.get("/info", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the HobbySwap API",
    version: "1.0.0",
    endpoints: {
      health: {
        method: "GET",
        path: "/api/users/health",
        description: "Check if the server is running",
      },
      getAllUsers: {
        method: "GET",
        path: "/api/users",
        description: "Return all users",
      },
      getUserById: {
        method: "GET",
        path: "/api/users/:id",
        description: "Return a single user",
      },
      getPasswordByNetId: {
        method: "GET",
        path: "/api/users/:id",
        description: "Return a password mapped to the NetID",
      },
      createUser: {
        method: "POST",
        path: "/api/users",
        description: "Create a new user",
      },
      updateUser: {
        method: "PUT",
        path: "/api/users/:id",
        description: "Update a user",
      },
      deleteUser: {
        method: "DELETE",
        path: "/api/users/:id",
        description: "Delete a user",
      },
    },
  });
});

// GET routes (data retrieval)
router.get("/", getUsers); // GET /api/users
router.get("/id/:id", getUser); // GET /api/users/id/123 (better naming)
router.get("/netid/:netid", getUserByNetId); // GET /api/users/netid/jdoe123

// POST routes (actions that create/modify state)
router.post("/", createUser); // POST /api/users
router.post("/verify", verifyPassword); // POST /api/users/verify
router.post("/:id/send", sendUser); // POST /api/users/send (more RESTful)

// PATCH routes (partial updates)
router.patch("/password", updatePassword); // PATCH /api/users/password
router.patch("/:id", updateUserPersonalInformation); // PATCH /api/users/123 (general update)
router.patch("/updateHobbies/:id", updateUserHobbies);
router.patch("/updateHobbiesToLearn/:id", updateUserHobbiesWant);

// Favorites routes
router.post("/:userId/favorites", addFavorite); // POST /api/users/123/favorites
router.delete("/:userId/favorites", removeFavorite); // DELETE /api/users/123/favorites
router.get("/:userId/favorites", getFavorites); // GET /api/users/123/favorites

// POST routes for file uploads
router.post("/upload-image", upload.single("image"), uploadProfileImage); // POST /api/users/upload-image

// AI-powered matching route
router.post("/ai-matches", getAIMatches); // POST /api/users/ai-matches

// Semantic matches route (alias for ai-matches)
router.post("/semantic-matches", getAIMatches); // POST /api/users/semantic-matches

// Test OpenRouter models list
router.get(
  "/test-openrouter-models",
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("🧪 Testing OpenRouter models list...");

      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
      if (!OPENROUTER_API_KEY) {
        res.status(500).json({
          message: "OPENROUTER_API_KEY not found in environment variables",
        });
        return;
      }

      const axios = require("axios");
      const response = await axios.get("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      const models = response.data.data;
      const sonomaModels = models.filter(
        (model: any) =>
          model.id.toLowerCase().includes("sonoma") ||
          model.id.toLowerCase().includes("sky")
      );

      res.status(200).json({
        message: "OpenRouter models retrieved successfully",
        totalModels: models.length,
        sonomaRelatedModels: sonomaModels,
        allModels: models.map((model: any) => model.id).slice(0, 20), // First 20 models
      });
    } catch (error: any) {
      console.error("❌ OpenRouter models test failed:", error);
      res.status(500).json({
        message: "OpenRouter models test failed",
        error: error.response?.data || error.message,
      });
    }
  }
);

// Test OpenRouter with sonoma-sky-alpha specifically
router.get(
  "/test-sonoma-sky",
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("🧪 Testing OpenRouter with sonoma-sky-alpha...");

      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
      if (!OPENROUTER_API_KEY) {
        res.status(500).json({
          message: "OPENROUTER_API_KEY not found in environment variables",
        });
        return;
      }

      const axios = require("axios");
      const sonomaModel = "openrouter/sonoma-sky-alpha";
      console.log("📝 Testing with model:", sonomaModel);

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: sonomaModel,
          messages: [
            { role: "user", content: "Hello, this is a test message." },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      res.status(200).json({
        message: "OpenRouter sonoma-sky-alpha test successful!",
        response: response.data.choices[0].message.content,
        model: sonomaModel,
        actualModelUsed: response.data.model || sonomaModel,
      });
    } catch (error: any) {
      console.error("❌ OpenRouter sonoma-sky-alpha test failed:", error);
      res.status(500).json({
        message: "OpenRouter sonoma-sky-alpha test failed",
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
    }
  }
);

// Test OpenRouter connection
router.get(
  "/test-openrouter",
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("🧪 Testing OpenRouter connection...");

      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
      console.log("🔑 OPENROUTER_API_KEY exists:", !!OPENROUTER_API_KEY);
      console.log("🔑 OPENROUTER_API_KEY length:", OPENROUTER_API_KEY?.length);
      console.log(
        "🔑 OPENROUTER_API_KEY starts with:",
        OPENROUTER_API_KEY?.substring(0, 10) + "..."
      );

      if (!OPENROUTER_API_KEY) {
        res.status(500).json({
          message: "OPENROUTER_API_KEY not found in environment variables",
          error: "Please set OPENROUTER_API_KEY in your .env file",
        });
        return;
      }

      const axios = require("axios");
      console.log("🌐 Making request to OpenRouter...");
      console.log(
        "📝 Request URL: https://openrouter.ai/api/v1/chat/completions"
      );
      console.log("📝 Model: openrouter/sonoma-sky-alpha");
      console.log("📝 Headers:", {
        Authorization: `Bearer ${OPENROUTER_API_KEY.substring(0, 10)}...`,
        "Content-Type": "application/json",
      });

      // Try with a known working model first
      const testModel = "meta-llama/llama-3.1-8b-instruct";
      console.log("📝 Testing with model:", testModel);

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: testModel,
          messages: [
            { role: "user", content: "Hello, this is a test message." },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      res.status(200).json({
        message: "OpenRouter connection successful!",
        response: response.data.choices[0].message.content,
        model: testModel,
        actualModelUsed: response.data.model || testModel,
      });
    } catch (error: any) {
      console.error("❌ OpenRouter test failed:");
      console.error("❌ Error type:", typeof error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error headers:", error.response?.headers);
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));

      res.status(500).json({
        message: "OpenRouter connection failed",
        error: error.response?.data || error.message,
        status: error.response?.status,
        debug: {
          errorType: typeof error,
          errorMessage: error.message,
          responseData: error.response?.data,
          responseStatus: error.response?.status,
        },
      });
    }
  }
);

// OpenRouter API test route removed

export default router;
