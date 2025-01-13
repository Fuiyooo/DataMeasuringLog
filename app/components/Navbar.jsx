"use client";

import React, { Suspense, lazy } from "react";

const CurrentDate = lazy(() => import("./smallcomponents/CurrentDate"));

function Navbar({ toggleSidebar, activePage }) {
  // Update current date on component mount

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
      <Suspense fallback={<div>Loading Date...</div>}>
        <CurrentDate />
      </Suspense>
    </header>
  );
}

export default Navbar;
