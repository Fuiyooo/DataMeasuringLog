import { getCsrfToken } from "next-auth/react";

export default async function updateTool(editTool) {
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
      action: "edit-tool", // Action for 'edit-tool' operation
      toolData: editTool,
    }),
  });

  const tool = await response.json();
  return tool;
}
