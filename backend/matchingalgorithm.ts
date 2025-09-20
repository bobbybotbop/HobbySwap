import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();

/** Takes in json file of user's desired hobbies and outputs people who do those hobbies */
/** 
function matchUsers(currentUser, allUsers) {
  // Convert the current user's hobbies to sets for fast lookups
  const currentWants = new Set(currentUser.hobbiesWant.map(h => h.name.toLowerCase()));
  const currentKnows = new Set(currentUser.hobbiesKnow.map(h => h.name.toLowerCase()));

  const matches: Array<{
    user: any;
    score: number;
    theyKnowYouWant: string[];
    theyWantYouKnow: string[];
  }> = [];

  for (const other of allUsers) {
    if (other._id === currentUser._id) continue;

    const otherKnows = new Set(other.hobbiesKnow.map(h => h.name.toLowerCase()));
    const otherWants = new Set(other.hobbiesWant.map(h => h.name.toLowerCase()));

    // intersect: hobbies the other person knows that current user wants
    const theyKnowYouWant = [...otherKnows].filter((h): h is string => currentWants.has(h));
    // intersect: hobbies the other person wants that current user knows
    const theyWantYouKnow = [...otherWants].filter((h): h is string => currentKnows.has(h));

    const score = theyKnowYouWant.length + theyWantYouKnow.length;

    if (score > 0) {
      matches.push({
        user: other,
        score,
        theyKnowYouWant,
        theyWantYouKnow
      });
    }
  }

  // sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}
  */