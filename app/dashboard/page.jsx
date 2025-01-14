"use client";

<<<<<<< HEAD
import OperatorDashboard from "./components/OperatorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { useSession, signOut } from "next-auth/react";
=======
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
>>>>>>> 4e741524a3352ffcd20b6b6f3fd1ec7088b2ae72

function page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      // Cek role untuk menentukan arah dashboard
      if (session?.role === "ADMIN" || session?.role === "DEVELOPER") {
        router.push("/dashboard/parameter");
      } else if (session?.role === "OPERATOR") {
        router.push("/dashboard/measurement");
      } else {
        router.push("/login");
      }
    }
<<<<<<< HEAD
  }

  return <div>Please log in</div>;
}
=======
  }, [status, session, router]);
  return (
    <div>
      <Layout contents={<div>Loading...</div>} />
    </div>
  );
}

export default page;
>>>>>>> 4e741524a3352ffcd20b6b6f3fd1ec7088b2ae72
