"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, getSession } from "next-auth/react";
import Measurement from "./Measurement";
import ItemDataLog from "./ItemDataLog"; // Import komponen ItemDataLog

export default function OperatorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState(""); // State untuk nama user
  const [view, setView] = useState("dashboard");
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigateTo = (path) => {
    if (path === "dashboard") {
      setView("dashboard");
    } else if (path === "Measurement") {
      setView("Measurement");
    } else if (path === "ItemDataLog") {
      setView("ItemDataLog");
    } else {
      router.push(path); // Navigasi eksternal ke URL lain
    }
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

  // Ambil data user saat komponen di-render
  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession(); // Ambil sesi user
      if (session && session.user) {
        setUserName(session.user.name || "User"); // Simpan nama user
      }
    };

    fetchUser();
  }, []);

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
            onClick={() => navigateTo("dashboard")}
            className="p-4 text-left hover:bg-gray-700"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigateTo("Measurement")}
            className="p-4 text-left hover:bg-gray-700"
          >
            Measurement
          </button>
          <button
            onClick={() => navigateTo("ItemDataLog")}
            className="p-4 text-left hover:bg-gray-700"
          >
            Item Data Log
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
          <h1
            className="text-gray-900 text-xl font-bold cursor-pointer"
            onClick={() => navigateTo("dashboard")}
          >
            Operator Dashboard
          </h1>
          <p className="text-gray-500">{currentDate}</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col items-center justify-start mt-10">
          {view === "Measurement" ? (
            <Measurement onBack={() => setView("dashboard")} />
          ) : view === "ItemDataLog" ? (
            <ItemDataLog onBack={() => setView("dashboard")} />
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Welcome {userName} to Operator Dashboard
                </h2>
              </div>
              <div className="flex flex-col gap-6 w-80">
                <button
                  onClick={() => navigateTo("Measurement")}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded text-lg"
                >
                  Measurement
                </button>
                <button
                  onClick={() => navigateTo("ItemDataLog")}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded text-lg"
                >
                  Item Data Log
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
