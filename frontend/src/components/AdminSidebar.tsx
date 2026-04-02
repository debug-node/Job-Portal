"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    CreditCard,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
        { label: "Applications", href: "/admin/applications", icon: FileText },
        { label: "Payments", href: "/admin/payments", icon: CreditCard },
    ];

    const isActive = (href: string) => pathname === href;

    const handleLogout = () => {
        localStorage.removeItem("adminKey");
        toast.success("Logged out successfully");
        router.push("/admin/login");
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-linear-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white transition-all duration-300 z-40 ${
                    isSidebarOpen ? "w-64" : "w-20"
                }`}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-slate-700">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-lg">A</span>
                            </div>
                            <span className="font-bold text-xl">Admin</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                                        active
                                            ? "bg-linear-to-r from-blue-500 to-purple-600 shadow-lg"
                                            : "hover:bg-slate-700"
                                    }`}
                                >
                                    <Icon size={20} />
                                    {isSidebarOpen && (
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-700">
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full flex items-center gap-2 justify-center"
                    >
                        <LogOut size={18} />
                        {isSidebarOpen && <span>Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Content Wrapper */}
            <div
                className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
            >
                {/* This will be filled by child components */}
            </div>
        </>
    );
}
