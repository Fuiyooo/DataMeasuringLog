import { getCsrfToken } from "next-auth/react";

export default async function createTool(newTool) {
  // First, fetch CSRF token
  const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

  // Then, make the request to the tools API endpoint
  const response = await fetch("/api/tools", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken, // Include the CSRF token in the request headers
    },
    body: JSON.stringify({
      action: "add-tool", // Action for 'add-tool' operation
      toolData: newTool,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create tool");
  }

  const respond = await response.json();
  return respond;
}
