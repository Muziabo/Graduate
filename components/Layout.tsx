"use client";
import { CartProvider } from "@/context/CartContext";
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
                <CartProvider>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                    </div>
                </CartProvider>
    );
}