"use client";
import Loading from "@/components/loading";
import { useAppData } from "@/context/AppContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppliedJobs from "../account/components/appliedJobs";

const ApplicationsPage = () => {
	const { isAuth, loading, applications, user } = useAppData();
	const router = useRouter();

	useEffect(() => {
		if (!isAuth && !loading) {
			router.push("/login");
		}
		if (user && user.role !== "jobseeker" && !loading) {
			router.push("/account");
		}
	}, [isAuth, router, loading, user]);

	if (loading) return <Loading />;

	return (
		<div className="ui-page">
			<div className="ui-shell w-[92%] md:w-[70%] lg:w-[62%]">
				<AppliedJobs applications={applications} />
			</div>
		</div>
	);
};

export default ApplicationsPage;
