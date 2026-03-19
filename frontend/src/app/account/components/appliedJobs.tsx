"use client";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Application } from "@/type";
import {
	Briefcase,
	CheckCircle2,
	Clock,
	DollarSign,
	XCircle,
	ArrowRight,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface AppliedJobsProps {
	applications: Application[];
}

const ITEMS_PER_PAGE = 5;

const AppliedJobs: React.FC<AppliedJobsProps> = ({ applications }) => {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);

	const getStatusConfig = (status: string) => {
		switch (status.toLowerCase()) {
			case "hired":
				return {
					icon: CheckCircle2,
					color: "text-green-600",
					bg: "bg-green-100/50 dark:bg-green-900/20",
					border: "border-green-300 dark:border-green-700",
					badge: "bg-green-600 dark:bg-green-700 text-white",
				};
			case "rejected":
				return {
					icon: XCircle,
					color: "text-red-600",
					bg: "bg-red-100/50 dark:bg-red-900/20",
					border: "border-red-300 dark:border-red-700",
					badge: "bg-red-600 dark:bg-red-700 text-white",
				};
			default:
				return {
					icon: Clock,
					color: "text-amber-600",
					bg: "bg-amber-100/50 dark:bg-amber-900/20",
					border: "border-amber-300 dark:border-amber-700",
					badge: "bg-amber-600 dark:bg-amber-700 text-white",
				};
		}
	};

	const handleCardClick = (jobId: number) => {
		router.push(`/jobs/${jobId}`);
	};

	// Paginate applications
	const paginatedApplications = useMemo(() => {
		const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
		return applications.slice(startIdx, startIdx + ITEMS_PER_PAGE);
	}, [applications, currentPage]);

	const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);

	return (
		<div className="w-full">
			<Card className="shadow-lg border-2 overflow-hidden">
				<div className="bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6 border-b">
					<div className="flex items-center gap-3 mb-2">
						<div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
							<Briefcase size={20} className="text-white" />
						</div>
					</div>
					<h1 className="text-2xl font-bold">Your Applied Jobs</h1>
					<p className="text-sm opacity-90 font-medium mt-1">
						{applications.length} application
						{applications.length !== 1 ? "s" : ""} submitted
					</p>
				</div>

				<div className="p-6 space-y-3">
					{applications && applications.length > 0 ? (
						<>
							<div className="space-y-3">
								{paginatedApplications.map((a) => {
									const statusConfig = getStatusConfig(a.status);
									const StatusIcon = statusConfig.icon;

									return (
										<div
											key={a.application_id}
											onClick={() => handleCardClick(a.job_id)}
											className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 ${statusConfig.bg} ${statusConfig.border} hover:border-blue-400 dark:hover:border-blue-500`}>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
													<h3 className="text-lg font-semibold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
														{a.job_title}
													</h3>

													<div className="flex flex-wrap gap-3 items-center">
														<div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-700">
															<DollarSign size={14} />
															<span>
																₹{" "}
																{a.job_salary?.toLocaleString()}
															</span>
														</div>

														<div
															className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm text-white ${statusConfig.badge} border border-current/20`}>
															<StatusIcon size={14} />
															<span>{a.status}</span>
														</div>
													</div>
												</div>

												<div className="shrink-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
													<div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600 transition-all duration-300">
														<ArrowRight
															size={18}
															className="group-hover:text-white transition-colors text-blue-600"
														/>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
							{totalPages > 1 && (
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={setCurrentPage}
								/>
							)}
						</>
					) : (
						<div className="text-center py-12">
							<div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
								<Briefcase
									size={28}
									className="text-gray-400 dark:text-gray-600"
								/>
							</div>
							<p className="text-base text-gray-600 dark:text-gray-400 font-medium">
								No applications yet.
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
								Start applying to jobs now!
							</p>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
};

export default AppliedJobs;
