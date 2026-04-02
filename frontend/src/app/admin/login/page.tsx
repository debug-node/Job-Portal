"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Verify admin password by calling admin endpoint
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_USER_SERVICE}/api/admin/users/stats`,
                {
                    headers: {
                        "x-admin-key": password,
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Invalid admin password");
            }

            // Store in localStorage (not sensitive data, just for session)
            localStorage.setItem("adminKey", password);
            toast.success("Welcome to Admin Panel!");
            router.push("/admin/dashboard");
        } catch (err: any) {
            const errorMsg = "Invalid admin password";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute -top-16 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-24 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
            <div className="w-full max-w-md">
                <div className="text-center mb-8 relative z-10">
                    <h1 className="text-4xl font-bold mb-2">
                        Admin Access
                    </h1>
                    <p className="text-sm opacity-70">
                        Enter your admin password
                    </p>
                </div>

                <div className="border rounded-2xl p-8 shadow-xl bg-card/80 backdrop-blur-sm relative z-10">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Admin Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 h-11"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm p-3 bg-red-500/10 rounded-lg border border-red-200 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        <Button disabled={loading} className="w-full">
                            {loading ? "Verifying..." : "Access Admin Panel"}
                            <ArrowRight size={18} />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
