import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "familyplanner",
    template: "%s | familyplanner"
  },
  description: "Planera och organisera din familjs dagar tillsammans med familyplanner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-300 dark:bg-slate-900`}
      >
        <Providers>
          <div className="wrapper">
            <div className="bg-background my-4 rounded-2xl p-4 sm:p-8 min-h-[calc(100svh-2rem)] grid grid-rows-[1fr]">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
