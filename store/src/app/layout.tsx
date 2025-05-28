import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-josefin-sans",
});

export const metadata: Metadata = {
  title: "B2B Marketplace",
  description: "B2B Marketplace for buying and selling products with ease",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Providers>
        <body className={josefinSans.className}>
          {children}
        </body>
      </Providers>
    </html>
  );
}
