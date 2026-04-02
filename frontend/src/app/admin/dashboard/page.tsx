"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Users,
    Briefcase,
    FileText,
    CreditCard,
    Download,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import { generateReport, ReportData } from "@/lib/reportGenerator";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

interface DashboardStats {
    totalUsers: number;
    recruiters: number;
    jobseekers: number;
    totalJobs: number;
    totalApplications: number;
    totalRevenue: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [adminKey, setAdminKey] = useState("");
    const [showReportOptions, setShowReportOptions] = useState(false);
    const [reportGenerating, setReportGenerating] = useState(false);

    useEffect(() => {
        const key = localStorage.getItem("adminKey");
        if (!key) {
            router.push("/admin/login");
            return;
        }
        setAdminKey(key);
        fetchStats(key);
    }, []);

    const fetchStats = async (key: string) => {
        try {
            setLoading(true);
            const [userRes, jobRes, paymentRes] = await Promise.all([
                fetch(
                    `${process.env.NEXT_PUBLIC_USER_SERVICE}/api/admin/users/stats`,
                    {
                        headers: { "x-admin-key": key },
                    },
                ),
                fetch(
                    `${process.env.NEXT_PUBLIC_JOB_SERVICE}/api/admin/jobs/stats`,
                    {
                        headers: { "x-admin-key": key },
                    },
                ),
                fetch(
                    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE}/api/admin/payments/stats`,
                    {
                        headers: { "x-admin-key": key },
                    },
                ),
            ]);

            const userData = await userRes.json();
            const jobData = await jobRes.json();
            const paymentData = await paymentRes.json();

            setStats({
                totalUsers: userData.totalUsers || 0,
                recruiters: userData.recruiters || 0,
                jobseekers: userData.jobseekers || 0,
                totalJobs: jobData.totalJobs || 0,
                totalApplications: jobData.totalApplications || 0,
                totalRevenue: paymentData.totalRevenue || 0,
            });
        } catch (error) {
            toast.error("Failed to load dashboard stats");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async (
        format: "json" | "text" | "pdf" | "all",
    ) => {
        if (!stats) return;

        try {
            setReportGenerating(true);
            const report: ReportData = {
                generatedAt: new Date().toLocaleString(),
                summary: {
                    totalUsers: stats.totalUsers,
                    totalJobs: stats.totalJobs,
                    totalApplications: stats.totalApplications,
                    totalRevenue: stats.totalRevenue,
                },
                userBreakdown: {
                    recruiters: stats.recruiters,
                    jobSeekers: stats.jobseekers,
                },
            };

            generateReport(report, format);
            const formatNames = {
                json: "JSON",
                text: "Text",
                pdf: "PDF",
                all: "All formats",
            };
            toast.success(
                `Report (${formatNames[format]}) generated successfully!`,
            );
            setShowReportOptions(false);
        } catch (error) {
            toast.error("Failed to generate report");
            console.error(error);
        } finally {
            setReportGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-600",
        },
        {
            title: "Active Jobs",
            value: stats?.totalJobs || 0,
            icon: Briefcase,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-500/10",
            textColor: "text-green-600",
        },
        {
            title: "Applications",
            value: stats?.totalApplications || 0,
            icon: FileText,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-600",
        },
        {
            title: "Revenue",
            value: `₹${stats?.totalRevenue || 0}`,
            icon: CreditCard,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-500/10",
            textColor: "text-orange-600",
        },
    ];

    const chartData = [
        { name: "Users", value: stats?.totalUsers || 0 },
        { name: "Jobs", value: stats?.totalJobs || 0 },
        { name: "Applications", value: stats?.totalApplications || 0 },
    ];

    const userBreakdown = [
        { name: "Recruiters", value: stats?.recruiters || 0 },
        { name: "Job Seekers", value: stats?.jobseekers || 0 },
    ];

    // Filter out zero values for pie chart
    const validUserData = userBreakdown.filter((item) => item.value > 0);

    const COLORS = ["#3b82f6", "#10b981"];

    return (
        <div className="p-8 bg-slate-50 dark:bg-slate-950 dark:text-white min-h-screen transition-colors">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Welcome back to your admin panel
                    </p>
                </div>
                <div className="relative">
                    <Button
                        onClick={() => setShowReportOptions(!showReportOptions)}
                        disabled={reportGenerating}
                        className="bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all text-white"
                    >
                        <Download size={18} className="mr-2" />
                        Generate Report
                        <ChevronDown size={18} className="ml-2" />
                    </Button>

                    {/* Report Format Dropdown */}
                    {showReportOptions && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        Export as
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowReportOptions(false)
                                        }
                                    >
                                        <X
                                            size={16}
                                            className="text-gray-500"
                                        />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {/* JSON */}
                                    <button
                                        onClick={() =>
                                            handleGenerateReport("json")
                                        }
                                        disabled={reportGenerating}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors text-sm text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText
                                                size={16}
                                                className="text-blue-500"
                                            />
                                            JSON Format
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                                            Machine-readable data
                                        </p>
                                    </button>

                                    {/* Text */}
                                    <button
                                        onClick={() =>
                                            handleGenerateReport("text")
                                        }
                                        disabled={reportGenerating}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors text-sm text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText
                                                size={16}
                                                className="text-green-500"
                                            />
                                            Text Format
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                                            Human-readable text
                                        </p>
                                    </button>

                                    {/* PDF */}
                                    <button
                                        onClick={() =>
                                            handleGenerateReport("pdf")
                                        }
                                        disabled={reportGenerating}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors text-sm text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText
                                                size={16}
                                                className="text-red-500"
                                            />
                                            PDF Format
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                                            Professional document
                                        </p>
                                    </button>

                                    <div className="border-t border-gray-200 dark:border-slate-700 my-2"></div>

                                    {/* All Formats */}
                                    <button
                                        onClick={() =>
                                            handleGenerateReport("all")
                                        }
                                        disabled={reportGenerating}
                                        className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors text-sm text-blue-600 dark:text-blue-400 font-semibold"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Download size={16} />
                                            Export All Formats
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                                            JSON, Text & PDF
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div id="report-container" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-slate-700"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div
                                        className={`${card.bgColor} p-3 rounded-lg`}
                                    >
                                        <Icon
                                            className={`${card.textColor}`}
                                            size={24}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                        <ArrowUpRight size={16} />
                                        12%
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {card.value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Bar Chart */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Overview
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* User Breakdown */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            User Breakdown
                        </h2>
                        <div className="space-y-4">
                            {/* Recruiters */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Recruiters
                                    </span>
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {stats?.recruiters || 0}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-linear-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
                                        style={{
                                            width: `${stats?.totalUsers ? (stats.recruiters / stats.totalUsers) * 100 : 0}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Job Seekers */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Job Seekers
                                    </span>
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {stats?.jobseekers || 0}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-linear-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                                        style={{
                                            width: `${stats?.totalUsers ? (stats.jobseekers / stats.totalUsers) * 100 : 0}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Stats
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Recruiters
                            </p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {stats?.recruiters || 0}
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Job Seekers
                            </p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats?.jobseekers || 0}
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Conversion Rate
                            </p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {stats?.totalJobs && stats?.totalApplications
                                    ? (
                                          (stats.totalApplications /
                                              stats.totalJobs) *
                                          100
                                      ).toFixed(1)
                                    : 0}
                                %
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
