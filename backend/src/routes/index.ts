import express, { Application, Request, Response, Router } from "express";
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

const router = Router();

// Health check route
router.get("/health", (req: Request, res: Response) => {
  // Disable CORS by allowing all origins
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Handle preflight OPTIONS requests for health endpoint
router.options("/health", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.status(200).end();
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

export default router;
