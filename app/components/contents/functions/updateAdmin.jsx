import { getCsrfToken } from "next-auth/react";

export default async function updateAdmin(editAdmin) {
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
        userData: editAdmin,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update admin");
    }

    const admins = await response.json();
    return admins;
  } catch (error) {
    console.error("Error update admin:", error);
    return [];
  }
}
