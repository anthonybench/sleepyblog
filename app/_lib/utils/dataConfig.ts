/**
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
  resume_url: "https://sleepysoft-global-fileserver.s3.us-west-2.amazonaws.com/Isaac_Yep_Resume.pdf",
  github_source_url: "https://github.com/anthonybench/sleepyblog",
  linkedin_url: "https://www.linkedin.com/in/anthonybench/",
  github_url: "https://github.com/anthonybench",
  duolingo_url: "https://duolingo.com/profile/thesleepyboy",
  pypi_url: "https://pypi.org/user/sleepyboy",
  dockerhub_url: "https://hub.docker.com/u/sleepyboy",
  default_theme: "dracula",
  last_updated: "Oct 3, 2025",
  site_name: "SleepyBlog",
  site_description: "A blog most sleepy.",
  site_url: "https://sleepyblog.org",
  author_name: "Isaac Yep",
  author_bio: "Lifelong engineer, professional kid.",
  author_image: "/dark/sleepyboy_technologist.png",
  keywords: ["blog","software development","land development","building","technology"]
};