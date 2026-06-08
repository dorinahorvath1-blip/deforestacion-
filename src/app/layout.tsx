import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deforestation Awareness",
  description: "Learn about the causes and effects of deforestation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
