import { getCsrfToken } from "next-auth/react";

export default async function deleteAdmin(admin) {
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
        action: "delete", // Action for 'update' operation
        userData: admin,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete admins");
    }

    const admins = await response.json();
    return admins;
  } catch (error) {
    console.error("Error deleting admin:", error);
    return [];
  }
}
