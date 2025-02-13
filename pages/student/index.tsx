import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function GraduandDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
        // Protect the dashboard
        return <h1>Access Denied</h1>;
    }

    return (
        <div>
            <h1>Welcome to the Graduand Dashboard</h1>
            <p>Search for gowns, place orders, or view order history here.</p>
        </div>
    );
}