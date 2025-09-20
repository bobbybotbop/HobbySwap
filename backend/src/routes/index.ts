import { Router } from "express";

const router = Router();

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API info route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the HobbySwap API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      api: "/api",
    },
  });
});


export default router;
