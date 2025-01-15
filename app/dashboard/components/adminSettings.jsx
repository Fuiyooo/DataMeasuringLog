"use client";

import { useState } from "react";
import checkPassword from "./action/checkPassword";
import changePasswordAdmin from "./action/changePasswordAdmin";

export default function AdminSettings({ onBack }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleSave = async () => {
    try {
      // Call checkPassword and wait for the result
      const isPasswordValid = await checkPassword(oldPassword);

      if (!isPasswordValid) {
        // Jika password lama salah (password invalid)
        setShowErrorPopup(true);
      } else {
        // Jika password lama benar (password valid)
        setShowConfirmPopup(true);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  const confirmSave = async () => {
    try {
      const passwordUpdate = changePasswordAdmin(newPassword);

      if (passwordUpdate) {
        // Simulasi update password
        setShowConfirmPopup(false);
        setOldPassword("");
        setNewPassword("");
      }
      // TODO: Notifikasi Berhasil + Error jika password tidak berhasil diupdate
    } catch (error) {
      console.error("Error in confirming: ", error);
    }
  };

  const cancelSave = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="max-h-screen flex flex-col items-center justify-start bg-gray-100 pt-10">
      <div className="bg-white p-8 rounded shadow-lg w-[400px]">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Change Password
        </h1>

        <label className="block mb-2 text-gray-900">Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded bg-gray-200 text-gray-900"
          placeholder="Enter Old Password"
        />

        <label className="block mb-2 text-gray-900">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded bg-gray-200 text-gray-900"
          placeholder="Enter New Password"
        />

        <div className="flex justify-between gap-4">
          <button
            onClick={() => onBack()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setOldPassword("");
                setNewPassword("");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Popup: Error Password */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#222E43] p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-lg font-bold text-red-600">
              Password Lama Salah!
            </p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Popup: Konfirmasi Save */}
      {showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#222E43] p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-lg font-bold">
              Are you sure you want to save?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={cancelSave}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
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
