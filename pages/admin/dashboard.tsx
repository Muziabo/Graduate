// pages/admin/gowns.tsx
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("@/components/admin/AdminDashboard"), {
    ssr: false, // Disable SSR for this component
});

const DashboardPage = () => {
    return <AdminDashboard />;
};

export default DashboardPage;
