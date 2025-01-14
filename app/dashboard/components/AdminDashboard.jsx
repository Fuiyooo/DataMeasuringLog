"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, getSession } from "next-auth/react";
import NavbarSidebar from "../SidebarNavbar"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update current date on component mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session && session.user) {
        setUserName(session.user.name || "User");
      }
    };

    fetchUser();
  }, []);

  const navigateTo = (path) => {
    router.push(`/${path}`);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <div>

      </div>

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col items-center justify-start mt-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome {userName} to Admin Dashboard
            </h2>
          </div>
          <div className="flex flex-col gap-6 w-80">
            <button
              onClick={() => navigateTo("parameter")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded text-lg"
            >
              Parameter Settings
            </button>
            <button
              onClick={() => navigateTo("manageOperator")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded text-lg"
            >
              Manage Operator
            </button>
            <button
              onClick={() => navigateTo("adminSettings")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded text-lg"
            >
              Admin Settings
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded text-lg"
            >
              Log Out
            </button>
          </div>
        </main>
      </div>
    
  );
}
