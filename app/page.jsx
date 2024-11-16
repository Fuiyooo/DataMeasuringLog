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
      <h1 className="text-4xl font-bold mb-8">Data Measuring Logger</h1>
      <div className="w-full max-w-md h-2 bg-gray-700 rounded">
        <div
          className="h-full bg-blue-500 rounded transition-all duration-75"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-4 text-sm text-gray-400">Loading... {progress}%</p>
    </div>
  );
}
