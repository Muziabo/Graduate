"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <header className="flex items-center justify-between bg-cyan-950 px-6 py-4 shadow-lg relative">
      {/* Logo */}
      <div className="text-2xl font-semibold text-white">
        <Link href="/admin/dashboard">Admin Dashboard</Link>
      </div>

      {/* User Menu */}
      <nav className="flex items-center space-x-6">
        {session && (
          <div className="relative group">
            <button className="flex items-center space-x-2 text-white hover:text-gray-300">
              <User size={24} />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-3 min-w-[12rem] rounded-lg bg-white shadow-md border border-gray-200 opacity-0 scale-95 transform transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 z-50">
              <div className="p-4 border-b text-gray-800">
                <div>{session.user.email}</div>
                <div className="text-sm text-gray-600">{session.user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
