"use client";

export default function Footer() {
    return (
        <footer className="bg-cyan-950 text-white text-center py-4 mt-auto">
            {/* Footer Content */}
            <p className="text-sm">Copyright © {new Date().getFullYear()} - All right reserved by Integrated Business Solutions (IBS)</p>
        </footer>
    );
}