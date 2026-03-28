"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData, user_service } from "@/context/AppContext";
import { AdminDashboardResponse } from "@/type";
import axios from "axios";
import Cookies from "js-cookie";
import { BarChart3, Building2, Briefcase, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminPage = () => {
	const router = useRouter();
	const { isAuth, user, loading } = useAppData();
	const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
	const [dashboardLoading, setDashboardLoading] = useState(true);

	useEffect(() => {
		if (!loading && !isAuth) {
			router.replace("/login");
			return;
		}

		if (!loading && isAuth && user?.role !== "admin") {
			toast.error("Admin access only");
			router.replace("/jobs");
		}
	}, [isAuth, loading, router, user]);

	useEffect(() => {
		const token = Cookies.get("token");

		if (!token || !isAuth || user?.role !== "admin") {
			setDashboardLoading(false);
			return;
		}

		const fetchDashboard = async () => {
			try {
				const { data } = await axios.get<AdminDashboardResponse>(
					`${user_service}/api/user/admin/dashboard`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				setDashboard(data);
			} catch (error: unknown) {
				const message = (error as { response?: { data?: { message?: string } } })
					?.response?.data?.message;
				toast.error(message || "Failed to load admin dashboard");
			} finally {
				setDashboardLoading(false);
			}
		};

		fetchDashboard();
	}, [isAuth, user]);

	if (loading || dashboardLoading) {
		return <Loading />;
	}

	if (!isAuth || user?.role !== "admin") {
		return null;
	}

	const stats = [
		{
			label: "Users",
			value: dashboard?.stats.totalUsers ?? 0,
			icon: Users,
		},
		{
			label: "Jobs",
			value: dashboard?.stats.totalJobs ?? 0,
			icon: Briefcase,
		},
		{
			label: "Companies",
			value: dashboard?.stats.totalCompanies ?? 0,
			icon: Building2,
		},
		{
			label: "Applications",
			value: dashboard?.stats.totalApplications ?? 0,
			icon: BarChart3,
		},
	];

	return (
		<div className="ui-shell w-[95%] lg:w-[88%] pb-10">
			<div className="mb-6 flex items-center justify-between gap-4">
				<div>
					<p className="text-sm uppercase tracking-[0.2em] text-blue-600">
						Admin Console
					</p>
					<h1 className="text-3xl font-semibold">Job Portal Control Center</h1>
					<p className="text-sm opacity-70 mt-1">
						Overview of platform activity and recent records.
					</p>
				</div>
				<Button onClick={() => router.push("/account")}>Open My Profile</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{stats.map((item) => {
					const Icon = item.icon;
					return (
						<Card key={item.label}>
							<CardContent className="pt-6">
								<div className="flex items-center justify-between mb-2">
									<p className="text-sm opacity-70">{item.label}</p>
									<Icon className="h-4 w-4 text-blue-500" />
								</div>
								<p className="text-3xl font-semibold">{item.value}</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Recent Users</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{dashboard?.recentUsers.length ? (
								dashboard.recentUsers.map((item) => (
									<div
										key={item.user_id}
										className="rounded-lg border px-3 py-2 flex items-center justify-between gap-3">
										<div>
											<p className="font-medium">{item.name}</p>
											<p className="text-xs opacity-60">{item.email}</p>
										</div>
										<span className="text-xs uppercase tracking-wider text-blue-600">
											{item.role}
										</span>
									</div>
								))
							) : (
								<p className="text-sm opacity-60">No recent users found.</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Jobs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{dashboard?.recentJobs.length ? (
								dashboard.recentJobs.map((item) => (
									<div
										key={item.job_id}
										className="rounded-lg border px-3 py-2 flex items-center justify-between gap-3">
										<div>
											<p className="font-medium">{item.title}</p>
											<p className="text-xs opacity-60">
												{item.company_name} • {item.location || "Location N/A"}
											</p>
										</div>
										<span
											className={`text-xs uppercase tracking-wider ${
												item.is_active ? "text-green-600" : "text-red-600"
											}`}>
											{item.is_active ? "Active" : "Inactive"}
										</span>
									</div>
								))
							) : (
								<p className="text-sm opacity-60">No recent jobs found.</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminPage;
