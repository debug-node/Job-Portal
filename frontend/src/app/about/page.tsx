import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, Users } from "lucide-react";
import Image from "next/image";

const About = () => {
	return (
		<div className="min-h-screen">
			{/* Mission Section */}
			<section className="container mx-auto px-4 py-12 md:py-16">
				<div className="max-w-4xl mx-auto">
					{/* Image */}
					<div className="flex justify-center mb-8">
						<Image
							src="/about.jpg"
							className="w-full max-w-125 rounded-2xl shadow-lg"
							alt="About HireHeaven"
							width={1100}
							height={620}
						/>
					</div>

					{/* Content */}
					<div className="text-center space-y-6">
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
							Our Mission at Hire
							<span className="text-red-500">Heaven</span>
						</h1>

						<p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-3xl mx-auto">
							At HireHeaven, we are dedicated to revolutionizing the job
							search experience. Our mission is to create meaningful
							connections between talented individuals and forward-thinking
							companies, fostering growth and success for both.
						</p>

						<div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
							<div className="rounded-xl border bg-card p-4 shadow-sm">
								<div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
									<Briefcase size={18} className="text-blue-600" />
								</div>
								<h3 className="font-semibold mb-1">Smart Discovery</h3>
								<p className="text-sm opacity-70">
									Role-based search flow for candidates and recruiters.
								</p>
							</div>
							<div className="rounded-xl border bg-card p-4 shadow-sm">
								<div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
									<Users size={18} className="text-red-600" />
								</div>
								<h3 className="font-semibold mb-1">Better Matching</h3>
								<p className="text-sm opacity-70">
									Tools that help teams shortlist faster and candidates
									stand out.
								</p>
							</div>
							<div className="rounded-xl border bg-card p-4 shadow-sm">
								<div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
									<Building2 size={18} className="text-emerald-600" />
								</div>
								<h3 className="font-semibold mb-1">Growth Ready</h3>
								<p className="text-sm opacity-70">
									Built for startups and scale-ups hiring across India.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 md:py-20 bg-secondary/60 border-y">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center space-y-6">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
							Ready to find your dream job?
						</h2>
						<p className="text-lg md:text-xl opacity-80">
							Join thousands of successful job seekers on HireHeaven
						</p>
						<div className="pt-4">
							<Link href="/jobs">
								<Button size="lg" className="gap-2 h-12 px-8 text-base">
									Get Started
									<ArrowRight size={18} />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default About;
