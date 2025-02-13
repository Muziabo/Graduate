import dynamic from 'next/dynamic';

// Dynamically import React Admin and disable SSR
const AdminDashboard = dynamic(() => import('../../components/admin/AdminDashboard'), {
    ssr: false, // Disable server-side rendering for this page
});

export default function AdminPage() {
    return <AdminDashboard />;
}