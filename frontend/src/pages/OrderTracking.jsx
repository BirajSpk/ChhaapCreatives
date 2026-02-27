import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Package, MapPin, Clock, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const OrderTracking = () => {
    const [orderId, setOrderId] = React.useState('');
    const [order, setOrder] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleTrack = async (e) => {
        if (e) e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/orders/${orderId}/track`);
            if (res.data.success) {
                setOrder(res.data.data);
            } else {
                setError('Order not found. Please check your ID.');
            }
        } catch (err) {
            setError('Could not fetch order. Please verify the ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-container pb-20 pt-4 animate-fade-in">
            <div className="max-w-2xl mx-auto flex flex-col gap-12">
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="heading-md dark:text-white">Track Your Order</h1>
                    <p className="text-gray-500 italic">Enter your order ID to see the latest status of your prints.</p>
                </div>

                <form onSubmit={handleTrack} className="glass-card p-2 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full bg-transparent border-none focus:ring-0 pl-12 py-4 h-full dark:text-white"
                            placeholder="Order ID (e.g. 1042)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary py-3 px-8 rounded-lg">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Track'}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-6 rounded-2xl flex items-center gap-4 text-red-600 shadow-soft animate-slide-up">
                        <AlertCircle size={24} />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="flex flex-col gap-8 animate-slide-up">
                        <div className="glass-card overflow-hidden">
                            <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-brand-600/5">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-[10px]">Order Status</span>
                                    <h3 className="text-xl font-bold text-brand-600 uppercase tracking-widest">{order.status}</h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-[10px]">Order ID</span>
                                    <p className="font-bold dark:text-white">#{order.id}</p>
                                </div>
                            </div>

                            <div className="p-10 flex flex-col gap-12">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <TrackStep icon={<Clock />} active={true} label="Ordered" sub={new Date(order.createdAt).toLocaleDateString()} />
                                    <TrackStep icon={<Package />} active={['processing', 'shipped', 'delivered'].includes(order.status)} label="Processing" sub="Design Verification" />
                                    <TrackStep icon={<MapPin />} active={['shipped', 'delivered'].includes(order.status)} label="On the Way" sub="Out for delivery" />
                                </div>

                                <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full relative overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-brand-600 transition-all duration-1000"
                                        style={{ width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : order.status === 'processing' ? '33%' : '5%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-10 flex flex-col gap-6">
                            <h4 className="font-bold dark:text-white">Order Summary</h4>
                            <div className="flex flex-col gap-4">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">{item.product?.name} x {item.quantity}</span>
                                        <span className="font-bold dark:text-white">Rs. {parseFloat(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="h-px bg-gray-100 dark:border-white/5 my-2"></div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-display font-bold dark:text-white">Total</span>
                                    <span className="font-display font-bold text-brand-600">Rs. {parseFloat(order.totalAmount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TrackStep = ({ icon, active, label, sub }) => (
    <div className={`flex flex-col items-center gap-3 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}>
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-soft ${active ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="text-center flex flex-col gap-0.5">
            <span className="text-sm font-bold dark:text-white tracking-wide">{label}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{sub}</span>
        </div>
    </div>
);

export default OrderTracking;
