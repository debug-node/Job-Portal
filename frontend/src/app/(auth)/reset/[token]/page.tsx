"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth_service, useAppData } from "@/context/AppContext";
import axios from "axios";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, Lock } from "lucide-react";

const ResetPage = () => {
	const { token } = useParams();
	const [password, setPassword] = useState("");
	const [btnLoading, setbtnLoading] = useState(false);
	const { isAuth } = useAppData();

	if (isAuth) return redirect("/");

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setbtnLoading(true);
		try {
			const { data } = await axios.post(`${auth_service}/api/auth/reset/${token}`, {
				password,
			});

			toast.success(data.message);
			setPassword("");
		} catch (error: unknown) {
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Failed to reset password");
		} finally {
			setbtnLoading(false);
		}
	};
	return (
		<div className="ui-page relative overflow-hidden flex items-center justify-center">
			<div className="absolute -top-16 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
			<div className="absolute -bottom-20 -right-24 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
			<div className="w-full max-w-md ui-card p-8 relative z-10">
				<h2 className="ui-title mb-2">Reset Password</h2>
				<p className="text-sm opacity-70 mb-5">
					Create a new strong password for your account.
				</p>
				<form onSubmit={submitHandler} className="space-y-4">
					<div className="grid items-center gap-1.5">
						<Label>Password</Label>
						<div className="relative">
							<Lock className="icon-style" />
							<Input
								type="password"
								placeholder="New password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="pl-10 h-11"
							/>
						</div>

						<Button
							disabled={btnLoading}
							className="flex justify-center items-center gap-2 w-full mt-2">
							{btnLoading ? "Updating..." : "Update Password"}
							<ArrowRight size={16} />
						</Button>
					</div>
				</form>

				<Link
					className="mt-4 inline-block text-blue-500 underline text-sm"
					href={"/login"}>
					Back to Sign In
				</Link>
			</div>
		</div>
	);
};

export default ResetPage;
