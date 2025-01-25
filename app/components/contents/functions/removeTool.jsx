import { getCsrfToken } from "next-auth/react";

export default async function removeTool(tool) {
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
      action: "delete-tool", // Action for 'delete-tool' operation
      toolData: tool,
    }),
  });

  const respond = await response.json();
  return respond;
}
