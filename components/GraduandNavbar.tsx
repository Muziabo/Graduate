import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function GraduandNavbar() {
    const { pathname } = useRouter();

    const linkStyle = (path: string) =>
        pathname === path
            ? "text-blue-500 font-bold"
            : "text-gray-800 hover:text-blue-500";

    return (
        <nav>
            <Link href="/pages/student">
                <a className={linkStyle("/student")}>Dashboard</a>
            </Link>
            <Link href="/pages/student/search">
                <a className={linkStyle("/student/search")}>Search Gowns</a>
            </Link>
            <Link href="/pages/student/history">
                <a className={linkStyle("/student/history")}>Order History</a>
            </Link>
        </nav>
    );
}