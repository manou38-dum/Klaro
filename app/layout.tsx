import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klaro — Analyse comportementale",
  description: "Décrivez une situation concrète. Obtenez une analyse comportementale.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr">
        <body className="antialiased bg-slate-50 min-h-screen overscroll-none">
          <div className="min-h-screen w-full max-w-2xl mx-auto bg-white sm:shadow-xl sm:my-4 sm:rounded-3xl overflow-hidden">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
