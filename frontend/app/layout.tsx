import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css"; // Add Leaflet CSS

export const metadata: Metadata = {
  title: "RESQNET",
  description: "Disaster Management Webiste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>{children}</body>
    </html>
  );
}
