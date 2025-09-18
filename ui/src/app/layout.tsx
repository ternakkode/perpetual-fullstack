import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@brother-terminal/components/ui/sonner";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});


const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Coming Soon - Brother Terminal",
  description: "Revolutionary AI-powered trading terminal on Hyperliquid. Advanced DCA strategies, volume/OI triggers, TWAP execution, and automated risk management. Coming soon - join our beta waitlist.",
  keywords: [
    "Brother Terminal",
    "Hyperliquid trading",
    "AI trading terminal",
    "DCA automation",
    "volume triggers",
    "OI triggers", 
    "TWAP execution",
    "crypto trading bot",
    "automated trading",
    "trading platform",
    "risk management",
    "beta access",
    "coming soon"
  ],
  authors: [{ name: "Brother Terminal Team" }],
  creator: "Brother Terminal",
  publisher: "Brother Terminal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brotherterminal.app",
    title: "Coming Soon - Brother Terminal",
    description: "Revolutionary AI-powered trading terminal on Hyperliquid. Advanced automation, intelligent execution, and risk management tools. Join our beta waitlist.",
    siteName: "Brother Terminal",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Brother Terminal - Coming Soon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coming Soon - Brother Terminal",
    description: "Revolutionary AI-powered trading terminal on Hyperliquid. Advanced automation and intelligent execution tools.",
    images: ["/icon.png"],
    creator: "@BrotherTerminal",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#f0ff00",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Brother Terminal" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4514SHD19L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4514SHD19L');
          `}
        </Script>
      </head>
      <body
        className={`${GeistSans.variable} ${spaceMono.variable} ${inter.variable} antialiased text-sm text-foreground bg-background`}
      >
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
