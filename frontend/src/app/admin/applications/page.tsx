"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

interface Application {
    application_id: number;
    job_id: number;
    job_title: string;
    status: string;
    applied_at: string;
}

export default function AdminApplications() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [adminKey, setAdminKey] = useState("");

    useEffect(() => {
        const key = localStorage.getItem("adminKey");
        if (!key) router.push("/admin/login");
        else {
            setAdminKey(key);
            fetchApplications(key, 1, statusFilter);
        }
    }, []);

    const fetchApplications = async (key: string, pageNum: number, filter: string) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: pageNum.toString(),
                limit: "10",
                ...(filter !== "all" && { status: filter }),
            });

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_JOB_SERVICE}/api/admin/applications/all?${queryParams}`,
                { headers: { "x-admin-key": key } }
            );

            if (!res.ok) throw new Error("Failed to fetch applications");
            const data = await res.json();
            setApplications(data.applications || []);
        } catch (error) {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (appId: number, newStatus: string) => {
        updateApplicationStatus(appId, newStatus);
    };

    const updateApplicationStatus = async (appId: number, newStatus: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_JOB_SERVICE}/api/admin/applications/update/${appId}`,
                {
                    method: "PUT",
                    headers: {
                        "x-admin-key": adminKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!res.ok) throw new Error("Failed to update status");
            toast.success("Status updated successfully");
            fetchApplications(adminKey, page, statusFilter);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Submitted":
                return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
            case "Rejected":
                return "bg-red-500/20 text-red-700 dark:text-red-400";
            case "Hired":
                return "bg-green-500/20 text-green-700 dark:text-green-400";
            default:
                return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-white transition-colors">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => router.push("/admin/dashboard")}
                            variant="ghost"
                            size="sm"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <h1 className="text-2xl font-bold">Applications Management</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter */}
                <div className="mb-6 w-48">
                    <Select value={statusFilter} onValueChange={(value) => {
                        setStatusFilter(value);
                        setPage(1);
                        fetchApplications(adminKey, 1, value);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Submitted">Submitted</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                            <SelectItem value="Hired">Hired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="border dark:border-slate-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Job Title</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Applied Date</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                            No applications found
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((app) => (
                                            <tr key={app.application_id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4">{app.job_title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(app.applied_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Select defaultValue={app.status} onValueChange={(value) => handleStatusChange(app.application_id, value)}>
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Submitted">Submitted</SelectItem>
                                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                                        <SelectItem value="Hired">Hired</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center gap-2">
                    <Button
                        onClick={() => {
                            setPage(page - 1);
                            fetchApplications(adminKey, page - 1, statusFilter);
                        }}
                        disabled={page === 1}
                        variant="outline"
                    >
                        Previous
                    </Button>
                    <Button variant="outline" disabled>
                        Page {page}
                    </Button>
                    <Button
                        onClick={() => {
                            setPage(page + 1);
                            fetchApplications(adminKey, page + 1, statusFilter);
                        }}
                        variant="outline"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
