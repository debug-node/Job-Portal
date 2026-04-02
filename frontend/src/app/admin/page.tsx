"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        const adminKey = localStorage.getItem("adminKey");
        if (adminKey) {
            router.push("/admin/dashboard");
        } else {
            router.push("/admin/login");
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
}
