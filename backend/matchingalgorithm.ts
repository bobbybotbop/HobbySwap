import 'dotenv/config';
import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function normalizeHobbies(rawHobbies) {
  const prompt = `
  You are a classification engine. 
  Input: a list of hobbies (free text).
  Output: JSON array of standardized short tags for each hobby, 
  and 3 related hobbies for each.

  Hobbies: ${JSON.stringify(rawHobbies)}
  `;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'google/gemini-1.5-pro', // or whichever Gemini model you pick
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
  // It should be JSON per your prompt, so parse:
  return JSON.parse(content);
}

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