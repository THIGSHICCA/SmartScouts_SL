import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { LangProvider } from '@/context/LangContext';

const inter = Inter({ subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "Smart Scouts SL",
  description: "Scout Progress Tracking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <LangProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
