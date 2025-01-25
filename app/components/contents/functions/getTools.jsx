import { getCsrfToken } from "next-auth/react";

export default async function getTools() {
  try {
    // First, fetch CSRF token
    const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

    // Then, make the request to the tools API endpoint
    const response = await fetch("/api/tools?action=get-tools", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken, // Include the CSRF token in the request headers
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tools");
    }

    const tools = await response.json();
    return tools;
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
}
