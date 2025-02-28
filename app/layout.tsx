'use client'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '../context/CartContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </CartProvider>
      </body>
    </html>
  )
}
