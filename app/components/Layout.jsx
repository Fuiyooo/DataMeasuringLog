"use client";

import React, { useState, useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ activePage, contents }) {
  const [userRole, setUserRole] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession(); // Ambil sesi user
      if (session && session.user) {
        setUserRole(session.role || ""); // Set user role
      }
    };

    fetchSession();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex-grow flex flex-col bg-gray-100 text-black">
      <Navbar toggleSidebar={toggleSidebar} activePage={activePage} />
      <Sidebar
        userRole={userRole}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        signOut={signOut}
      />
      <main className="flex justify-center mt-8 p-4">{contents}</main>
    </div>
  );
}

export default Layout;
