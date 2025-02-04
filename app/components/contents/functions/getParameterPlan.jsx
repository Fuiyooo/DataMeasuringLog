import { getCsrfToken } from "next-auth/react";

export default async function getParameterPlan(barcodeId) {
  const csrfToken = await getCsrfToken(); // Retrieve the CSRF token

  const response = await fetch(
    `/api/items?action=get-params&barcodeId=${barcodeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken, // Include the CSRF token in the request headers
      },
    }
  );

  const params = await response.json();
  return params;
}
