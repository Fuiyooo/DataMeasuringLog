import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function ButtonNavigation({ refLink }) {
  // Prepend "dashboard/" to the link path
  const fullPath = "/dashboard/" + refLink;

  const refCapitalize = refLink
    .split("-") // Split the string by "-"
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join words with a space

  return (
    <Link href={fullPath} className="p-4 text-left hover:bg-gray-700">
      {refCapitalize}
    </Link>
  );
}

export default ButtonNavigation;
