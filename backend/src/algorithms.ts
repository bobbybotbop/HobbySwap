import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function normalizeHobbies(rawHobbies: string[]) {
  const prompt = `You are a hobby classification engine. 
Input: a list of hobbies (free text).
Output: ONLY a valid JSON array in this format:
[
  {
    "hobby": "standardized_short_tag",
    "related": ["related1", "related2", "related3"]
  }
]

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

Example Input: ["guitar playing", "singing", "cooking]
Example Output: 
[
  { "hobby": "guitar", "related": ["music","instrument","practice", "songwriting"]},
  { "hobby": "soccer", "related": ["football","sports","team", "tennis"]},
  { "hobby": "cooking", "related": ["culinary","baking","recipes"]}
]

Classify and normalize these hobbies:
Hobbies: ${JSON.stringify(rawHobbies)}

Return ONLY the JSON array, no other text:`;

  try {
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

    // The text the model generated
    const content = response.data.choices[0].message.content;

    // Try to extract JSON from the response (in case it has extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;

    // Parse the JSON
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

/** Takes in json file of user's desired hobbies and outputs people who do those hobbies */
async function matchUsers(currentUser: any, allUsers: any[]) {
  // Normalize hobbies using AI for better matching
  console.log("Normalizing hobbies with AI...");

  // Extract raw hobby names
  const currentWantsRaw = currentUser.hobbiesWant.map((h: any) => h.name);
  const currentKnowsRaw = currentUser.hobbiesKnow.map((h: any) => h.name);

  // Normalize current user's hobbies
  const normalizedWants = await normalizeHobbies(currentWantsRaw);
  const normalizedKnows = await normalizeHobbies(currentKnowsRaw);

  // console.log("🔍 Normalized wants:", normalizedWants);
  // console.log("🔍 Normalized knows:", normalizedKnows);

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

  console.log("Hobbies normalized successfully");

  const matches: Array<{
    user: any;
    score: number;
    theyKnowYouWant: string[];
    theyWantYouKnow: string[];
  }> = [];

  for (const other of allUsers) {
    if (other._id === currentUser._id) continue;

    // Normalize other user's hobbies
    const otherKnowsRaw = other.hobbiesKnow.map((h: any) => h.name);
    const otherWantsRaw = other.hobbiesWant.map((h: any) => h.name);

    const normalizedOtherKnows = await normalizeHobbies(otherKnowsRaw);
    const normalizedOtherWants = await normalizeHobbies(otherWantsRaw);

    // console.log(`🔍 User ${other._id} normalized knows:`, normalizedOtherKnows);
    // console.log(`🔍 User ${other._id} normalized wants:`, normalizedOtherWants);

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

    // intersect: hobbies the other person knows that current user wants
    const theyKnowYouWant = [...otherKnows].filter((h): h is string =>
      currentWants.has(h)
    );
    // intersect: hobbies the other person wants that current user knows
    const theyWantYouKnow = [...otherWants].filter((h): h is string =>
      currentKnows.has(h)
    );

    const score = theyKnowYouWant.length + theyWantYouKnow.length;

    if (score > 0) {
      matches.push({
        user: other,
        score,
        theyKnowYouWant,
        theyWantYouKnow,
      });
    }
  }

  // sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

export { normalizeHobbies, matchUsers, searchUsers };

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

/** EVERYTHING BELOW IS TEST CASES FOR MATCHUSERS FUNCTION */
async function testMatchUsers() {
  console.log("=== Testing matchUsers function ===\n");

  // Test data
  const currentUser = {
    _id: "user1",
    hobbiesWant: [
      { name: "guitar" },
      { name: "cooking" },
      { name: "photography" },
    ],
    hobbiesKnow: [{ name: "soccer" }, { name: "painting" }, { name: "coding" }],
  };

  const allUsers = [
    {
      _id: "user2",
      hobbiesKnow: [{ name: "guitar" }, { name: "cooking" }],
      hobbiesWant: [{ name: "soccer" }, { name: "painting" }],
    },
    {
      _id: "user3",
      hobbiesKnow: [{ name: "photography" }],
      hobbiesWant: [{ name: "coding" }],
    },
    {
      _id: "user4",
      hobbiesKnow: [{ name: "dancing" }, { name: "singing" }],
      hobbiesWant: [{ name: "guitar" }],
    },
    {
      _id: "user5",
      hobbiesKnow: [
        { name: "guitar" },
        { name: "cooking" },
        { name: "photography" },
      ],
      hobbiesWant: [
        { name: "soccer" },
        { name: "painting" },
        { name: "coding" },
      ],
    },
    {
      _id: "user6",
      hobbiesKnow: [{ name: "tennis" }],
      hobbiesWant: [{ name: "swimming" }],
    },
  ];

  // Run the test
  const matches = await matchUsers(currentUser, allUsers);

  // Display results
  console.log("Current User:");
  console.log(
    `- Wants to learn: ${currentUser.hobbiesWant.map((h) => h.name).join(", ")}`
  );
  console.log(
    `- Knows how to do: ${currentUser.hobbiesKnow
      .map((h) => h.name)
      .join(", ")}\n`
  );

  console.log("Matches found:");
  matches.forEach((match, index) => {
    console.log(`${index + 1}. User ${match.user._id} (Score: ${match.score})`);
    console.log(`   - They can teach you: ${match.theyKnowYouWant.join(", ")}`);
    console.log(
      `   - You can teach them: ${match.theyWantYouKnow.join(", ")}\n`
    );
  });

  // Test assertions
  console.log("=== Test Results ===");

  // Test 1: Should find 4 matches (excluding user6 with no overlap)
  console.log(`✓ Found ${matches.length} matches (expected: 4)`);

  // Test 2: User5 should have highest score (6)
  const highestScore = matches[0];
  console.log(
    `✓ Highest score: ${highestScore.score} (User: ${highestScore.user._id})`
  );

  // Test 3: User6 should not be in matches (score 0)
  const user6Match = matches.find((m) => m.user._id === "user6");
  console.log(`✓ User6 excluded: ${user6Match ? "FAIL" : "PASS"}`);

  // Test 4: Scores should be in descending order
  const scoresDescending = matches.every(
    (match, i) => i === 0 || match.score <= matches[i - 1].score
  );
  console.log(
    `✓ Scores in descending order: ${scoresDescending ? "PASS" : "FAIL"}`
  );

  return matches;
}

/** Test block */
if (require.main === module) {
  // This runs only when you run the file directly with ts-node
  (async () => {
    try {
      console.log("=== Testing normalizeHobbies function ===");
      const raw = ["playing soccer", "listening to jazz", "painting"];
      const result = await normalizeHobbies(raw);
      console.log("Normalized hobbies:", result);
      console.log("\n");

      // Test matchUsers function
      await testMatchUsers();
    } catch (err) {
      console.error(err);
    }
  })();
}

/** Test cases for the searchUsers function */
async function testSearchUsersOriginal() {
  console.log("=== Testing original searchUsers function ===\n");

  const currentUser = {
    _id: "user1",
    name: "CurrentUser",
    hobbiesWant: [
      { name: "guitar" },
      { name: "cooking" },
      { name: "photography" },
    ],
    hobbiesKnow: [{ name: "soccer" }, { name: "painting" }, { name: "coding" }],
  };

  const allUsers = [
    {
      _id: "user2",
      name: "Alice",
      hobbiesKnow: [{ name: "guitar" }, { name: "cooking" }],
      hobbiesWant: [{ name: "soccer" }, { name: "painting" }],
    },
    {
      _id: "user3",
      name: "Bob",
      hobbiesKnow: [{ name: "photography" }],
      hobbiesWant: [{ name: "coding" }],
    },
    {
      _id: "user4",
      name: "Charlie",
      hobbiesKnow: [{ name: "dancing" }, { name: "singing" }],
      hobbiesWant: [{ name: "guitar" }],
    },
    {
      _id: "user5",
      name: "Diana",
      hobbiesKnow: [
        { name: "guitar" },
        { name: "cooking" },
        { name: "photography" },
      ],
      hobbiesWant: [
        { name: "soccer" },
        { name: "painting" },
        { name: "coding" },
      ],
    },
    {
      _id: "user6",
      name: "Eve",
      hobbiesKnow: [{ name: "tennis" }],
      hobbiesWant: [{ name: "swimming" }],
    },
  ];

  // --- Test 1: Single hobby search ---
  console.log("Test 1: Search for 'guitar'");
  await searchUsers(currentUser, allUsers, "guitar");

  // --- Test 2: Single hobby search ---
  console.log("Test 2: Search for 'photography'");
  await searchUsers(currentUser, allUsers, "photography");

  // --- Test 3: Single hobby search with no match ---
  console.log("Test 3: Search for 'swimming'");
  await searchUsers(currentUser, allUsers, "swimming");

  // --- Test 4: Case-insensitive search ---
  console.log("Test 4: Search for 'GUITAR'");
  await searchUsers(currentUser, allUsers, "GUITAR");

  // --- Test 5: Empty input ---
  console.log("Test 5: Search with empty string");
  await searchUsers(currentUser, allUsers, "");

  // --- Test 6: Search for a hobby multiple users can teach ---
  console.log("Test 6: Search for 'cooking'");
  await searchUsers(currentUser, allUsers, "cooking");
}
