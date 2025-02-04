import { getCsrfToken } from "next-auth/react";

export default async function updateOperator(editOperator) {
  // First, fetch CSRF token
  const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

  // Then, make the request to the operators API endpoint
  const response = await fetch("/api/operators", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken, // Include the CSRF token in the request headers
    },
    body: JSON.stringify({
      action: "update", // Action for 'update' operation
      userData: editOperator,
    }),
  });

  const operators = await response.json();
  return operators;
}
