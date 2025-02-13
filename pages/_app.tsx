// _app.tsx
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"; // This is correct
import { CartProvider } from "@/context/CartContext"; 
import Layout from "../components/Layout"; // Your Layout component
import "@/app/globals.css";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}> {/* SessionProvider wraps the whole app */}
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </SessionProvider>
  );
}
