import { Request, Response } from "express";
import { User } from "../models/userModel";
import { matchUsers, searchUsers, normalizeHobbies } from "./userController";

// GET matches for a specific user
export const getUserMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🚀 getUserMatches: Starting function");
    const { userId } = req.params;
    console.log("📝 getUserMatches: Received userId:", userId);

    // Validate userId
    if (!userId) {
      console.log("❌ getUserMatches: No userId provided");
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    console.log("🔍 getUserMatches: Fetching current user from database...");
    // Get the current user
    const currentUser = await User.findById(userId).select(
      "-personalInformation.encryptedPassword"
    );

    if (!currentUser) {
      console.log("❌ getUserMatches: User not found in database");
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("✅ getUserMatches: Current user found:", {
      id: currentUser._id,
      name: currentUser.personalInformation.name,
      hobbiesCount: currentUser.hobbies?.length || 0,
      hobbiesWantCount: currentUser.hobbiesWantToLearn?.length || 0,
    });

    console.log("🔍 getUserMatches: Fetching all other users from database...");
    // Get all other users
    const allUsers = await User.find({ _id: { $ne: userId } }).select(
      "-personalInformation.encryptedPassword"
    );

    console.log("✅ getUserMatches: Found", allUsers.length, "other users");

    // Transform data to match algorithm expectations
    console.log("🔄 getUserMatches: Transforming current user data...");
    const currentUserForMatching = {
      _id: currentUser._id,
      hobbiesKnow:
        currentUser.hobbies?.map((hobby: string) => ({
          name: hobby,
        })) || [],
      hobbiesWant:
        currentUser.hobbiesWantToLearn?.map((hobby: string) => ({
          name: hobby,
        })) || [],
    };

    console.log("📊 getUserMatches: Current user transformed:", {
      id: currentUserForMatching._id,
      hobbiesKnowCount: currentUserForMatching.hobbiesKnow.length,
      hobbiesWantCount: currentUserForMatching.hobbiesWant.length,
      hobbiesKnow: currentUserForMatching.hobbiesKnow.map((h) => h.name),
      hobbiesWant: currentUserForMatching.hobbiesWant.map((h) => h.name),
    });

    console.log("🔄 getUserMatches: Transforming all users data...");
    const allUsersForMatching = allUsers.map((user) => ({
      _id: user._id,
      name: user.personalInformation.name,
      hobbiesKnow:
        user.hobbies?.map((hobby: string) => ({ name: hobby })) || [],
      hobbiesWant:
        user.hobbiesWantToLearn?.map((hobby: string) => ({
          name: hobby,
        })) || [],
      personalInformation: user.personalInformation,
    }));

    console.log(
      "📊 getUserMatches: All users transformed:",
      allUsersForMatching.map((u) => ({
        id: u._id,
        name: u.name,
        hobbiesKnowCount: u.hobbiesKnow.length,
        hobbiesWantCount: u.hobbiesWant.length,
      }))
    );

    console.log(
      "🔍 getUserMatches: Finding matches for user:",
      currentUser.personalInformation.name
    );
    console.log(
      "👥 getUserMatches: Searching among",
      allUsersForMatching.length,
      "other users"
    );

    console.log("🤖 getUserMatches: Calling matchUsers algorithm...");
    // Get matches using the algorithm
    const matches = await matchUsers(
      currentUserForMatching,
      allUsersForMatching
    );

    console.log(`✅ getUserMatches: Found ${matches.length} matches`);
    console.log(
      "📋 getUserMatches: Match details:",
      matches.map((m) => ({
        userId: m.user._id,
        userName: m.user.name,
        score: m.score,
        theyKnowYouWant: m.theyKnowYouWant,
        theyWantYouKnow: m.theyWantYouKnow,
      }))
    );

    console.log("📤 getUserMatches: Sending response...");
    res.status(200).json({
      message: "Matches found successfully",
      matches: matches,
      totalMatches: matches.length,
    });

    console.log("✅ getUserMatches: Function completed successfully");
  } catch (error: any) {
    console.error("❌ getUserMatches: Error occurred:", error);
    console.error("❌ getUserMatches: Error stack:", error.stack);
    console.error("❌ getUserMatches: Error message:", error.message);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// GET users who can teach a specific hobby
export const searchHobbyTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, hobby } = req.query;

    if (!userId || !hobby) {
      res.status(400).json({
        message: "Both userId and hobby parameters are required",
      });
      return;
    }

    // Get the current user
    const currentUser = await User.findById(userId).select(
      "-personalInformation.encryptedPassword"
    );
    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Get all other users
    const allUsers = await User.find({ _id: { $ne: userId } }).select(
      "-personalInformation.encryptedPassword"
    );

    // Transform data to match algorithm expectations
    const currentUserForMatching = {
      _id: currentUser._id,
      name: currentUser.personalInformation.name,
      hobbiesKnow: currentUser.hobbies.map((hobby: string) => ({
        name: hobby,
      })),
      hobbiesWant: currentUser.hobbiesWantToLearn.map((hobby: string) => ({
        name: hobby,
      })),
    };

    const allUsersForMatching = allUsers.map((user) => ({
      _id: user._id,
      name: user.personalInformation.name,
      hobbiesKnow: user.hobbies.map((hobby: string) => ({ name: hobby })),
      hobbiesWant: user.hobbiesWantToLearn.map((hobby: string) => ({
        name: hobby,
      })),
      personalInformation: user.personalInformation,
    }));

    console.log(
      `🔍 Searching for teachers of "${hobby}" for user:`,
      currentUser.personalInformation.name
    );

    // Search for users who can teach this hobby
    await searchUsers(
      currentUserForMatching,
      allUsersForMatching,
      hobby as string
    );

    // Also get the filtered matches for the response
    const allMatches = await matchUsers(
      currentUserForMatching,
      allUsersForMatching
    );
    const hobbyMatches = allMatches.filter((match) =>
      match.theyKnowYouWant.some((h) =>
        h.toLowerCase().includes((hobby as string).toLowerCase())
      )
    );

    res.status(200).json({
      message: `Found ${hobbyMatches.length} users who can teach "${hobby}"`,
      hobby: hobby,
      matches: hobbyMatches,
      totalMatches: hobbyMatches.length,
    });
  } catch (error: any) {
    console.error("❌ Error searching hobby teachers:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST normalize hobbies using AI
export const normalizeUserHobbies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { hobbies } = req.body;

    if (!hobbies || !Array.isArray(hobbies)) {
      res.status(400).json({
        message: "Hobbies array is required",
      });
      return;
    }

    console.log("🤖 Normalizing hobbies with AI:", hobbies);

    // Use the AI normalization function
    const normalizedHobbies = await normalizeHobbies(hobbies);

    console.log("✅ Hobbies normalized successfully");

    res.status(200).json({
      message: "Hobbies normalized successfully",
      originalHobbies: hobbies,
      normalizedHobbies: normalizedHobbies,
    });
  } catch (error: any) {
    console.error("❌ Error normalizing hobbies:", error);
    res.status(500).json({ message: error.message });
  }
};
