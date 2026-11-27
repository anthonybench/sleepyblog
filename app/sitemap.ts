import type { MetadataRoute } from "next";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import { getAllProjects } from "@/app/_lib/utils/projects";

/**
 * /sitemap.xml: the pages search engines may crawl. Keep it in step with
 * app/robots.txt; pages disallowed there (posts, /test) are left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const pages: MetadataRoute.Sitemap = [
        { url: dataConfig.site_url, changeFrequency: "weekly", priority: 1 },
        { url: `${dataConfig.site_url}/about`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${dataConfig.site_url}/software`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${dataConfig.site_url}/furniture`, changeFrequency: "monthly", priority: 0.8 },
    ];

    const projects: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
        url: `${dataConfig.site_url}/software/${project.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    return [...pages, ...projects];
}
