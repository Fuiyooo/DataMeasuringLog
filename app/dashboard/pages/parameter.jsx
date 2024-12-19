"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, getSession } from "next-auth/react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState(""); // State untuk menyimpan nama user
  const [showPopup, setShowPopup] = useState(false); // State untuk popup konfirmasi
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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

  const handleSave = () => {
    setShowPopup(true); // Tampilkan popup konfirmasi
  };

  const confirmSave = () => {
    setShowPopup(false);
    // Logika untuk menyimpan password baru bisa ditambahkan di sini
    console.log("Password changed: ", { oldPassword, newPassword });
    setOldPassword("");
    setNewPassword("");
  };

  const cancelSave = () => {
    setShowPopup(false); // Tutup popup tanpa menyimpan
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
            onClick={() => router.push("/parameter")}
            className="p-4 text-left hover:bg-gray-700"
          >
            Parameter
          </button>
          <button 
            onClick={() => router.push("/manageOperator")}
            className="p-4 text-left hover:bg-gray-700"
          >
            Manage Operator
          </button>
          <button 
            onClick={() => router.push("/adminSettings")}
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
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Change Password</h2>
          </div>
          <div className="w-80 flex flex-col gap-4">
            <label className="text-gray-700">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-2 border rounded bg-gray-200"
            />

            <label className="text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border rounded bg-gray-200"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setOldPassword("");
                  setNewPassword("");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-lg">Are you sure want to save?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmSave}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={cancelSave}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}