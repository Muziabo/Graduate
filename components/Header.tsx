"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { HelpCircleIcon, LogOut, Settings, ShoppingCart, User, User2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { cart } = useCart();
  const { data: session } = useSession();
  const [itemCount, setItemCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setItemCount(cart?.reduce((total, item) => total + item.quantity, 0) || 0);
  }, [cart]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  // Get the student's name from the session
  const studentName = session?.user?.name || "Profile";

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
            <div className="absolute right-0 mt-3 min-w-[14rem] rounded-md bg-white shadow-lg border border-gray-200 opacity-0 scale-95 transform transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 z-50">
              <div className="py-2 px-4 border-b text-gray-800">My Account</div>
                <p className="flex items-center w-full px-4 py-3 text-left text-black bg-gray-50 active:bg-gray-200 transition-all">
                  Hi &nbsp; <h6 className="font-bold" > {studentName} </h6> 
                </p>
              <Link href="/settings">
                <button className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-all">
                  <Settings size={20} className="mr-2" />
                  Settings
                </button>
              </Link>
              <Link href="/help">
                <button className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-all">
                  <HelpCircleIcon size={20} className="mr-2" />
                  Help
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-left text-red-700 hover:bg-red-50 active:bg-gray-200 transition-all"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


