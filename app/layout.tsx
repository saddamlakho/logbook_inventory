import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Inventory Logbook System",
  description: "Logbook Stock & Inventory ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="antialiased">
        {user && <Navbar user={user} />}
        <main className={user ? "ml-64 min-h-screen print-ml-0" : "min-h-screen"}>
          {children}
        </main>
      </body>
    </html>
  );
}
