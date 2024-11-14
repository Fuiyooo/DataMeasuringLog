
"use client"; // Menjadikan file ini sebagai komponen klien

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Buat interval untuk mengupdate nilai progress secara bertahap
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          // Redirect ke login
          router.push('/login');
          return 100;
        }
        return oldProgress + 3; // Progress Loading Bar
      });
    }, 50); // Interval 50ms

    // Hapus interval ketika komponen di-unmount
    return () => clearInterval(interval);
  }, [router]);

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
