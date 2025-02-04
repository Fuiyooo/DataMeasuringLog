import { getCsrfToken } from "next-auth/react";

export default async function getItems() {
  // First, fetch CSRF token
  const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

  const response = await fetch("/api/items?action=get-items", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken, // Include the CSRF token in the request headers
    },
  });

  const items = await response.json();
  return items;
}
