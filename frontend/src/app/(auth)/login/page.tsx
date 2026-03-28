"use client";
import { auth_service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [btnLoading, setBtnLoading] = useState(false);
	const router = useRouter();

	const { isAuth, user, setUser, loading, setIsAuth, fetchApplications } = useAppData();

	useEffect(() => {
		if (!loading && isAuth && user) {
			router.replace(user.role === "recruiter" ? "/account" : "/jobs");
		}
	}, [isAuth, loading, router, user]);

	if (loading) return <Loading />;

	if (isAuth) return <Loading />;

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setBtnLoading(true);
		try {
			const { data } = await axios.post(`${auth_service}/api/auth/login`, {
				email,
				password,
			});

			toast.success(data.message);

			Cookies.set("token", data.token, {
				expires: 15,
				secure: false,
				path: "/",
			});
			setUser(data.userObject);
			setIsAuth(true);

			if (data.userObject?.role === "jobseeker") {
				fetchApplications();
				router.push("/jobs");
			} else {
				router.push("/account");
			}
		} catch (error: unknown) {
			console.log(error);
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Login failed");
			setIsAuth(false);
		} finally {
			setBtnLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
			<div className="absolute -top-16 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
			<div className="absolute -bottom-20 -right-24 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
			<div className="w-full max-w-md">
				<div className="text-center mb-8 relative z-10">
					<h1 className="text-4xl font-bold mb-2">
						Welcome back to HireHeaven
					</h1>
					<p className="text-sm opacity-70">Sign in to continue your journey</p>
				</div>
				<div className="border rounded-2xl p-8 shadow-xl bg-card/80 backdrop-blur-sm relative z-10">
					<form onSubmit={submitHandler} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium">
								Email Address
							</Label>
							<div className="relative">
								<Mail className="icon-style" />
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="pl-10 h-11"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium">
								Password
							</Label>
							<div className="relative">
								<Lock className="icon-style" />
								<Input
									id="password"
									type="password"
									placeholder="********"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="pl-10 h-11"
								/>
							</div>
						</div>

						<div className="flex items-center justify-end">
							<Link
								href={"/forgot"}
								className="text-sm text-blue-500 hover:underline transition-all">
								Forgot Password?
							</Link>
						</div>

						<Button disabled={btnLoading} className="w-full">
							{btnLoading ? "Signing in..." : "Sign In"}
							<ArrowRight size={18} />
						</Button>
					</form>

					<div className="mt-6 pt-6 border-t border-gray-400">
						<p className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link
								href={"/register"}
								className="text-blue-500 font-medium hover:underline transition-all">
								Create one now
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
