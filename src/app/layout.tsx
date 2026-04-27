import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "LookEast",
  description: "News from the East",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-100 text-gray-900 flex flex-col min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
