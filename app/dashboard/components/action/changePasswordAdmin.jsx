import { getCsrfToken } from "next-auth/react";

export default async function changePasswordAdmin(newPasswordInput) {
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
        action: "update", // Action for 'update' operation
        newPasswordInput: newPasswordInput,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admins");
    }

    // Parse the response text as a boolean
    const responseText = await response.text();
    const isPasswordUpdated = responseText === "true"; // Convert "true"/"false" to boolean
    return isPasswordUpdated; // Return true or false
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
}
