import type { Metadata } from "next";
import { dataConfig } from "@/app/_lib/utils/dataConfig";

export const metadata: Metadata = {
    title: "About",
    description: `Learn more about ${dataConfig.author_name} - ${dataConfig.author_bio}`,
    keywords: [...dataConfig.keywords, "about", "profile", "biography"],
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        type: "profile",
        locale: "en_US",
        url: `${dataConfig.site_url}/about`,
        title: `About ${dataConfig.author_name}`,
        description: dataConfig.author_bio,
        siteName: dataConfig.site_name,
        images: [
            {
                url: dataConfig.author_image,
                width: 400,
                height: 400,
                alt: `${dataConfig.author_name} - Profile Photo`,
            },
        ],
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
