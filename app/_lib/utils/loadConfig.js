// Build-time script to load data.yml and generate TypeScript config
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const https = require("https");

/**
 * Extract GitHub repo info from a GitHub URL
 * @param {string} githubUrl - The GitHub URL
 * @returns {object|null} - {owner, repo} or null if invalid
 */
function parseGitHubUrl(githubUrl) {
    try {
        const url = new URL(githubUrl);
        if (url.hostname !== "github.com") return null;

        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length < 2) return null;

        return {
            owner: pathParts[0],
            repo: pathParts[1],
        };
    } catch {
        return null;
    }
}

/**
 * Fetch the last commit date from GitHub API
 * @param {string} owner - GitHub username
 * @param {string} repo - Repository name
 * @returns {Promise<string>} - Formatted date string
 */
function fetchLastCommitDate(owner, repo) {
    return new Promise((resolve) => {
        const options = {
            hostname: "api.github.com",
            path: `/repos/${owner}/${repo}/commits?per_page=1`,
            method: "GET",
            headers: {
                "User-Agent": "SleepyBlog-Build-Script",
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    if (res.statusCode === 200) {
                        const commits = JSON.parse(data);
                        if (commits && commits.length > 0) {
                            const commitDate = new Date(commits[0].commit.author.date);
                            resolve(
                                commitDate.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }),
                            );
                            return;
                        }
                    }
                } catch (error) {
                    console.warn("Failed to parse GitHub API response:", error.message);
                }
                // Fallback to current date
                resolve(
                    new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }),
                );
            });
        });

        req.on("error", (error) => {
            console.warn("Failed to fetch last commit date:", error.message);
            // Fallback to current date
            resolve(
                new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
            );
        });

        req.setTimeout(5000, () => {
            req.destroy();
            console.warn("GitHub API request timed out, using current date");
            resolve(
                new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
            );
        });

        req.end();
    });
}

async function loadAndGenerateConfig() {
    try {
        const configPath = path.join(__dirname, "../data.yml");
        const fileContents = fs.readFileSync(configPath, "utf8");
        const config = yaml.load(fileContents);

        // Extract GitHub repo info and fetch last commit date
        let lastUpdated = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        if (config.github_source_url) {
            const repoInfo = parseGitHubUrl(config.github_source_url);
            if (repoInfo) {
                console.log(`Fetching last commit date for ${repoInfo.owner}/${repoInfo.repo}...`);
                lastUpdated = await fetchLastCommitDate(repoInfo.owner, repoInfo.repo);
                console.log(`Last updated: ${lastUpdated}`);
            }
        }

        const tsContent = `/**
 * Configuration interface for data.yml
 */
export interface DataConfig {
  resume_url: string;
  github_source_url: string;
  linkedin_url: string;
  github_url: string;
  duolingo_url: string;
  pypi_url: string;
  dockerhub_url: string;
  default_theme: string;
  last_updated: string;
  site_name: string;
  site_description: string;
  site_url: string;
  author_name: string;
  author_bio: string;
  author_image: string;
  keywords: string[];
}

/**
 * Configuration values loaded from data.yml
 * These are set at build time and embedded into the application
 */
export const dataConfig: DataConfig = {
  resume_url: "${config.resume_url || "https://example.com/resume.pdf"}",
  github_source_url: "${config.github_source_url || "https://github.com/anthonybench/sleepyblog/blob/main/README.md"}",
  linkedin_url: "${config.linkedin_url || "https://www.linkedin.com/in/anthonybench/"}",
  github_url: "${config.github_url || "https://github.com/anthonybench"}",
  duolingo_url: "${config.duolingo_url || "https://duolingo.com/profile/thesleepyboy"}",
  pypi_url: "${config.pypi_url || "https://pypi.org/user/sleepyboy"}",
  dockerhub_url: "${config.dockerhub_url || "https://hub.docker.com/u/sleepyboy"}",
  default_theme: "${config.default_theme || "dracula"}",
  last_updated: "${lastUpdated}",
  site_name: "${config.site_name || "SleepyBlog"}",
  site_description: "${config.site_description || "Personal blog covering software development, land development, building projects, and occasional rants"}",
  site_url: "${config.site_url || "https://sleepyblog.com"}",
  author_name: "${config.author_name || "Isaac Yep"}",
  author_bio: "${config.author_bio || "Software developer, land developer, and maker building things that matter"}",
  author_image: "${config.author_image || "/light/sleepyboy_technologist.png"}",
  keywords: ${JSON.stringify(config.keywords || ["blog", "software development", "land development", "building", "technology"])}
};`;

        const outputPath = path.join(__dirname, "dataConfig.ts");
        fs.writeFileSync(outputPath, tsContent);
        console.log("✓ Generated dataConfig.ts from data.yml");
    } catch (error) {
        console.error("Failed to load data.yml:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    loadAndGenerateConfig().catch(console.error);
}

module.exports = { loadAndGenerateConfig };
