import React, { useState, useEffect } from "react";
import { Order } from "@/types";

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch("/api/orders/history")
            .then((res) => res.json())
            .then((data) => setOrders(data));
    }, []);

    return (
        <div>
            <h1>Your Order History</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        Gown: {order.gown?.name}, Type: {order.type}, Status: {order.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}