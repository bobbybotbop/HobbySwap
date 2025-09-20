// Config file
import dotenv from "dotenv";
dotenv.config();

// config vars
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI!;

// import more dependecies
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import userRoute from "./routes/index";

// set up app
const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Mount routes
app.use("/api/users", userRoute);

mongoose
  .connect(MONGO_URI)
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
app.use("/", (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});
