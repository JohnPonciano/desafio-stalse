'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-200 to-gray-300 border-b-3 border-black flex items-center justify-between px-4 z-50 shadow-md">
      <span className="font-bold text-sm tracking-wider text-gray-800">Mini Inbox - Ticket Manager</span>
      <div className="text-xs text-gray-600 font-mono" suppressHydrationWarning>
        {currentTime.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Mini Inbox - Ticket Manager</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <div className="flex min-h-screen pt-12">
          <Sidebar />
          <main className="flex-1 ml-64 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
