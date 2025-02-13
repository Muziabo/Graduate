"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart();

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link href="/">Go back to shopping</Link></p>
            ) : (
                <>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id} className="border p-2 mb-2 flex justify-between">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p>Size: {item.size}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={clearCart} className="bg-gray-800 text-white px-4 py-2 mt-3 rounded">
                        Clear Cart
                    </button>
                </>
            )}
        </div>
    );
}  