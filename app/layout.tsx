import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}


/*
import { Cal_Sans } from "next/font/google";
import "./globals.css";  // Make sure your global styles are here


// Import Cal Sans font
const calSans = Cal_Sans({
  variable: "--font-cal-sans",
  subsets: ["latin"], // Include the subset you need
});

export const metadata: Metadata = {
  title: "Envision | The Magic Eye",
  description: "This is an AI power app that helps blind users",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${calSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}*/