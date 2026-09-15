import type { Metadata, Viewport } from "next";
import { Prata, Playfair_Display, Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

// Prata ships no latin-ext, so Azerbaijani ə/ğ/ş fall through to Playfair —
// which is exactly why Playfair sits next in the --font-display stack.
const prata = Prata({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-prata",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://byvivelle.com"),
  title: {
    default: "byvivelle — Personal journals made from your memories",
    template: "%s · byvivelle",
  },
  description:
    "byvivelle turns your photographs and memories into a personal printed magazine. Wedding, birthday and love editions, handmade in Baku and delivered worldwide.",
  keywords: [
    "personal magazine",
    "photo journal",
    "wedding journal",
    "birthday edition",
    "memory book",
    "Baku",
    "byvivelle",
  ],
  openGraph: {
    type: "website",
    title: "byvivelle — Stories that stay with you",
    description:
      "Personal printed magazines made from your photographs and memories. Handmade in Baku, delivered worldwide.",
    images: ["/media/wedding-cover.jpg"],
  },
  icons: {
    icon: "/media/logo.png",
    apple: "/media/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf6f0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${prata.variable} ${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Scroll reveals start at opacity 0 via inline style. With scripting
            off nothing ever reveals them, so the copy would simply be gone —
            unhide them up front in that case. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain antialiased">
        <LanguageProvider>
          <SmoothScroll />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
