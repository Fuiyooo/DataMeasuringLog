"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, getSession } from "next-auth/react";
import AdminSettings from "./adminSettings"; // Import komponen AdminSettings

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState(""); // State untuk menyimpan nama user
  const [view, setView] = useState("dashboard"); // State untuk mengatur tampilan
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

  // Ambil data user saat komponen pertama kali di-render
  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession(); // Ambil sesi pengguna
      if (session && session.user) {
        setUserName(session.user.name || "User"); // Set nama user dari sesi
      }
    };

    fetchUser();
  }, []);

  const navigateTo = (path) => {
    if (path === "adminSettings") {
      setView("adminSettings"); // Navigasi internal ke AdminSettings
    } else {
      router.push(path); // Navigasi eksternal ke URL lain
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
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
          <button
            onClick={() => navigateTo("/parameter")}
            className="p-4 text-left hover:bg-gray-700"
          >
            Parameter
          </button>
          <button
            onClick={() => navigateTo("/manageOperator")}
            className="p-4 text-left hover:bg-gray-700"
          >
            Manage Operator
          </button>
          <button
            onClick={() => navigateTo("adminSettings")}
            className="p-4 text-left hover:bg-gray-700"
          >
            Admin Settings
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-4 text-left hover:bg-gray-700"
          >
            Log Out
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <button
            className="text-2xl text-gray-800 focus:outline-none"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <h1 className="text-gray-900 text-xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">{currentDate}</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col items-center justify-start mt-10">
          {view === "adminSettings" ? (
            <AdminSettings onBack={() => setView("dashboard")} /> // Tampilkan AdminSettings jika state view == "adminSettings"
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Welcome {userName} to Admin Dashboard
                </h2>
              </div>
              <div className="flex flex-col gap-6 w-80">
                <button
                  onClick={() => navigateTo("/parameter")}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded text-lg"
                >
                  Parameter
                </button>
                <button
                  onClick={() => navigateTo("/manageOperator")}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
