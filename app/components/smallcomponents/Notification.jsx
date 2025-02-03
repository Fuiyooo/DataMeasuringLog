import React, { useState, useEffect } from "react";

const Notification = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-md flex items-center justify-between ${getTypeStyles()}`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-lg font-bold focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
