import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontVariables } from "@/app/_lib/fonts";
import { ThemeProvider } from "@/app/_lib/utils/themeContext";
import ResponsiveLayout from "@/app/_components/ResponsiveLayout";
import StructuredData from "@/app/_components/StructuredData";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import "@/app/_lib/styles/main.css";

export const metadata: Metadata = {
    title: {
        default: dataConfig.site_name,
        template: `%s | ${dataConfig.site_name}`,
    },
    description: dataConfig.site_description,
    keywords: dataConfig.keywords,
    authors: [
        {
            name: dataConfig.author_name,
            url: dataConfig.site_url,
        },
    ],
    creator: dataConfig.author_name,
    publisher: dataConfig.author_name,
    metadataBase: new URL(dataConfig.site_url),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: dataConfig.site_url,
        title: dataConfig.site_name,
        description: dataConfig.site_description,
        siteName: dataConfig.site_name,
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: `${dataConfig.site_name} - ${dataConfig.site_description}`,
            },
        ],
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
    verification: {
        google: "TODO",
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: dataConfig.site_name,
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="dracula">
            <head>
                <StructuredData type="website" />
            </head>
            <body className={`${fontVariables}`}>
                <ThemeProvider>
                    <ResponsiveLayout>{children}</ResponsiveLayout>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
