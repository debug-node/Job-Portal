"use client";

import { AppContextType, Application, AppProviderProps, User } from "@/type";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

export const utils_service = "http://localhost:5001";
export const auth_service = "http://localhost:5000";
export const user_service = "http://localhost:5002";
export const job_service = "http://localhost:5003";
export const payment_service = "http://localhost:5004";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuth, setIsAuth] = useState(false);
	const [loading, setLoading] = useState(true);
	const [btnLoading, setBtnLoading] = useState(false);

	const token = Cookies.get("token");

	async function fetchUser() {
		try {
			const { data } = await axios.get(`${user_service}/api/user/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setUser(data);
			setIsAuth(true);
		} catch (error) {
			console.log(error);
			setIsAuth(false);
		} finally {
			setLoading(false);
		}
	}

	async function updateProfilePic(fromData: FormData) {
		setLoading(true);
		try {
			const { data } = await axios.put(
				`${user_service}/api/user/update/pic`,
				fromData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			toast.success(data.message);
			fetchUser();
		} catch (error: unknown) {
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Failed to update profile picture");
		} finally {
			setLoading(false);
		}
	}

	async function updateResume(fromData: FormData) {
		setLoading(true);
		try {
			const { data } = await axios.put(
				`${user_service}/api/user/update/resume`,
				fromData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			toast.success(data.message);
			fetchUser();
		} catch (error: unknown) {
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Failed to update resume");
		} finally {
			setLoading(false);
		}
	}

	async function updateUser(name: string, phoneNumber: string, bio: string) {
		setBtnLoading(true);
		try {
			const { data } = await axios.put(
				`${user_service}/api/user/update/profile`,
				{ name, phoneNumber, bio },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			toast.success(data.message);
			fetchUser();
		} catch (error: unknown) {
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Failed to update profile");
		} finally {
			setBtnLoading(false);
		}
	}

	async function logoutUser() {
		Cookies.set("token", "");
		setUser(null);
		setIsAuth(false);
		toast.success("Logged out successfully");
	}

	async function addSkill(
		skill: string,
		setSkill: React.Dispatch<React.SetStateAction<string>>,
	) {
		setBtnLoading(true);
		try {
			const { data } = await axios.post(
				`${user_service}/api/user/skill/add`,
				{ skillName: skill },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			toast.success(data.message);
			setSkill("");
			fetchUser();
		} catch (error: unknown) {
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Failed to add skill");
		} finally {
			setBtnLoading(false);
		}
	}

	async function removeSkill(skill: string) {
		try {
			const { data } = await axios.put(
				`${user_service}/api/user/skill/delete`,
				{ skillName: skill },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			toast.success(data.message);
			fetchUser();
		} catch (error: unknown) {
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Failed to remove skill");
		}
	}

	async function applyJob(job_id: number) {
		if (!user || user.role !== "jobseeker") {
			toast.error("Only job seekers can apply for jobs");
			return;
		}

		setBtnLoading(true);
		try {
			const { data } = await axios.post(
				`${user_service}/api/user/apply/job`,
				{ job_id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			toast.success(data.message);
			fetchApplications();
		} catch (error: unknown) {
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Failed to apply for job");
		} finally {
			setBtnLoading(false);
		}
	}

	const [applications, setApplications] = useState<Application[]>([]);
	const [applicationPage, setApplicationPage] = useState(1);
	const applicationsPerPage = 10; // Load 10 applications per page

	async function fetchApplications(page?: number) {
		try {
			const pageNum = page || applicationPage;
			const skip = (pageNum - 1) * applicationsPerPage;

			const { data } = await axios.get(
				`${user_service}/api/user/application/all?skip=${skip}&limit=${applicationsPerPage}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			setApplications(data);
			setApplicationPage(pageNum);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchUser();
		fetchApplications();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AppContext.Provider
			value={{
				user,
				loading,
				btnLoading,
				setUser,
				isAuth,
				setIsAuth,
				setLoading,
				logoutUser,
				updateProfilePic,
				updateResume,
				updateUser,
				addSkill,
				removeSkill,
				applyJob,
				applications,
				fetchApplications,
			}}>
			{children}
			<Toaster />
		</AppContext.Provider>
	);
};

export const useAppData = (): AppContextType => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppData must be used within AppProvider");
	}
	return context;
};
