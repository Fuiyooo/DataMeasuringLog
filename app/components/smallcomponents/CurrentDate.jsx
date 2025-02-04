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

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-gray-600 text-xl">
      <div className="mb-2">
        <div className="text-gray-600 text-bold font-semibold">
          Date: {currentDate}
        </div>
      </div>
      <div className="font-semibold">
        Time:{" "}
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Gunakan format 24 jam
        })}
      </div>
    </div>
  );
}

export default CurrentDate;
