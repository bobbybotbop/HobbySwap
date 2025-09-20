// Config file
dotenv.config();
const PORT = process.env.PORT || 3000;

import express, { Application } from "express";
import mongoose from "mongoose";
import userRoute from "./routes/index";
import dotenv from "dotenv";


const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Mount routes
app.use("./api/users", userRoute);

console.log("Hello")

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Something went wrong!",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

