"use client";  // Mark this as a Client Component

import { SessionProvider } from "next-auth/react";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
