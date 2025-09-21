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
} from "../controllers/userController";
import { uploadProfileImage } from "../controllers/imageController";
import { upload } from "../services/imageService";
import { 
  getUserMatches, 
  searchHobbyTeachers, 
  normalizeUserHobbies 
} from "../controllers/matchingController";

const router = Router();

// Health check route
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

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
      getUserMatches: {
        method: "GET",
        path: "/api/users/:userId/matches",
        description: "Get hobby matches for a user",
      },
      searchHobbyTeachers: {
        method: "GET",
        path: "/api/users/search-teachers?userId=123&hobby=guitar",
        description: "Search for users who can teach a specific hobby",
      },
      normalizeHobbies: {
        method: "POST",
        path: "/api/users/normalize-hobbies",
        description: "Normalize hobby names using AI",
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

// POST routes for file uploads
router.post("/upload-image", upload.single("image"), uploadProfileImage); // POST /api/users/upload-image

// GET routes for matching algorithms
router.get("/:userId/matches", getUserMatches); // GET /api/users/:userId/matches
router.get("/search-teachers", searchHobbyTeachers); // GET /api/users/search-teachers?userId=123&hobby=guitar

// POST routes for AI features
router.post("/normalize-hobbies", normalizeUserHobbies); // POST /api/users/normalize-hobbies

export default router;
