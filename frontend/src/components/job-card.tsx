"use client";
import { useAppData } from "@/context/AppContext";
import { Job, Application } from "@/type";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ArrowRight, Briefcase, Building2, CheckCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

interface JobCardProps {
	job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
	const { user, btnLoading, applyJob, applications } = useAppData();

	const applyJobHandler = (id: number) => {
		applyJob(id);
	};

	const [applied, setApplied] = useState(false);

	useEffect(() => {
		if (applications && job.job_id) {
			applications.forEach((item: Application) => {
				if (item.job_id === job.job_id) setApplied(true);
			});
		}
	}, [applications, job.job_id]);

	return (
		<Card className="w-full max-w-95 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 group bg-card/80 backdrop-blur-sm">
			<CardHeader className="space-y-4 pb-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
							{job.title}
						</h3>
						<div className="flex items-center gap-2 text-sm opacity-70">
							<Building2 size={16} />
							<span>{job.company_name}</span>
						</div>
					</div>

					<Link href={`/company/${job.company_id}`} className="shrink-0">
						<div className="w-14 h-14 rounded-xl border-2 overflow-hidden hover:scale-105 transition-transform bg-background shadow-sm">
							<Image
								src={job.company_logo}
								alt={`${job.company_name} logo`}
								width={56}
								height={56}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>
					</Link>
				</div>

				<div className="space-y-2">
					<div className="flex items-center gap-2 text-sm">
						<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-950/20 text-blue-600 border border-blue-200 dark:border-blue-800">
							<span className="font-medium">{job.location}</span>
						</div>
					</div>

					<div className="flex items-center gap-2 text-base font-semibold">
						<DollarSign size={18} className="text-green-600" />
						<span>₹ {job.salary} P.A</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex flex-col gap-3 pt-4 border-t">
				<div className="flex w-full gap-2">
					<Link href={`/jobs/${job.job_id}`} className="flex-1">
						<Button variant={"outline"} className="w-full gap-2 group/btn">
							View Details{" "}
							<ArrowRight
								size={16}
								className="group-hover/btn:translate-x-1 transition-transform"
							/>
						</Button>
					</Link>

					{user && user.role === "jobseeker" && (
						<>
							{applied ? (
								<div className="flex-1 flex items-center justify-center gap-2 text-green-600 font-medium text-sm bg-green-100 dark:bg-green-900/30 rounded-md px-3 py-2">
									<CheckCircle size={15} />
									Applied
								</div>
							) : (
								<>
									{job.is_active !== false && (
										<Button
											disabled={btnLoading}
											onClick={() => applyJobHandler(job.job_id)}
											className="flex-1 gap-2">
											<Briefcase size={16} />
											Easy Apply
										</Button>
									)}
								</>
							)}
						</>
					)}
				</div>

				{job.is_active === false && (
					<div className="w-full text-center text-sm text-red-600 bg-red-100 dark:bg-red-900/30 rounded-md px-3 py-2 font-medium">
						Position Closed
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default JobCard;
