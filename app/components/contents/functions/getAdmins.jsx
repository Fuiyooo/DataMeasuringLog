import { getCsrfToken } from "next-auth/react";

export default async function getAdmins() {
  try {
    // First, fetch CSRF token
    const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

    // Then, make the request to the admins API endpoint
    const response = await fetch("/api/admins?action=read", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken, // Include the CSRF token in the request headers
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admins");
    }

    const admins = await response.json();
    return admins;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
}
