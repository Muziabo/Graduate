"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const { cart } = useCart();
  const { data: session } = useSession();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(cart?.reduce((total, item) => total + item.quantity, 0) || 0);
  }, [cart]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between bg-cyan-950 px-6 py-4 shadow-lg relative">
      {/* Logo */}
      <div className="text-2xl font-semibold text-white">
        <Link href="/">MiDay</Link>
      </div>

      {/* Cart & User */}
      <nav className="flex items-center space-x-6">
        {/* Cart */}
        <Link href="/cart" className="relative flex items-center text-white hover:text-gray-300">
          <ShoppingCart size={24} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>

        {/* User Dropdown */}
        {session && (
          <div className="relative group">
            <button className="flex items-center space-x-2 text-white hover:text-gray-300">
              <User size={24} />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-3 min-w-[12rem] rounded-lg bg-white shadow-md border border-gray-200 opacity-0 scale-95 transform transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 z-50">
              <div className="p-4 border-b text-gray-800">{session.user.email}</div>
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
