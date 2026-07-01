import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import LoadingScreen from "@/components/n10k/LoadingScreen";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_OG_DESCRIPTION,
  SITE_OG_IMAGE,
  SITE_URL,
} from "@/lib/site-config";
import {
  getOrganizationJsonLd,
  getWebSiteJsonLd,
  getItemListJsonLd,
} from "@/lib/structured-data";

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  authors: [{ name: "Nutrition 10K" }],
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/brand/favicon.png",
  },
  other: {
    "font-display": "swap",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_OG_DESCRIPTION,
    type: "website",
    url: "/",
    locale: SITE_LOCALE,
    siteName: "Nutrition 10K",
    images: [
      {
        url: SITE_OG_IMAGE,
        alt: "Nutrition 10K — Weight Loss Partners",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_OG_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
};

const structuredData = [
  getOrganizationJsonLd(),
  getWebSiteJsonLd(),
  getItemListJsonLd(),
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#E30613" />
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <LoadingScreen />
        {children}
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </body>
    </html>
  );
}
