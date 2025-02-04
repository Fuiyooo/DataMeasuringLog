import { getCsrfToken } from "next-auth/react";

export default async function getOperators() {
  const csrfToken = await getCsrfToken();

  // Add action as query parameter
  const response = await fetch("/api/operators?action=read", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken,
    },
  });

  const operators = await response.json();
  return operators;
}
