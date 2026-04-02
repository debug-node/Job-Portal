"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Job {
    job_id: number;
    title: string;
    company_name: string;
    salary: string;
    job_type: string;
    location: string;
    created_at: string;
}

export default function AdminJobs() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [adminKey, setAdminKey] = useState("");

    useEffect(() => {
        const key = localStorage.getItem("adminKey");
        if (!key) router.push("/admin/login");
        else {
            setAdminKey(key);
            fetchJobs(key, 1, search);
        }
    }, []);

    const fetchJobs = async (key: string, pageNum: number, searchTerm: string) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: pageNum.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
            });

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_JOB_SERVICE}/api/admin/jobs/all?${queryParams}`,
                { headers: { "x-admin-key": key } }
            );

            if (!res.ok) throw new Error("Failed to fetch jobs");
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (error) {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setPage(1);
        fetchJobs(adminKey, 1, value);
    };

    const handleDelete = async (jobId: number) => {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_JOB_SERVICE}/api/admin/jobs/delete/${jobId}`,
                { 
                    method: "DELETE",
                    headers: { "x-admin-key": adminKey }
                }
            );

            if (!res.ok) throw new Error("Failed to delete job");
            toast.success("Job deleted successfully");
            fetchJobs(adminKey, page, search);
        } catch (error) {
            toast.error("Failed to delete job");
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
                        <h1 className="text-2xl font-bold">Job Management</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by job title..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="border dark:border-slate-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Company</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Salary</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No jobs found
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.job_id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 font-semibold">{job.title}</td>
                                            <td className="px-6 py-4">{job.company_name}</td>
                                            <td className="px-6 py-4 text-sm">₹{job.salary}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                                                    {job.job_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{job.location}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    onClick={() => handleDelete(job.job_id)}
                                                    variant="destructive"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </Button>
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
                            fetchJobs(adminKey, page - 1, search);
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
                            fetchJobs(adminKey, page + 1, search);
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
