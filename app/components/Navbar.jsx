"use client";

import React, { Suspense, lazy } from "react";

const CurrentDate = lazy(() => import("./smallcomponents/CurrentDate"));

function Navbar({ toggleSidebar, activePage }) {
  return (
    <header className="flex items-center bg-white p-4 shadow w-full">
      {/* Left section (justify-start) */}
      <div className="flex flex-1 justify-start items-center">
        <button
          className="text-2xl text-gray-800 focus:outline-none"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      </div>

      {/* Center section (center) */}
      <div className="flex flex-1 justify-center items-center">
        <h1 className="text-gray-900 text-3xl font-bold pointer-events-none">
          {activePage}
        </h1>
      </div>

      {/* Right section (justify-end) */}
      <div className="flex flex-1 justify-end items-center space-x-4 text-2xl">
        <Suspense fallback={<div>Loading Date...</div>}>
          <CurrentDate />
        </Suspense>
      </div>
    </header>
  );
}

export default Navbar;
