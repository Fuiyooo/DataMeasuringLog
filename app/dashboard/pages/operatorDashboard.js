import OperatorDashboard from "../components/OperatorDashboard";
import { useRouter } from "next/router";

export default function OperatorDashboardPage(){

    const router = useRouter();

    return (
        <OperatorDashboard router={router} />
      );
}