"use client";
import { auth_service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { ArrowRight, Briefcase, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";

const RegisterPage = () => {
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [bio, setBio] = useState("");
	const [resume, setResume] = useState<File | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [btnLoading, setBtnLoading] = useState(false);
	const router = useRouter();

	const { isAuth, user, setUser, loading, setIsAuth } = useAppData();

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
		const formData = new FormData();

		formData.append("role", role);
		formData.append("name", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("phoneNumber", phoneNumber);

		if (role === "jobseeker") {
			formData.append("bio", bio);
			if (resume) {
				formData.append("file", resume);
			}
		}
		try {
			const { data } = await axios.post(
				`${auth_service}/api/auth/register`,
				formData,
			);

			toast.success(data.message);

			Cookies.set("token", data.token, {
				expires: 15,
				secure: false,
				path: "/",
			});
			setUser(data.registeredUser);
			setIsAuth(true);
			router.push(data.registeredUser?.role === "recruiter" ? "/account" : "/jobs");
		} catch (error: unknown) {
			const axiosError = (error as { response?: { data?: { message?: string } } })
				?.response?.data?.message;
			toast.error(axiosError || "Registration failed");
			setIsAuth(false);
		} finally {
			setBtnLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
			{/* Animated background gradients */}
			<div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
			<div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
			
			<div className="w-full max-w-md relative z-20">
				{/* Header */}
				<div className="text-center mb-10">
					<h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 text-transparent bg-clip-text">
						Join HireHeaven
					</h1>
					<p className="text-slate-300 text-base font-medium">
						Create your account and start your journey
					</p>
				</div>

				{/* Form Card */}
				<div className="backdrop-blur-xl bg-slate-800/60 border border-slate-700 rounded-3xl p-8 shadow-2xl">
					<form onSubmit={submitHandler} className="space-y-6">
						{/* Role Selection */}
						<div className="space-y-3">
							<Label htmlFor="role" className="text-sm font-semibold text-slate-200 block">
								I want to
							</Label>
							<div className="relative">
								<Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none z-10" />
								<select
									id="role"
									value={role}
									onChange={(e) => setRole(e.target.value)}
									className="w-full h-12 pl-12 pr-4 bg-slate-700 border-2 border-slate-600 rounded-xl text-slate-100 font-semibold focus:border-blue-500 focus:bg-slate-600 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all text-base appearance-none cursor-pointer"
									required>
									<option value="" className="bg-slate-800 text-slate-400" disabled>Select your role</option>
									<option value="jobseeker" className="bg-slate-800 text-slate-100">Find a Job</option>
									<option value="recruiter" className="bg-slate-800 text-slate-100 font-semibold">Hire Talent</option>
								</select>
							</div>
						</div>

						{/* Conditional Form Fields */}
						{role && (
							<div className="space-y-5 animate-in fade-in-up duration-300">
								{/* Name */}
								<div className="space-y-3">
									<Label htmlFor="name" className="text-sm font-semibold text-slate-200 block">
										Full Name
									</Label>
									<div className="relative">
										<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none z-10" />
										<Input
											id="name"
											type="text"
											placeholder="Enter your full name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
											className="pl-12 h-12 bg-slate-700 border-2 border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-medium"
										/>
									</div>
								</div>

								{/* Email */}
								<div className="space-y-3">
									<Label htmlFor="email" className="text-sm font-semibold text-slate-200 block">
										Email Address
									</Label>
									<div className="relative">
										<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none z-10" />
										<Input
											id="email"
											type="email"
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="pl-12 h-12 bg-slate-700 border-2 border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-medium"
										/>
									</div>
								</div>

								{/* Password */}
								<div className="space-y-3">
									<Label htmlFor="password" className="text-sm font-semibold text-slate-200 block">
										Password
									</Label>
									<div className="relative">
										<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none z-10" />
										<Input
											id="password"
											type="password"
											placeholder="••••••••"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											className="pl-12 h-12 bg-slate-700 border-2 border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-medium"
										/>
									</div>
								</div>

								{/* Phone */}
								<div className="space-y-3">
									<Label htmlFor="phone" className="text-sm font-semibold text-slate-200 block">
										Phone Number
									</Label>
									<div className="relative">
										<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none z-10" />
										<Input
											id="phone"
											type="tel"
											placeholder="+91 98765 43210"
											value={phoneNumber}
											onChange={(e) => setPhoneNumber(e.target.value)}
											required
											className="pl-12 h-12 bg-slate-700 border-2 border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-medium"
										/>
									</div>
								</div>

								{/* Job Seeker Only Fields */}
								{role === "jobseeker" && (
									<div className="space-y-5 pt-5 border-t border-slate-700">
										{/* Resume */}
										<div className="space-y-3">
											<Label htmlFor="resume" className="text-sm font-semibold text-slate-200 block">
												Resume (PDF)
											</Label>
											<Input
												id="resume"
												type="file"
												accept="application/pdf"
												onChange={(e) => {
													if (e.target.files?.[0]) {
														setResume(e.target.files[0]);
													}
												}}
												className="h-12 bg-slate-700 border-2 border-slate-600 rounded-xl text-slate-100 file:text-blue-300 file:bg-slate-600 file:border-0 file:rounded-lg file:font-semibold file:cursor-pointer file:mr-3 file:px-3 file:py-2 cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
											/>
										</div>

										{/* Bio */}
										<div className="space-y-3">
											<Label htmlFor="bio" className="text-sm font-semibold text-slate-200 block">
												Bio
											</Label>
											<div className="relative">
												<Lock className="absolute left-4 top-4 w-5 h-5 text-blue-400 pointer-events-none z-10" />
												<textarea
													id="bio"
													placeholder="Tell us about yourself..."
													value={bio}
													onChange={(e) => setBio(e.target.value)}
													required
													rows={3}
													className="pl-12 pt-3 w-full bg-slate-700 border-2 border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-medium resize-none"
												/>
											</div>
										</div>
									</div>
								)}

								{/* Register Button */}
								<Button 
									disabled={btnLoading} 
									className="w-full h-12 mt-8 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{btnLoading ? "Creating account..." : "Create Account"}
									{!btnLoading && <ArrowRight size={20} />}
								</Button>
							</div>
						)}
					</form>

					{/* Login Link */}
					<div className="mt-8 pt-8 border-t border-slate-700 text-center">
						<p className="text-slate-300 text-sm">
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-blue-400 font-semibold hover:text-cyan-300 transition-colors">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
