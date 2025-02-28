"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";

export default function CartPage() {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="p-8">Loading cart...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty. <Link href="/">Go back to shopping</Link></p>
        ) : (
          <>
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="border p-2 mb-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p>Size: {item.size}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: K{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-2 py-0.5 rounded text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 mt-3">
              <button onClick={clearCart} className="bg-gray-800 text-white px-4 py-2 rounded">
                Clear Cart
              </button>
              <button 
                onClick={() => window.location.href = '/checkout'}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}