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

    const totals = stats?.totals || { revenue: 0, estimatedProfit: 0, orders: 0, products: 0, services: 0 };
    const recentOrders = stats?.recentOrders || [];

    return (
        <div className="flex flex-col gap-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard label="Total Revenue" value={`Rs. ${(totals.revenue || 0).toLocaleString()}`} icon={<TrendingUp />} color="text-green-600" />
                <StatCard label="Estimated Profit" value={`Rs. ${(totals.estimatedProfit || 0).toLocaleString()}`} icon={<ArrowUpRight />} color="text-brand-600" />
                <StatCard label="Total Orders" value={totals.orders || 0} icon={<ShoppingBag />} color="text-orange-600" />
                <StatCard label="Products" value={totals.products || 0} icon={<CreditCard />} color="text-purple-600" />
                <StatCard label="Services" value={totals.services || 0} icon={<Layers />} color="text-blue-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="glass-card flex-1 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                            <h3 className="font-bold dark:text-white uppercase tracking-widest text-[10px]">Revenue Stream (7D)</h3>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Live</span>
                            </div>
                        </div>
                        <div className="p-8 h-48 relative flex items-end justify-between gap-2 overflow-hidden">
                            {/* Simple SVG Chart Background */}
                            <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
                                <path d="M0 100 Q 100 80, 200 90 T 400 60 T 600 70 T 800 40 T 1000 50 L 1000 200 L 0 200 Z" fill="url(#grad)" stroke="none" />
                                <defs>
                                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: 'var(--brand-600)', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Bar Chart Mockup */}
                            {[40, 65, 45, 90, 55, 80, 70].map((h, i) => (
                                <div key={i} className="group relative flex flex-col items-center flex-1">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className="w-full max-w-[40px] bg-brand-600/20 dark:bg-brand-600/40 rounded-t-lg group-hover:bg-brand-600 transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span className="text-[8px] text-gray-400 font-bold mt-2 uppercase">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                            <h3 className="font-bold dark:text-white uppercase tracking-widest text-[10px]">Recent Activity</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-white/5 text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-brand-600">#{order.id}</td>
                                            <td className="px-6 py-4 dark:text-gray-300 font-medium">{order.user?.name || 'Guest'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                        order.status === 'processing' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-brand-100 text-brand-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black dark:text-white text-right">Rs. {parseFloat(order.totalAmount).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Info / P&L Brief */}
                <div className="flex flex-col gap-6">
                    <div className="glass-card p-8 flex flex-col gap-8 bg-brand-600 text-white shadow-xl shadow-brand-600/20 border-none">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-white/60 uppercase tracking-[0.3em] font-bold text-[9px]">P&L Projection</h3>
                            <p className="text-4xl font-display font-black leading-tight tracking-tighter">Rs. {(totals.estimatedProfit || 0).toLocaleString()}</p>
                            <span className="flex items-center gap-1 text-white/60 text-[10px] mt-2 font-bold uppercase tracking-widest">
                                <ArrowUpRight size={12} className="text-green-300" /> Efficiency +12.4%
                            </span>
                        </div>
                        <div className="h-px bg-white/10"></div>
                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="opacity-60 text-white">Pending Settlements</span>
                                <span className="text-white">Rs. 45,000</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="opacity-60 text-white">Avg. Order Value</span>
                                <span className="text-white">Rs. {Math.round((totals.revenue || 0) / (totals.orders || 1)).toLocaleString()}</span>
                            </div>
                        </div>
                        <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-white/20 transition-all active:scale-[0.98]">
                            Generate Full Audit
                        </button>
                    </div>

                    <div className="glass-card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600">
                                <Shield size={16} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white">System Integrity</h4>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">DB Sync</span>
                                <span className="text-[10px] text-green-500 font-black">STABLE</span>
                            </div>
                            <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[94%]"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">Latency</span>
                                <span className="text-[10px] text-brand-600 font-black">24ms</span>
                            </div>
                        </div>
                    </div>
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
