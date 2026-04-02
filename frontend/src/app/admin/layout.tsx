"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Skip auth check for login page
            if (pathname === "/admin/login") {
                setIsLoading(false);
                return;
            }

            const adminKey = localStorage.getItem("adminKey");
            
            if (!adminKey) {
                // No admin key, redirect to login
                router.push("/admin/login");
                setIsLoading(false);
                return;
            }

            // Verify admin key is valid by making a test request
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_USER_SERVICE}/api/admin/users/stats`,
                    {
                        headers: { "x-admin-key": adminKey },
                    }
                );

                if (!response.ok) {
                    // Invalid admin key
                    localStorage.removeItem("adminKey");
                    router.push("/admin/login");
                    setIsLoading(false);
                    return;
                }

                setIsAuthenticated(true);
                setIsLoading(false);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem("adminKey");
                router.push("/admin/login");
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    // If on login page, show without auth check
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // If not authenticated, don't render protected content
    if (!isAuthenticated) {
        return null;
    }

    // Render authenticated content with sidebar
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <AdminSidebar />
            <div className="ml-64 transition-all">
                {children}
            </div>
        </div>
    );
}
