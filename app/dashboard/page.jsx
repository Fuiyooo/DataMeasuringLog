"use client";

import OperatorDashboard from "./components/OperatorDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function Dashboard() {
    return(
    <div>
      <OperatorDashboard />
      <AdminDashboard />
    </div>
  );
}
