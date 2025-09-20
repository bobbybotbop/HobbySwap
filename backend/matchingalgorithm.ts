import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });
import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function normalizeHobbies(rawHobbies: string[]) {
  const prompt = `You are a classification engine. 
Input: a list of hobbies (free text).
Output: ONLY a valid JSON array with this exact format:
[
  {
    "hobby": "standardized_short_tag",
    "related": ["related1", "related2", "related3"]
  }
]

Hobbies: ${JSON.stringify(rawHobbies)}

Return ONLY the JSON array, no other text:`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // The text the model generated
    const content = response.data.choices[0].message.content;
    
    // Try to extract JSON from the response (in case it has extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    // Parse the JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
}

/** Takes in json file of user's desired hobbies and outputs people who do those hobbies */
function matchUsers(currentUser: any, allUsers: any[]) {
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

export {normalizeHobbies, matchUsers}

/** Test block */
if (import.meta.url === `file://${process.argv[1]}`) {
  // This runs only when you run the file directly with ts-node
  (async () => {
    try {
      const raw = ["playing soccer", "listening to jazz", "painting"];
      const result = await normalizeHobbies(raw);
      console.log("Normalized hobbies:", result);
    } catch (err) {
      console.error(err);
    }
  })();
}