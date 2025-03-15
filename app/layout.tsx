import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Envision | The Magic Eye",
  description: "This is an AI power app that helps blind users",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased"> {/* Font is handled in globals.css */}
      {children}
      </body>
    </html>
  );
}

/*
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Envision | The Magic Eye",
  description: "This is an AI power app that helps blind users",
};

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
} */


