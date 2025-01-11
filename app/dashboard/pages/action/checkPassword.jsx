import { getCsrfToken } from "next-auth/react";

export default async function checkPassword(oldPassword) {
  try {
    // First, fetch CSRF token
    const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

    // Then, make the request to the admins API endpoint
    const response = await fetch("/api/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken, // Include the CSRF token in the request headers
      },
      body: JSON.stringify({
        action: "check", // Action for 'check' operation
        oldPasswordInput: oldPassword,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admins");
    }

    // Parse the response text as a boolean
    const responseText = await response.text();
    const isPasswordValid = responseText === "true"; // Convert "true"/"false" to boolean
    return isPasswordValid; // Return true or false
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
}
