import Link from "next/link";

import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <Link href="/admin/students">Students</Link>
                <Link href="/admin/institutions">Institutions</Link>
                <Link href="/admin/gowns">Gowns</Link>
            </aside>
            <main>{children}</main>
        </div>
    );
}
