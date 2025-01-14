"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Create an interval to update the progress value
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval); // Clear the interval
          return 100;
        }
        return oldProgress + 3; // Increment progress
      });
    }, 50); // Update every 50ms

    // Redirect to login page after progress reaches 100%
    if (progress >= 100) {
      router.push("/login");
    }

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [progress, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Data Measuring Logger</h1>
      <p className="text-lg text-gray-400 mb-8">
        By PT Sannin Kreasi Indonesia
      </p>
      <div className="w-full max-w-md h-2 bg-gray-700 rounded">
        <div
          className="h-full bg-blue-500 rounded transition-all duration-75"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-4 text-sm text-gray-400">Loading... {progress}%</p>

      {/* Placeholder untuk logo perusahaan lain */}
      <div className="absolute bottom-20 flex items-center justify-center">
        <div className="w-48 h-24 bg-gray-800 rounded flex items-center justify-center border border-gray-700">
          <p className="text-sm text-gray-500">Logo</p>
        </div>
      </div>
    </div>
  );
}
