// Remove any problematic dotenv configuration and use simple import
import dotenv from "dotenv";

// Configure dotenv FIRST, before any other imports
dotenv.config();

// Now import your functions
import { normalizeHobbies, matchUsers } from "./algorithms";

async function runTests() {
  console.log("=== Testing Hobby Normalization ===");
  
  // Test with simple hobbies first
  const testHobbies = ["soccer", "cooking", "painting"];
  console.log("Input:", testHobbies);
  
  try {
    const normalized = await normalizeHobbies(testHobbies);
    console.log("Normalized:", normalized);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the tests
runTests();