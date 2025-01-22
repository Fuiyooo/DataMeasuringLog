import { getCsrfToken } from "next-auth/react";

export default async function createOperator(newOperator) {
  try {
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
        action: "create", // Action for 'create' operation
        userData: newOperator,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create operator");
    }

    const operators = await response.json();
    return operators;
  } catch (error) {
    console.error("Error creating operator:", error);
    return [];
  }
}
