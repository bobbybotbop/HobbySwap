import { Router } from "express";
import {getUser, getUsers} from "../controllers/userController";

const router = Router();

// // Health check route
// router.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     message: "Server is running",
//     timestamp: new Date().toISOString(),
//   });
// });

// // API info route
// router.get("/info", (req, res) => {
//   res.json({
//     message: "Welcome to the HobbySwap API",
//     version: "1.0.0",
//     endpoints: {
//         health: { method: "GET", path: "/api/users/health", description: "Check if the server is running" },
//         getAllUsers: { method: "GET", path: "/api/users", description: "Return all users" },
//         getUserById: { method: "GET", path: "/api/users/:id", description: "Return a single user" },
//         getPasswordByNetId:{ method: "GET", path: "/api/users/:id", description: "Return a password mapped to the NetID"},
//         createUser: { method: "POST", path: "/api/users", description: "Create a new user" },
//         updateUser: { method: "PUT", path: "/api/users/:id", description: "Update a user" },
//         deleteUser: { method: "DELETE", path: "/api/users/:id", description: "Delete a user" },
//       },
//   });
// });

router.get("/", getUsers);
router.get("/:id", getUser);

export default router;


