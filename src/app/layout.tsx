import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { WipScreen } from "@/components/wip-screen";
import { headers } from "next/headers";
import { HOTEL_CONFIG, SEO_CONFIG, TECHNICAL_CONFIG } from "@/hotel-config";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.baseUrl),
  title: SEO_CONFIG.home.de.title,
  description: SEO_CONFIG.home.de.description,
  keywords: SEO_CONFIG.keywords,
  authors: [{ name: HOTEL_CONFIG.name }],
  openGraph: {
    type: "website",
    locale: SEO_CONFIG.home.de.ogLocale,
    url: SEO_CONFIG.baseUrl,
    title: SEO_CONFIG.home.de.ogTitle,
    description: SEO_CONFIG.home.de.ogDescription,
    siteName: HOTEL_CONFIG.name,
    images: [
      {
        url: SEO_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${HOTEL_CONFIG.name} Südtirol`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.home.de.ogTitle,
    description: SEO_CONFIG.home.de.ogDescription,
    images: [SEO_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "de";

  return (
    <html lang={locale} className="">
      <head>
        {/* Google Tag Manager */}
        {TECHNICAL_CONFIG.analytics.gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${TECHNICAL_CONFIG.analytics.gtmId}');`,
            }}
          />
        )}
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${montserrat.variable} font-body text-foreground bg-background antialiased`}
      >
        {TECHNICAL_CONFIG.analytics.gtmId && (
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${TECHNICAL_CONFIG.analytics.gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        )}
        <WipScreen>{children}</WipScreen>
        <Analytics />
        {/* <ScriptsLoader /> */}
      </body>
    </html>
  );
}

// Trigger deployment
