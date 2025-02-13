"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const { cart } = useCart();
    const { data: session, status } = useSession(); // Extract status to check loading

    if (status === "loading") {
        return <div>Loading...</div>; // Optional: show a loading state while session data is loading
    }

    return (
        <header className="flex justify-between items-center bg-cyan-950 p-4 shadow-xl">
            <div className="text-lg font-bold text-red-500">
                <Link href="/">MiDay</Link>
            </div>

            <nav className="relative flex items-center">
                <Link href="/cart" className="text-red-500 hover:underline flex items-center mr-4">
                    <ShoppingCart size={20} />
                    {cart.length > 0 && (
                        <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                            {cart.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    )}
                </Link>
                {session && (
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-red-500 hover:underline"
                    >
                        Logout
                    </button>
                )}
            </nav>
        </header>
    );
}
