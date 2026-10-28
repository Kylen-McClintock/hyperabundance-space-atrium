import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HyperAbundance — Community Space Atrium",
  description:
    "A walkable 3D orbital habitat and focus sanctuary connecting LEVL Longevity Lounge and AGI Futures Builder Club over Low Earth Orbit.",
  openGraph: {
    title: "HyperAbundance — Community Space Atrium",
    description:
      "Walkable 3D orbital co-working sanctuary, outward-protruding Earthview bubble pods, LEVL Longevity Lounge, and AGI Futures Builder Club.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <a href="#content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
