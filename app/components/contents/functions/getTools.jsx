import { getCsrfToken } from "next-auth/react";

export default async function getTools() {
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

  const tools = await response.json();
  return tools;
}
