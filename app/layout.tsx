import type { Metadata } from "next/types";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynapost",
  description: "Interactive design poster",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`inter antialiased`}>{children}</body>
    </html>
  );
}
