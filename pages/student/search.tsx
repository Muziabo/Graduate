import React, { useState, useEffect } from "react";
import { Gown } from "@/types";

export default function SearchGowns() {
    const [gowns, setGowns] = useState<Gown[]>([]);

    useEffect(() => {
        fetch("/api/gowns")
            .then((res) => res.json())
            .then((data) => setGowns(data));
    }, []);

    return (
        <div>
            <h1>Search for Graduation Gowns</h1>
            <ul>
                {gowns.map((gown) => (
                    <li key={gown.id}>
                        {gown.name} - {gown.size} - {gown.color} - ${gown.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}