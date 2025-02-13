import React from "react";
import { useRouter } from "next/router";
import { Users, GraduationCapIcon, SchoolIcon, ShoppingCartIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const Dashboard = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const cards = [
        {
            title: "Students",
            description: "Manage student records and details.",
            bgColor: "bg-green-50",
            icon: <Users className="text-purple-950 w-10 h-10" />,
            link: "/admin/students",
            roles: ["ADMIN", "INSTITUTION_ADMIN"],
        },
        {
            title: "Institutions",
            description: "Manage institutions and their details.",
            bgColor: "bg-blue-50",
            icon: <SchoolIcon className="text-blue-600 w-10 h-10" />,
            link: "/admin/institutions",
            roles: ["ADMIN"],
        },
        {
            title: "Available Gowns",
            description: "Manage gown inventory and orders.",
            bgColor: "bg-yellow-50",
            icon: <GraduationCapIcon className="text-yellow-600 w-10 h-10" />,
            link: "/admin/gowns",
            roles: ["ADMIN", "INSTITUTION_ADMIN"],
        },
        {
            title: "Total Orders",
            description: "Manage gown inventory and orders.",
            bgColor: "bg-yellow-50",
            icon: <ShoppingCartIcon className="text-pink-500 w-10 h-10" />,
            link: "/admin/orders",
            roles: ["ADMIN", "INSTITUTION_ADMIN"],
        },
    ];

    return (
        <div className="p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Admin Panel - Welcome, {session?.user.name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards
                    .filter((card) => card.roles.includes(session?.user.role ?? ""))
                    .map((card, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${card.bgColor}`}
                            onClick={() => router.push(card.link)}
                        >
                            <div className="flex items-center space-x-4">
                                {card.icon}
                                <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
                            </div>
                            <p className="mt-2 text-gray-600">{card.description}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Dashboard;