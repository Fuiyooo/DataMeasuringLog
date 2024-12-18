"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      // Cek role untuk menentukan arah dashboard
      if (session?.user?.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (session?.user?.role === "OPERATOR") {
        router.push("/dashboard/operator");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res.error) {
      setError("Login gagal! Periksa kembali username dan password.");
    } else {
      // Redirect berdasarkan role setelah login
      if (session?.user?.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (session?.user?.role === "OPERATOR") {
        router.push("/dashboard/operator");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#222E43]">
      <div className="w-full max-w-sm p-8 space-y-6 bg-[#1B2B3C] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">WELCOME</h2>
        <p className="text-center text-white">Login to your account</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
