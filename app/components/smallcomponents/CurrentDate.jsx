"use client";

import React, { useEffect, useState } from "react";

function CurrentDate() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  return <p className="text-gray-500">{currentDate}</p>;
}

export default CurrentDate;
