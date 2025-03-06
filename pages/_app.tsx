import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../context/CartContext"; 
import StudentLayout from "../components/Layout"; 
import AdminLayout from "../components/admin/Layout"; 
import "../app/globals.css"; 

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const role = session?.user?.role;

  return (
    <SessionProvider session={session}>
      {role === 'ADMIN' || role === 'INSTITUTION_ADMIN' ? (
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
