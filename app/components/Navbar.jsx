"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";

const CurrentDate = lazy(() => import("./smallcomponents/CurrentDate"));

function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="text-gray-600 text-xl">
      Time: {time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Gunakan format 24 jam 
      })}
    </div>
  );
}

function Navbar({ toggleSidebar, activePage }) {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <button
        className="text-2xl text-gray-800 focus:outline-none"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <h1 className="text-gray-900 text-xl font-bold pointer-events-none">
        {activePage}
      </h1>
      <div className="flex items-center space-x-4 text-2xl">
        <div className="flex items-center space-x-2">
          <CurrentTime />
        </div>
        <div className="flex items-center space-x-2">
          <span>Date:</span>
          <Suspense fallback={<div>Loading Date...</div>}>
            <CurrentDate />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
