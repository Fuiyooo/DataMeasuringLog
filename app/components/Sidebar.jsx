"use client";

import React from "react";
import ButtonNavigation from "./smallcomponents/ButtonNavigation";
import ButtonLogout from "./smallcomponents/ButtonLogout";

function Sidebar({ props, sidebarOpen, toggleSidebar, signOut, userRole }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <button
        className="text-lg p-4 focus:outline-none"
        onClick={toggleSidebar}
      >
        X
      </button>
      <nav className="flex flex-col mt-4">
        {userRole === "DEVELOPER" || userRole === "ADMIN" ? (
          <>
            <ButtonNavigation refLink={"parameter"} />
            <ButtonNavigation refLink={"manage-operator"} />
            <ButtonNavigation refLink={"admin-settings"} />
            <ButtonNavigation refLink={"manage-tools"} />
          </>
        ) : (
          <></>
        )}

        <ButtonNavigation refLink={"measurement"} />
        <ButtonNavigation refLink={"history"} />

        <ButtonLogout signOut={signOut} />
      </nav>
    </div>
  );
}

export default Sidebar;
