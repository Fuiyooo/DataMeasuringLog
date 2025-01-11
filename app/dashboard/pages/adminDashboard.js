import AdminDashboard from "../dashboard/components/AdminDashboard";
import { useRouter } from "next/router";

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <AdminDashboard router={router} />
  );
}
