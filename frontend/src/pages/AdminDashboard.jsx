import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Layers
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                if (res.data.success) setStats(res.data.data);
            } catch (e) { } finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>;

    if (!stats) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
                <Layers size={48} className="text-gray-300 mb-2" />
                <h3 className="font-bold dark:text-white">Metrics Unavailable</h3>
                <p className="text-sm text-gray-500 max-w-xs">We encountered an error while fetching the dashboard statistics. Please try again later.</p>
                <button onClick={() => window.location.reload()} className="btn-secondary py-2 px-8 mt-2">Retry</button>
            </div>
        );
    }

    const { totals, recentOrders } = stats;

    return (
        <div className="flex flex-col gap-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard label="Total Revenue" value={`Rs. ${totals.revenue.toLocaleString()}`} icon={<TrendingUp />} color="text-green-600" />
                <StatCard label="Estimated Profit" value={`Rs. ${totals.estimatedProfit.toLocaleString()}`} icon={<ArrowUpRight />} color="text-brand-600" />
                <StatCard label="Total Orders" value={totals.orders} icon={<ShoppingBag />} color="text-orange-600" />
                <StatCard label="Products" value={totals.products} icon={<CreditCard />} color="text-purple-600" />
                <StatCard label="Services" value={totals.services} icon={<Layers />} color="text-blue-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 glass-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <h3 className="font-bold dark:text-white uppercase tracking-widest text-xs">Recent Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {recentOrders.map(order => (
                                    <tr key={order.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold">#{order.id}</td>
                                        <td className="px-6 py-4 dark:text-gray-300">{order.user?.name || 'Guest'}</td>
                                        <td className="px-6 py-4 uppercase text-[10px] font-bold tracking-widest">
                                            <span className={order.status === 'delivered' ? 'text-green-600' : 'text-brand-600 opacity-80'}>{order.status}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold dark:text-white">Rs. {parseFloat(order.totalAmount).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Info / P&L Brief */}
                <div className="glass-card p-10 flex flex-col gap-8 bg-brand-600 text-white shadow-xl shadow-brand-600/20">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-white/60 uppercase tracking-[0.3em] font-bold text-[10px]">Estimated Profit</h3>
                        <p className="text-4xl font-display font-black leading-tight">Rs. {Math.round(totals.revenue * 0.4).toLocaleString()}</p>
                        <span className="flex items-center gap-1 text-white/60 text-xs mt-2">
                            <ArrowUpRight size={14} /> 12% increase from last month
                        </span>
                    </div>
                    <div className="h-px bg-white/20"></div>
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="opacity-60">Pending Payouts</span>
                            <span>Rs. 45,000</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="opacity-60">Avg. Order Value</span>
                            <span>Rs. {Math.round(totals.revenue / (totals.orders || 1)).toLocaleString()}</span>
                        </div>
                    </div>
                    <button className="bg-white text-brand-600 font-bold py-4 rounded-xl shadow-lg mt-4 hover:bg-gray-50 transition-colors">
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <div className="glass-card p-8 flex items-center gap-6 hover:-translate-y-1 transition-all duration-300">
        <div className={`h-14 w-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${color} shadow-soft`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</span>
            <p className="text-2xl font-display font-black dark:text-white">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
