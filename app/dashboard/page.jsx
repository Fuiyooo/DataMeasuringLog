"use client";

import OperatorDashboard from "./pages/OperatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-screen flex flex-col bg-gray-100 justify-items-center">
        <p className="text-black text-center">Loading...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    if (session.role === "OPERATOR") {
      return (
        <div>
          <OperatorDashboard />
        </div>
      );
    } else if (session.role === "ADMIN") {
      return (
        <div>
          <AdminDashboard />
        </div>
      );
    } else {
      signOut();
      return <div>Unauthorized</div>;
    }
  }

  return <div>Please log in</div>;
}
