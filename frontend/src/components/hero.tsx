"use client";

import { ArrowRight, Briefcase, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useAppData } from "@/context/AppContext";
import Image from "next/image";

const Hero = () => {
	const { isAuth, user } = useAppData();

	const isRecruiter = isAuth && user?.role === "recruiter";
	const isJobSeeker = isAuth && user?.role === "jobseeker";

	const headingPrefix = isRecruiter
		? "Build Your Team Faster with "
		: "Find Your Dream Job at ";
	const badgeText = isRecruiter
		? "Built for Smart Hiring Teams"
		: "#1 Job Platform in India";

	const description = isRecruiter
		? "Create companies, post jobs, and manage candidate applications from one recruiter dashboard."
		: "Connect with top employers and discover opportunities that match your skills. Whether you're a job seeker or recruiter, we've got you covered with powerful tools and seamless experience.";

	const primaryCtaHref = isRecruiter ? "/account" : "/jobs";
	const primaryCtaLabel = isRecruiter ? "Open Recruiter Desk" : "Browse Jobs";

	const secondaryCtaHref = isJobSeeker ? "/account" : "/about";
	const secondaryCtaLabel = isJobSeeker ? "My Applications" : "Learn More";

	const stats = isRecruiter
		? [
				{ value: "3x", label: "Faster Shortlisting" },
				{ value: "5k+", label: "Active Recruiters" },
				{ value: "50k+", label: "Verified Profiles" },
			]
		: [
				{ value: "10k+", label: "Active Jobs" },
				{ value: "5k+", label: "Companies" },
				{ value: "50k+", label: "Job Seekers" },
			];

	const trustPoints = isRecruiter
		? ["Verified profiles", "Smart filtering", "Secure dashboard"]
		: ["Free to use", "Verified employers", "Secure platform"];

	return (
		<section className="relative overflow-hidden bg-secondary/50 border-b">
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
			</div>

			<div className="container mx-auto px-5 py-16 md:py-24 relative">
				<div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
					<div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
						{/* badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/20 backdrop-blur-sm shadow-sm border-blue-200 dark:border-blue-800">
							<TrendingUp size={16} className="text-blue-600" />
							<span className="text-sm font-medium text-blue-700 dark:text-blue-300">
								{badgeText}
							</span>
						</div>

						{/* Main heading */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
							{headingPrefix}
							<span className="inline-block">
								<span className="text-black dark:text-foreground text-[0.9em]">
									Hire
								</span>
								<span className="text-red-500 text-[1.1em]">Heaven</span>
							</span>
						</h1>

						{/* Description */}
						<p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl">
							{description}
						</p>
						{/* stats */}
						<div className="flex flex-wrap justify-center md:justify-start gap-8 py-4">
							{stats.map((item) => (
								<div
									className="text-center md:text-left"
									key={item.label}>
									<p className="text-3xl font-bold text-blue-600">
										{item.value}
									</p>
									<p className="text-sm opacity-70">{item.label}</p>
								</div>
							))}
						</div>

						<div className="flex flex-col sm:flex-row gap-4 pt-2">
							<Link href={primaryCtaHref}>
								<Button
									size={"lg"}
									className="text-base px-8 h-12 gap-2 group transition-all shadow-lg shadow-blue-500/15">
									<Search size={18} />
									{primaryCtaLabel}{" "}
									<ArrowRight
										size={18}
										className="group-hover:translate-x-1 transition-transform"
									/>
								</Button>
							</Link>
							<Link href={secondaryCtaHref}>
								<Button
									variant={"outline"}
									size={"lg"}
									className="text-base px-8 h-12 gap-2 bg-background/80">
									<Briefcase size={18} />
									{secondaryCtaLabel}
								</Button>
							</Link>
						</div>

						{/* trust indicator section */}
						<div className="flex items-center gap-2 text-sm opacity-60 pt-4 flex-wrap">
							<span>✔️ {trustPoints[0]}</span>
							<span>•</span>
							<span>✔️ {trustPoints[1]}</span>
							<span>•</span>
							<span>✔️ {trustPoints[2]}</span>
						</div>
					</div>

					{/* image section */}
					<div className="flex-1 relative">
						<div className="relative group">
							<div className="absolute -inset-4 bg-blue-400 opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>

							<div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
								<Image
									src="/hero.jpeg"
									className="object-cover object-center w-full h-full transform transition-transform duration-500 group-hover:scale-105"
									alt="HireHeaven job portal dashboard preview"
									width={900}
									height={700}
									priority
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
