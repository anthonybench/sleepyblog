"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, JSX } from "react";
import { useTheme } from "@/app/_lib/utils/themeContext";
import { dataConfig } from "@/app/_lib/utils/dataConfig";
import ResumeModal from "@/app/_components/ResumeModal";
import StructuredData from "@/app/_components/StructuredData";

/**
 * About page showcasing profile, bio, skills, and social links
 */
export default function AboutPage(): JSX.Element {
    const { current_theme } = useTheme();
    const image_path = current_theme.type === "dark" ? "/dark" : "/light";
    const [is_resume_modal_open, setIsResumeModalOpen] = useState(false);

    const socialLinks = [
        { label: "GitHub", href: dataConfig.github_url, icon: `${image_path}/github.png` },
        { label: "PyPI", href: dataConfig.pypi_url, icon: "/static/pypi.png" },
        { label: "Docker Hub", href: dataConfig.dockerhub_url, icon: "/static/docker.png" },
        { label: "Duolingo", href: dataConfig.duolingo_url, icon: "/static/duolingo.svg" },
    ];

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
                            <p className="profile-title">I&apos;m compelled to build things</p>
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

                    {/* --social-link-count lets the CSS size the badge to match the cards */}
                    <div
                        className="social-section"
                        style={{ "--social-link-count": socialLinks.length } as CSSProperties}
                    >
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
                                    width={590}
                                    height={474}
                                    className="linkedin-badge-image"
                                />
                            </Link>
                        </div>

                        {/* Other Social Links */}
                        <div className="social-links">
                            {socialLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    <Image
                                        src={link.icon}
                                        alt={link.label}
                                        width={40}
                                        height={40}
                                    />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
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
