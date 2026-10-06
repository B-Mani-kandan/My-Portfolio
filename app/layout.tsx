import type { Metadata, Viewport } from "next";
import { BracketCursor } from "@/components/ui/bracket-cursor";
// self-hosted fonts (no external requests)
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/archivo/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manikandan B — Software Developer & Full-Stack Engineer",
  description:
    "Full-stack developer building enterprise web apps, clean APIs and fast business websites with ASP.NET, C#, Angular and React.",
  openGraph: {
    title: "Manikandan B — Software Developer",
    description: "Enterprise web apps, APIs and business websites. ASP.NET · C# · Angular · React.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <BracketCursor />
      </body>
    </html>
  );
}
