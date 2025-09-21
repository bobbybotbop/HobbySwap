// Simple test script for algorithms health check
const axios = require("axios");

async function testAlgorithmsHealth() {
  try {
    console.log("Testing algorithms health check endpoint...");

    const response = await axios.get(
      "http://localhost:6767/api/users/health/algorithms"
    );

    console.log("✅ Status:", response.status);
    console.log("✅ Response:", JSON.stringify(response.data, null, 2));

    if (response.data.status === "OK") {
      console.log("🎉 Algorithms health check passed!");
    } else {
      console.log("❌ Algorithms health check failed!");
    }
  } catch (error) {
    console.error("❌ Error testing algorithms health check:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Test regular health check too
async function testRegularHealth() {
  try {
    console.log("\nTesting regular health check endpoint...");

    const response = await axios.get("http://localhost:6767/api/users/health");

    console.log("✅ Status:", response.status);
    console.log("✅ Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Error testing regular health check:", error.message);
  }
}

async function runTests() {
  await testRegularHealth();
  await testAlgorithmsHealth();
}

runTests();
