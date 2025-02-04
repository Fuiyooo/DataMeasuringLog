import { getCsrfToken } from "next-auth/react";

export default async function addItem(paramData, paramValues) {
  // First, fetch CSRF token
  const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

  const formData = new FormData();
  formData.append("action", "add-item");
  formData.append("data", JSON.stringify(paramData));
  formData.append("paramValues", JSON.stringify(paramValues.parameters));

  // Then, make the request to the tools API endpoint
  const response = await fetch("/api/items", {
    method: "POST",
    headers: {
      "csrf-token": csrfToken, // Include the CSRF token in the request headers
    },
    body: formData,
  });

  const respond = await response.json();
  return respond;
}
