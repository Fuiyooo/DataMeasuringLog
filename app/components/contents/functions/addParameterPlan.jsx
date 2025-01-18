import { getCsrfToken } from "next-auth/react";

export default async function addParameterPlan(data) {
  try {
    // First, fetch CSRF token
    const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

    // Then, make the request to the parameters API endpoint
    const response = await fetch("/api/parameters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken, // Include the CSRF token in the request headers
      },
      body: JSON.stringify({
        action: "add-parameter", // Action for 'create' operation
        data: data,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add parameter");
    }

    const responseData = await response.json();
    return responseData.message;
  } catch (error) {
    // TODO: Notification Error or Success
    return { error: error || "An unexpected error occurred" };
  }
}
