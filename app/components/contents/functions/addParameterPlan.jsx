import { getCsrfToken } from "next-auth/react";

export default async function addParameterPlan(data) {
  // First, fetch CSRF token
  const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

  const formData = new FormData();

  formData.append("image", data.imageUrl);

  formData.append("action", "add-parameter");
  formData.append("data", JSON.stringify(data));

  // Then, make the request to the parameters API endpoint
  const response = await fetch("/api/parameters", {
    method: "POST",
    headers: {
      "csrf-token": csrfToken, // Include the CSRF token in the request headers
    },
    body: formData,
  });

  const responseData = await response.json();
  return responseData;
}
