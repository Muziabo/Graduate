import localFont from "next/font/local";
import "./globals.css";

const ibmPlexSans = localFont({
    src: [
        { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
        { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
        { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
        { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
    ],
});

const bebasNeue = localFont({
    src: [
        { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
    ],
    variable: "--bebas-neue",
});

export const metadata = {
    title: "MiDay",
    description: "Graduation Gown Buying & Hiring System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    );
}
