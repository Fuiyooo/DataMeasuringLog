import { getCsrfToken } from "next-auth/react";

export default async function getOperators() {
  try {
    const csrfToken = await getCsrfToken();

    // Add action as query parameter
    const response = await fetch("/api/operators?action=read", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch operators");
    }

    const operators = await response.json();
    return operators;
  } catch (error) {
    console.error("Error fetching operators:", error);
    return [];
  }
}
