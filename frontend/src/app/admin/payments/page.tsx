"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingUp, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

interface Subscription {
    user_id: number;
    user_name: string;
    email: string;
    plan_type: string;
    amount: number;
    status: string;
    created_at: string;
    expires_at: string;
}

interface PaymentStats {
    totalSubscriptions: number;
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    totalRevenue: number;
}

export default function AdminPayments() {
    const router = useRouter();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [stats, setStats] = useState<PaymentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [adminKey, setAdminKey] = useState("");

    useEffect(() => {
        const key = localStorage.getItem("adminKey");
        if (!key) router.push("/admin/login");
        else {
            setAdminKey(key);
            fetchPaymentData(key, 1);
        }
    }, []);

    const fetchPaymentData = async (key: string, pageNum: number) => {
        try {
            setLoading(true);

            // Fetch stats
            const statsRes = await fetch(
                `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE}/api/admin/payments/stats`,
                { headers: { "x-admin-key": key } }
            );

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // Fetch subscriptions
            const queryParams = new URLSearchParams({
                page: pageNum.toString(),
                limit: "10",
            });

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE}/api/admin/subscriptions/all?${queryParams}`,
                { headers: { "x-admin-key": key } }
            );

            if (!res.ok) throw new Error("Failed to fetch subscriptions");
            const data = await res.json();
            setSubscriptions(data.subscriptions || []);
        } catch (error) {
            toast.error("Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-white transition-colors">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <h1 className="text-2xl font-bold">Payments & Subscriptions</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Total Subscriptions */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-500/10 p-3 rounded-lg">
                                <CreditCard className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                <ArrowUpRight size={16} />
                                12%
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Subscriptions</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalSubscriptions || 0}</p>
                    </div>

                    {/* Active */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-green-500/10 p-3 rounded-lg">
                                <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                <ArrowUpRight size={16} />
                                8%
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Active Subscriptions</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.activeSubscriptions || 0}</p>
                    </div>

                    {/* Cancelled */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-red-500/10 p-3 rounded-lg">
                                <CreditCard className="text-red-600 dark:text-red-400" size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-semibold">
                                <ArrowUpRight size={16} />
                                3%
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Cancelled Subscriptions</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.cancelledSubscriptions || 0}</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-500/10 p-3 rounded-lg">
                                <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                <ArrowUpRight size={16} />
                                15%
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{stats?.totalRevenue || 0}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="border dark:border-slate-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Plan</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Expires</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : subscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No subscriptions found
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.map((sub) => (
                                        <tr key={sub.user_id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 font-semibold">{sub.user_name}</td>
                                            <td className="px-6 py-4 text-sm opacity-70">{sub.email}</td>
                                            <td className="px-6 py-4 capitalize">{sub.plan_type}</td>
                                            <td className="px-6 py-4 font-semibold">₹{sub.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    sub.status === "active"
                                                        ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                                        : "bg-red-500/20 text-red-700 dark:text-red-400"
                                                }`}>
                                                    {sub.status === "active" ? "Active" : "Cancelled"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(sub.expires_at).toLocaleDateString()}
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
                            fetchPaymentData(adminKey, page - 1);
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
                            fetchPaymentData(adminKey, page + 1);
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
