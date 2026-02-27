import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, CheckCircle, Clock, Truck, Search, Loader2, User, ChevronRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/admin/orders');
                if (res.data.success) setOrders(res.data.data);
            } catch (e) {
                toast.error('Sync failed: Could not fetch orders');
            } finally { setLoading(false); }
        };
        fetch();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const res = await api.patch(`/admin/orders/${id}/status`, { status });
            if (res.data.success) {
                setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
                toast.success(`Protocol Updated: Order #${id} is now ${status}`);
            }
        } catch (e) {
            toast.error('Command Rejected: Status update failed');
        }
    };

    const filtered = orders.filter(o =>
        o.id.toString().includes(filter) ||
        o.user?.name?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black text-brand-600">Order Streams</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{filtered.length} Active Transitions Found</span>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search ID or Customer..."
                        className="input-field pl-12 py-3 text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead className="bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] border-b border-gray-100 dark:border-white/5">
                                <tr>
                                    <th className="px-8 py-5">System ID</th>
                                    <th className="px-8 py-5">Stakeholder</th>
                                    <th className="px-8 py-5">Items</th>
                                    <th className="px-8 py-5">Valuation</th>
                                    <th className="px-8 py-5">Lifecycle</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                {filtered.map(order => (
                                    <tr key={order.id} className="text-sm hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6 font-display font-black text-brand-600">#{order.id} <span className="text-[8px] opacity-10 font-sans block">{new Date(order.createdAt).toLocaleDateString()}</span></td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-brand-600/10 group-hover:text-brand-600 transition-colors">
                                                    <User size={14} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold dark:text-white line-clamp-1">{order.user?.name || 'Guest User'}</span>
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{order.user?.phone || 'No Contact'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <ShoppingBag size={14} className="text-gray-300" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{order.orderItems?.length || 1} Batch Units</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold dark:text-white">Rs. {parseFloat(order.totalAmount).toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border ${order.status === 'delivered' ? 'bg-green-100/10 text-green-600 border-green-200/20' :
                                                    order.status === 'shipped' ? 'bg-blue-100/10 text-blue-600 border-blue-200/20' :
                                                        order.status === 'processing' ? 'bg-orange-100/10 text-orange-600 border-orange-200/20' :
                                                            'bg-brand-100/10 text-brand-600 border-brand-200/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {order.status === 'pending' && (
                                                    <ActionButton onClick={() => updateStatus(order.id, 'processing')} icon={<Clock />} tooltip="Authorize Production" color="hover:text-orange-500" />
                                                )}
                                                {order.status === 'processing' && (
                                                    <ActionButton onClick={() => updateStatus(order.id, 'shipped')} icon={<Truck />} tooltip="Dispatch Parcel" color="hover:text-blue-500" />
                                                )}
                                                {order.status === 'shipped' && (
                                                    <ActionButton onClick={() => updateStatus(order.id, 'delivered')} icon={<CheckCircle />} tooltip="Confirm Handover" color="hover:text-green-500" />
                                                )}
                                                <ActionButton icon={<Eye />} tooltip="Deep Audit" color="hover:text-brand-600" />
                                                <ChevronRight size={14} className="text-gray-200 group-hover:translate-x-1 group-hover:text-brand-600 transition-all" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const ActionButton = ({ icon, onClick, tooltip, color }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick && onClick();
        }}
        title={tooltip}
        className={`h-9 w-9 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 ${color} hover:border-brand-200 transition-all shadow-soft group-hover:shadow-lg`}
    >
        {React.cloneElement(icon, { size: 16 })}
    </button>
);

export default AdminOrders;
