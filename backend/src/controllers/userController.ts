import { Request, Response } from "express";
import { User, InteractedUser } from "../models/userModel";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// GET all users EXCEPT for encrypted password
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔍 Fetching all users from database...");
    const users = await User.find({}).select(
      "-personalInformation.encryptedPassword"
    );

    console.log(`📊 Found ${users.length} users in database`);

    // Debug each user's image
    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   📝 Name: ${user.personalInformation.name}`);
      console.log(`   🆔 NetID: ${user.personalInformation.netid}`);
      console.log(
        `   🖼️ Image: ${user.personalInformation.image || "NO IMAGE"}`
      );
      console.log(
        `   📍 Location: ${user.personalInformation.location || "NO LOCATION"}`
      );
    });

    res.status(200).json(users);
  } catch (error: any) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET user
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Validate user credientials
export const verifyPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { netid, password } = req.body; // client provides netid + password

    const user = await User.findOne({
      "personalInformation.netid": netid,
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(
      password,
      user.personalInformation.encryptedPassword
    ); // compare input with hashed password
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({ message: "Password verified successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE password of user
export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      res.status(404).json({ message: "New Password is required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "personalInformation.encryptedPassword": hashedPassword },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { personalInformation, hobbies, hobbiesWantToLearn } = req.body;

    // Debug logging
    console.log("🔍 Creating user with data:");
    console.log("📝 Name:", personalInformation.name);
    console.log("🆔 NetID:", personalInformation.netid);
    console.log("🖼️ Image URL:", personalInformation.image);
    console.log("📍 Location:", personalInformation.location);
    console.log("🎯 Hobbies:", hobbies);
    console.log("📚 Hobbies to learn:", hobbiesWantToLearn);

    // Check if user already exists
    const existingUser = await User.findOne({
      "personalInformation.netid": personalInformation.netid,
    }).select("-personalInformation.encryptedPassword");

    if (existingUser) {
      console.log("❌ User already exists:", personalInformation.netid);
      res.status(409).json({
        message: "User with this email already exists",
      });
      return;
    }

    // Hash password
    personalInformation.encryptedPassword = await bcrypt.hash(
      personalInformation.encryptedPassword,
      10
    );

    // Create new user
    const newUser = new User({
      personalInformation,
      hobbies,
      hobbiesWantToLearn,
    });

    console.log("💾 Saving user to database...");
    const savedUser = await newUser.save();

    console.log("✅ User saved successfully!");
    console.log("🆔 Saved user ID:", savedUser._id);
    console.log("🖼️ Saved image URL:", savedUser.personalInformation.image);

    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Users Sent
export const sendUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // This should be the sender's ID
    const { netid, location, date } = req.body;

    // 1. Get sender user first
    const senderUser = await User.findById(id);
    if (!senderUser) {
      res.status(404).json({ message: "Sender user not found" });
      return;
    }

    // 2. Check if sending to yourself
    if (netid === senderUser.personalInformation.netid) {
      res.status(400).json({ message: "Cannot send to yourself" });
      return;
    }

    // 3. Check if target user exists
    const targetUser = await User.findOne({
      "personalInformation.netid": netid,
    }).select("-personalInformation.encryptedPassword");

    if (!targetUser) {
      res.status(404).json({ message: "Target user does not exist" });
      return;
    }

    // 4. Check if already sent to this person
    const alreadySent = senderUser.usersSent.some(
      (user: any) => user.netid === netid
    );

    if (alreadySent) {
      res
        .status(409)
        .json({ message: "User has already been sent to this person" });
      return;
    }

    // 5. Update the sender's usersSent array
    const updatedUser = await User.findByIdAndUpdate(
      id, // Use the ID from params
      {
        $push: {
          usersSent: {
            netid: netid,
            location: location || "",
            date: date || new Date(),
            timestamp: new Date(), // Always add timestamp
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-personalInformation.encryptedPassword");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found during update" });
      return;
    }

    const sentUser = await User.findOneAndUpdate(
      { "personalInformation.netid": netid },
      {
        $push: {
          usersReceived: {
            // ✅ Fixed spelling: "usersReceived" not "usersRecieved"
            netid: senderUser.personalInformation.netid,
            location: location || "",
            date: date || new Date(),
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    // 6. Return correct response
    res.status(200).json({
      message: "User sent successfully",
      usersSent: updatedUser.usersSent,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserByNetId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { netid } = req.params; // ✅ Get netid from URL params
    const user = await User.findOne({
      "personalInformation.netid": netid, // ✅ Correct field path
    }).select("-personalInformation.encryptedPassword"); // ✅ Exclude password

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserPersonalInformation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { personalInformation } = req.body;

    // Use $set with dot notation to update specific fields without replacing the entire object
    const updateFields: any = {};
    Object.keys(personalInformation).forEach((key) => {
      updateFields[`personalInformation.${key}`] = personalInformation[key];
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json("Successfully updated personal information");
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserHobbies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { hobbies } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { hobbies: hobbies },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    res.status(200).json("Successfully updated user hobbies");
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserHobbiesWant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { hobbiesWantToLearn } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { hobbiesWantToLearn: hobbiesWantToLearn },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    res.status(200).json("Successfully updated user new hobbies to learn");
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ===== ALGORITHM FUNCTIONS =====

// Helper function to calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  // Exact match
  if (s1 === s2) return 1.0;

  // Check if one contains the other (high similarity)
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;

  // Check for common hobby variations
  const hobbyVariations: { [key: string]: string[] } = {
    gaming: ["gaming", "video games", "esports", "playing games"],
    gooning: ["gooning", "gooner", "becoming a better gooner"],
    cooking: ["cooking", "culinary", "baking", "chef"],
    soccer: ["soccer", "football", "futbol"],
    photography: ["photography", "taking photos", "camera"],
    coding: ["coding", "programming", "software development", "javascript"],
    knitting: ["knitting", "crochet", "sewing"],
    wellness: ["wellness", "yoga", "meditation", "mindfulness"],
    travel: ["travel", "exploring", "visiting new places"],
  };

  // Check if hobbies are in the same variation group
  for (const [base, variations] of Object.entries(hobbyVariations)) {
    if (variations.includes(s1) && variations.includes(s2)) {
      return 0.8;
    }
  }

  // Check for word overlap
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter((word) => words2.includes(word));
  const totalWords = Math.max(words1.length, words2.length);

  if (totalWords > 0) {
    const wordSimilarity = commonWords.length / totalWords;
    if (wordSimilarity > 0.5) return wordSimilarity;
  }

  // Check for partial matches (substring)
  const minLength = Math.min(s1.length, s2.length);
  const maxLength = Math.max(s1.length, s2.length);

  if (minLength > 0) {
    let matches = 0;
    for (let i = 0; i < minLength; i++) {
      if (s1[i] === s2[i]) matches++;
    }
    const charSimilarity = matches / maxLength;
    if (charSimilarity > 0.6) return charSimilarity;
  }

  return 0;
}

// Helper function to find best matches between two hobby lists
function findBestMatches(
  hobbies1: string[],
  hobbies2: string[],
  threshold: number = 0.6
): string[] {
  const matches: string[] = [];

  for (const hobby1 of hobbies1) {
    let bestMatch = "";
    let bestScore = 0;

    for (const hobby2 of hobbies2) {
      const similarity = calculateSimilarity(hobby1, hobby2);
      if (similarity > bestScore && similarity >= threshold) {
        bestScore = similarity;
        bestMatch = hobby2;
      }
    }

    if (bestMatch) {
      matches.push(bestMatch);
    }
  }

  return matches;
}

async function normalizeHobbies(rawHobbies: string[]) {
  try {
    console.log("🤖 normalizeHobbies: Starting AI normalization");
    console.log("📝 normalizeHobbies: Input hobbies:", rawHobbies);

    // Check if we have hobbies to normalize
    if (!rawHobbies || rawHobbies.length === 0) {
      console.log(
        "⚠️ normalizeHobbies: No hobbies to normalize, returning empty array"
      );
      return [];
    }

    // Check API key
    if (!OPENROUTER_API_KEY) {
      console.error("❌ normalizeHobbies: OPENROUTER_API_KEY is not set");
      throw new Error("OpenRouter API key is not configured");
    }

    const prompt = `You are a hobby classification engine. You MUST respond with ONLY valid JSON.

Input: a list of hobbies (free text).
Output: ONLY a valid JSON array in this exact format:
[
  {
    "hobby": "standardized_short_tag",
    "related": ["related1", "related2", "related3"]
  }
]

CRITICAL: Your response must be ONLY the JSON array. No explanations, no additional text, no markdown formatting.

IMPORTANT: Use consistent, simple hobby names. Examples:
- "guitar", "playing guitar", "guitar playing" → "guitar"
- "cooking", "culinary", "baking" → "cooking"  
- "soccer", "football", "playing soccer" → "soccer"
- "painting", "art", "drawing" → "painting"
- "photography", "taking photos", "camera" → "photography"
- "coding", "programming", "software development" → "coding"
- "knitting", "crochet", "sewing" -> "knitting"
- "yoga", "meditation", "mindfulness" -> "wellness"
- "esports", "gaming", "playing games" -> "gaming"
- "travel", "exploring", "visiting new places" -> "travel"

Example Input: ["guitar playing", "singing", "cooking"]
Example Output: 
[
  { "hobby": "guitar", "related": ["music","instrument","practice", "songwriting"]},
  { "hobby": "singing", "related": ["vocal","music","performance"]},
  { "hobby": "cooking", "related": ["culinary","baking","recipes"]}
]

Classify and normalize these hobbies:
Hobbies: ${JSON.stringify(rawHobbies)}

Respond with ONLY the JSON array:`;

    console.log("🌐 normalizeHobbies: Making API call to OpenRouter...");
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ normalizeHobbies: API call successful");
    console.log("📊 normalizeHobbies: Response status:", response.status);

    // The text the model generated
    const content = response.data.choices[0].message.content;
    console.log("📝 normalizeHobbies: Raw AI response:", content);

    // Check if the response looks like it contains JSON
    if (!content || typeof content !== "string") {
      console.log(
        "⚠️ normalizeHobbies: Invalid response content, using fallback"
      );
      return rawHobbies.map((hobby) => ({
        hobby: hobby.toLowerCase(),
        related: [],
      }));
    }

    // Try to extract JSON from the response (in case it has extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    console.log("🔍 normalizeHobbies: Extracted JSON string:", jsonString);

    // Try to parse the JSON, with fallback if it fails
    try {
      const result = JSON.parse(jsonString);
      console.log("✅ normalizeHobbies: Successfully parsed result:", result);

      // Validate that the result is an array
      if (!Array.isArray(result)) {
        console.log(
          "⚠️ normalizeHobbies: Result is not an array, using fallback"
        );
        return rawHobbies.map((hobby) => ({
          hobby: hobby.toLowerCase(),
          related: [],
        }));
      }

      return result;
    } catch (parseError) {
      console.log("⚠️ normalizeHobbies: JSON parsing failed, using fallback");
      console.log("❌ normalizeHobbies: Parse error:", parseError);

      // Fallback: return simple normalized hobbies without AI processing
      return rawHobbies.map((hobby) => ({
        hobby: hobby.toLowerCase().trim(),
        related: [],
      }));
    }
  } catch (error: any) {
    console.error("❌ normalizeHobbies: Error occurred:", error);
    console.error("❌ normalizeHobbies: Error message:", error.message);
    console.error("❌ normalizeHobbies: Error response:", error.response?.data);
    console.error("❌ normalizeHobbies: Error stack:", error.stack);

    // Fallback: return simple normalized hobbies without AI processing
    console.log("🔄 normalizeHobbies: Using fallback normalization");
    return rawHobbies.map((hobby) => ({
      hobby: hobby.toLowerCase().trim(),
      related: [],
    }));
  }
}

/** Takes in json file of user's desired hobbies and outputs people who do those hobbies */
async function matchUsers(currentUser: any, allUsers: any[]) {
  try {
    console.log("🤖 matchUsers: Starting algorithm");
    console.log("📊 matchUsers: Input data:", {
      currentUserId: currentUser._id,
      currentUserHobbiesKnow: currentUser.hobbiesKnow?.length || 0,
      currentUserHobbiesWant: currentUser.hobbiesWant?.length || 0,
      allUsersCount: allUsers.length,
    });

    // Normalize hobbies using AI for better matching
    console.log("🤖 matchUsers: Normalizing hobbies with AI...");

    // Extract raw hobby names
    const currentWantsRaw =
      currentUser.hobbiesWant?.map((h: any) => h.name) || [];
    const currentKnowsRaw =
      currentUser.hobbiesKnow?.map((h: any) => h.name) || [];

    console.log("📝 matchUsers: Raw hobby names:", {
      wants: currentWantsRaw,
      knows: currentKnowsRaw,
    });

    // Normalize current user's hobbies
    console.log("🔄 matchUsers: Normalizing current user's wants...");
    const normalizedWants = await normalizeHobbies(currentWantsRaw);
    console.log("✅ matchUsers: Normalized wants:", normalizedWants);
    console.log(
      "🔍 DEBUG - Normalized wants details:",
      normalizedWants.map((h) => ({ hobby: h.hobby, related: h.related }))
    );

    console.log("🔄 matchUsers: Normalizing current user's knows...");
    const normalizedKnows = await normalizeHobbies(currentKnowsRaw);
    console.log("✅ matchUsers: Normalized knows:", normalizedKnows);
    console.log(
      "🔍 DEBUG - Normalized knows details:",
      normalizedKnows.map((h) => ({ hobby: h.hobby, related: h.related }))
    );

    // Create sets for fast lookups using normalized hobby names
    const currentWants = new Set(
      normalizedWants
        .filter((h: any) => h && h.hobby)
        .map((h: any) => h.hobby.toLowerCase())
    );
    const currentKnows = new Set(
      normalizedKnows
        .filter((h: any) => h && h.hobby)
        .map((h: any) => h.hobby.toLowerCase())
    );

    // Debug: Show what's in the sets after normalization
    console.log("\n🔍 DEBUG - Sets after normalization:");
    console.log("   Current wants set:", Array.from(currentWants));
    console.log("   Current knows set:", Array.from(currentKnows));

    // Test the expected matches manually
    console.log("\n🧪 MANUAL TEST - Expected matches:");
    console.log(
      "   Should 'gooning' match 'gooning'?",
      currentWants.has("gooning")
    );
    console.log(
      "   Should 'becoming a better gooner' match 'becoming a better gooner'?",
      currentKnows.has("becoming a better gooner")
    );

    // Test fuzzy matching
    console.log("\n🧪 FUZZY MATCHING TEST:");
    const testSimilarity1 = calculateSimilarity("gooning", "Gooning");
    const testSimilarity2 = calculateSimilarity(
      "becoming a better gooner",
      "Becoming a better gooner"
    );
    console.log(`   Similarity 'gooning' vs 'Gooning': ${testSimilarity1}`);
    console.log(
      `   Similarity 'becoming a better gooner' vs 'Becoming a better gooner': ${testSimilarity2}`
    );

    // Test with actual data from the logs
    const testMatches1 = findBestMatches(
      ["gooning"],
      ["Gooning", "打飞机", "打手枪"],
      0.6
    );
    const testMatches2 = findBestMatches(
      ["becoming a better gooner"],
      ["Becoming a better gooner", "Gooning", "Gooner"],
      0.6
    );
    console.log(`   Fuzzy matches for 'gooning': [${testMatches1.join(", ")}]`);
    console.log(
      `   Fuzzy matches for 'becoming a better gooner': [${testMatches2.join(
        ", "
      )}]`
    );

    console.log("✅ matchUsers: Hobbies normalized successfully");
    console.log("📊 matchUsers: Current user sets:", {
      wants: Array.from(currentWants),
      knows: Array.from(currentKnows),
    });

    // Print detailed hobby comparison
    console.log("\n🔍 HOBBY COMPARISON DETAILS:");
    console.log("👤 CURRENT USER:");
    console.log("   📚 Wants to learn:", currentWantsRaw);
    console.log("   🎯 Normalized wants:", Array.from(currentWants));
    console.log("   🛠️ Knows how to do:", currentKnowsRaw);
    console.log("   🎯 Normalized knows:", Array.from(currentKnows));

    // Debug: Show the actual data structure
    console.log("\n🔍 DEBUG - Current user data structure:");
    console.log(
      "   Raw currentUser object:",
      JSON.stringify(currentUser, null, 2)
    );
    console.log("   hobbiesWant array:", currentUser.hobbiesWant);
    console.log("   hobbiesKnow array:", currentUser.hobbiesKnow);

    console.log("\n👥 OTHER USERS:");

    const matches: Array<{
      user: any;
      score: number;
      theyKnowYouWant: string[];
      theyWantYouKnow: string[];
    }> = [];

    console.log("🔄 matchUsers: Processing other users...");
    for (let i = 0; i < allUsers.length; i++) {
      const other = allUsers[i];
      console.log(
        `👤 matchUsers: Processing user ${i + 1}/${allUsers.length}: ${
          other._id
        }`
      );

      if (other._id === currentUser._id) {
        console.log("⏭️ matchUsers: Skipping self");
        continue;
      }

      // Normalize other user's hobbies
      const otherKnowsRaw = other.hobbiesKnow?.map((h: any) => h.name) || [];
      const otherWantsRaw = other.hobbiesWant?.map((h: any) => h.name) || [];

      console.log(`📝 matchUsers: User ${other._id} raw hobbies:`, {
        knows: otherKnowsRaw,
        wants: otherWantsRaw,
      });

      // Print detailed hobby info for this user
      console.log(`\n👤 USER ${other._id} (${other.name || "No name"}):`);
      console.log(`   🛠️ Knows how to do:`, otherKnowsRaw);
      console.log(`   📚 Wants to learn:`, otherWantsRaw);

      console.log(`🔄 matchUsers: Normalizing user ${other._id} knows...`);
      const normalizedOtherKnows = await normalizeHobbies(otherKnowsRaw);
      console.log(
        `✅ matchUsers: User ${other._id} normalized knows:`,
        normalizedOtherKnows
      );

      console.log(`🔄 matchUsers: Normalizing user ${other._id} wants...`);
      const normalizedOtherWants = await normalizeHobbies(otherWantsRaw);
      console.log(
        `✅ matchUsers: User ${other._id} normalized wants:`,
        normalizedOtherWants
      );

      const otherKnows = new Set(
        normalizedOtherKnows
          .filter((h: any) => h && h.hobby)
          .map((h: any) => h.hobby.toLowerCase())
      );
      const otherWants = new Set(
        normalizedOtherWants
          .filter((h: any) => h && h.hobby)
          .map((h: any) => h.hobby.toLowerCase())
      );

      console.log(`📊 matchUsers: User ${other._id} sets:`, {
        knows: Array.from(otherKnows),
        wants: Array.from(otherWants),
      });

      // Print normalized hobbies for this user
      console.log(`   🎯 Normalized knows:`, Array.from(otherKnows));
      console.log(`   🎯 Normalized wants:`, Array.from(otherWants));

      // Use fuzzy matching instead of exact matching
      const currentWantsArray = Array.from(currentWants);
      const currentKnowsArray = Array.from(currentKnows);
      const otherKnowsArray = Array.from(otherKnows);
      const otherWantsArray = Array.from(otherWants);

      // Find fuzzy matches: what they can teach you
      const theyKnowYouWant = findBestMatches(
        currentWantsArray,
        otherKnowsArray,
        0.6
      );

      // Find fuzzy matches: what you can teach them
      const theyWantYouKnow = findBestMatches(
        currentKnowsArray,
        otherWantsArray,
        0.6
      );

      // Debug fuzzy matching
      console.log(`\n🔍 FUZZY MATCHING for ${other._id}:`);
      console.log(`   Current wants: [${currentWantsArray.join(", ")}]`);
      console.log(`   Other knows: [${otherKnowsArray.join(", ")}]`);
      console.log(
        `   Fuzzy matches (theyKnowYouWant): [${theyKnowYouWant.join(", ")}]`
      );
      console.log(`   Current knows: [${currentKnowsArray.join(", ")}]`);
      console.log(`   Other wants: [${otherWantsArray.join(", ")}]`);
      console.log(
        `   Fuzzy matches (theyWantYouKnow): [${theyWantYouKnow.join(", ")}]`
      );

      const score = theyKnowYouWant.length + theyWantYouKnow.length;

      console.log(`📊 matchUsers: User ${other._id} matching results:`, {
        theyKnowYouWant,
        theyWantYouKnow,
        score,
      });

      // Print detailed matching analysis
      console.log(`\n🔍 MATCHING ANALYSIS for ${other._id}:`);
      console.log(`   ✅ They can teach you:`, theyKnowYouWant);
      console.log(`   ✅ You can teach them:`, theyWantYouKnow);
      console.log(`   📊 Total score: ${score}`);

      // Debug: Show the intersection logic
      console.log(`\n🔍 DEBUG - Intersection Logic:`);
      console.log(
        `   Current user wants: [${Array.from(currentWants).join(", ")}]`
      );
      console.log(
        `   Other user knows: [${Array.from(otherKnows).join(", ")}]`
      );
      console.log(
        `   Intersection (theyKnowYouWant): [${theyKnowYouWant.join(", ")}]`
      );
      console.log(
        `   Current user knows: [${Array.from(currentKnows).join(", ")}]`
      );
      console.log(
        `   Other user wants: [${Array.from(otherWants).join(", ")}]`
      );
      console.log(
        `   Intersection (theyWantYouKnow): [${theyWantYouKnow.join(", ")}]`
      );

      if (score > 0) {
        console.log(`   🎉 MATCH FOUND! Score: ${score}`);
      } else {
        console.log(`   ❌ No match (score: ${score})`);
      }

      if (score > 0) {
        matches.push({
          user: other,
          score,
          theyKnowYouWant,
          theyWantYouKnow,
        });
        console.log(
          `✅ matchUsers: Added match for user ${other._id} with score ${score}`
        );
      } else {
        console.log(
          `⏭️ matchUsers: No match for user ${other._id} (score: ${score})`
        );
      }
    }

    // sort by score descending
    matches.sort((a, b) => b.score - a.score);

    console.log("✅ matchUsers: Algorithm completed successfully");
    console.log("📊 matchUsers: Final results:", {
      totalMatches: matches.length,
      matches: matches.map((m) => ({
        userId: m.user._id,
        userName: m.user.name,
        score: m.score,
      })),
    });

    // Print final summary of all hobby lists
    console.log("\n📋 FINAL HOBBY SUMMARY:");
    console.log("👤 CURRENT USER:");
    console.log("   📚 Wants to learn:", currentWantsRaw);
    console.log("   🛠️ Knows how to do:", currentKnowsRaw);

    console.log("\n👥 ALL OTHER USERS:");
    allUsers.forEach((user, index) => {
      const userKnows = user.hobbiesKnow?.map((h: any) => h.name) || [];
      const userWants = user.hobbiesWant?.map((h: any) => h.name) || [];
      console.log(`   ${index + 1}. ${user.name || user._id}:`);
      console.log(`      🛠️ Knows: [${userKnows.join(", ")}]`);
      console.log(`      📚 Wants: [${userWants.join(", ")}]`);
    });

    // Summary of fuzzy matching improvements
    console.log("\n🎯 FUZZY MATCHING IMPROVEMENTS:");
    console.log("   ✅ Case-insensitive matching");
    console.log("   ✅ Substring matching (e.g., 'gooning' matches 'Gooning')");
    console.log("   ✅ Word overlap detection");
    console.log(
      "   ✅ Common hobby variations (e.g., 'gaming' matches 'video games')"
    );
    console.log("   ✅ Character similarity for partial matches");
    console.log(`   📊 Found ${matches.length} matches using fuzzy logic`);

    return matches;
  } catch (error: any) {
    console.error("❌ matchUsers: Error in algorithm:", error);
    console.error("❌ matchUsers: Error stack:", error.stack);
    throw error;
  }
}

async function searchUsers(
  currentUser: any,
  allUsers: any[],
  searchedHobby: string
) {
  // 1. Input validation
  if (!searchedHobby || searchedHobby.trim() === "") {
    console.log("Please enter a hobby to search.");
    return;
  }

  // 2. Normalize the searched hobby
  const normalizedHobbyArray = await normalizeHobbies([searchedHobby]);
  const normalizedHobby = normalizedHobbyArray[0]?.hobby.toLowerCase();

  if (!normalizedHobby) {
    console.log("Could not normalize the hobby. Try a different term.");
    return;
  }

  // 3. Get all matches
  const matchedUsers = await matchUsers(currentUser, allUsers);

  // 4. Filter matches to only users who can teach this hobby
  const filteredMatches = matchedUsers.filter((match) =>
    match.theyKnowYouWant.map((h) => h.toLowerCase()).includes(normalizedHobby)
  );

  if (filteredMatches.length === 0) {
    console.log(`No users found who can teach "${searchedHobby}".`);
    return;
  }

  // 5. Display the filtered matches
  console.log(`Users who can teach "${searchedHobby}":`);
  filteredMatches.forEach((match) => {
    console.log(
      `- ${match.user.name || match.user._id} (Score: ${match.score})`
    );
    console.log(`   They can teach you: ${match.theyKnowYouWant.join(", ")}`);
    console.log(`   You can teach them: ${match.theyWantYouKnow.join(", ")}\n`);
  });
}

// Export the algorithm functions
export { normalizeHobbies, matchUsers, searchUsers };
