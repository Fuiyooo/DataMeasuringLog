"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";

const CurrentDate = lazy(() => import("./smallcomponents/CurrentDate"));


function Navbar({ toggleSidebar, activePage }) {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <button
        className="text-2xl text-gray-800 focus:outline-none"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <h1 className="text-gray-900 text-3xl font-bold pointer-events-none">
        {activePage}
      </h1>
      <div className="flex items-center space-x-4 text-2xl">
        <div className="flex items-center space-x-2">
          <Suspense fallback={<div>Loading Date...</div>}>
            <CurrentDate />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default Navbar;