import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A1 Chicken Center — Freshness You Can Trust",
  description: "Fresh, hygienic, custom-cut chicken and poultry delivered to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black-deep text-white-pure antialiased selection:bg-brand-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
