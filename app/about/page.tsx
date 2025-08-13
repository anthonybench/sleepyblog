"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import { useTheme } from "../_lib/utils/themeContext";
import { dataConfig } from "../_lib/utils/dataConfig";
import ResumeModal from "../_components/ResumeModal";
import StructuredData from "../_components/StructuredData";

/**
 * About page showcasing profile, bio, skills, and social links
 */
export default function AboutPage(): JSX.Element {
    const { current_theme } = useTheme();
    const image_path = current_theme.type === "dark" ? "/dark" : "/light";
    const [is_resume_modal_open, setIsResumeModalOpen] = useState(false);

    const scaleFactor = 1.35;

    return (
        <>
            <StructuredData type="profile" />
            <div className="about-page">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="about-profile">
                        <div className="profile-image-container">
                            <Image
                                src={`/static/portrait.png`}
                                alt="Isaac Yep - SleepyBoy Technologist"
                                width={200}
                                height={200}
                                priority
                                className="profile-image"
                            />
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">Isaac Yep</h1>
                            <p className="profile-title">Human who builds things</p>
                            <button
                                className="resume-button"
                                onClick={() => setIsResumeModalOpen(true)}
                                type="button"
                            >
                                View Resume
                            </button>
                        </div>
                    </div>
                </section>

                {/* Bio Section */}
                <section className="about-bio">
                    <h2>Hi, I&apos;m Isaac 👋</h2>
                    <div className="bio-content">
                        <p>
                            I live at the intersection of dev-ops & data.
                            <br />
                            I deeply admire simplicity.
                            <br />
                            An Alaskan who loves the pacific northwest.
                            <br />
                            Passionate woodworker, skateboarder, and shredder of beat saber.
                            <br />
                            <br />
                            Life long engineer, professional kid.
                        </p>
                    </div>
                </section>

                {/* Social Links Section */}
                <section className="about-social">
                    <h2>Connect With Me</h2>

                    <div className="social-section">
                        {/* Special LinkedIn Badge */}
                        <div className="linkedin-badge-container">
                            <Link
                                href={dataConfig.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="linkedin-badge"
                            >
                                <Image
                                    src={`${image_path}/linkedin_badge.png`}
                                    alt="Connect with Isaac Yep on LinkedIn"
                                    width={284 * scaleFactor}
                                    height={244 * scaleFactor}
                                    className="linkedin-badge-image"
                                />
                            </Link>
                        </div>

                        {/* Other Social Links */}
                        <div className="social-links">
                            <Link
                                href={dataConfig.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                            >
                                <Image
                                    src={`${image_path}/github.png`}
                                    alt="GitHub"
                                    width={40}
                                    height={40}
                                />
                                <span>GitHub</span>
                            </Link>

                            <Link
                                href={dataConfig.pypi_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                            >
                                <Image src="/static/pypi.png" alt="PyPI" width={40} height={40} />
                                <span>PyPI</span>
                            </Link>

                            <Link
                                href={dataConfig.dockerhub_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                            >
                                <Image
                                    src="/static/docker.png"
                                    alt="Docker Hub"
                                    width={40}
                                    height={40}
                                />
                                <span>Docker Hub</span>
                            </Link>

                            <Link
                                href={dataConfig.duolingo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                            >
                                <Image
                                    src="/static/duolingo.svg"
                                    alt="Duolingo"
                                    width={40}
                                    height={40}
                                />
                                <span>Duolingo</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Resume Modal */}
                <ResumeModal
                    is_open={is_resume_modal_open}
                    onClose={() => setIsResumeModalOpen(false)}
                    resume_url={dataConfig.resume_url}
                />
            </div>
        </>
    );
}
