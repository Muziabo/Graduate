import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../context/CartContext"; // Ensure this path is correct
import StudentLayout from "../components/Layout"; // Use the existing Layout for students
import AdminLayout from "../components/admin/Layout"; // Use the existing Layout for admins
import "../app/globals.css"; // Ensure this path is correct

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const isAdmin = pageProps.session?.user?.role === "ADMIN";

  return (
    <SessionProvider session={session}>
      {isAdmin ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <CartProvider>
          <StudentLayout>
            <Component {...pageProps} />
          </StudentLayout>
        </CartProvider>
      )}
    </SessionProvider>
  );
}
