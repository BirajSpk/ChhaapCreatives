import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Settings, LogOut, Loader2, ChevronRight, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, login: setAuthUser, logout, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                if (res.data.success) setOrders(res.data.data);
            } catch (error) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOrders();
        else if (!authLoading) setLoading(false);
    }, [user, authLoading]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    if (authLoading || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={48} />
            </div>
        );
    }

    return (
        <div className="section-container page-section animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar */}
                <aside className="lg:col-span-1 flex flex-col gap-8">
                    <div className="glass-card p-8 flex flex-col items-center text-center gap-4">
                        <div className="h-24 w-24 rounded-full bg-brand-600 flex items-center justify-center text-white text-3xl font-bold shadow-soft">
                            {user.name?.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-xl dark:text-white">{user.name}</h3>
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{user.role}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-brand-600 text-white shadow-soft' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'}`}
                        >
                            <Package size={20} />
                            My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-brand-600 text-white shadow-soft' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'}`}
                        >
                            <Settings size={20} />
                            Profile Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all mt-4"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    {activeTab === 'orders' ? (
                        <div className="flex flex-col gap-8">
                            <div className="flex justify-between items-center">
                                <h2 className="heading-md dark:text-white m-0">Recent Orders</h2>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{orders.length} Orders Total</span>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="animate-spin text-brand-600" size={32} />
                                </div>
                            ) : Array.isArray(orders) && orders.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="glass-card hover:border-brand-300 transition-all duration-300">
                                            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-100 dark:border-white/5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Order #{order.id}</span>
                                                    <span className="text-sm font-bold dark:text-white">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div className="flex flex-col items-end leading-tight">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Status</span>
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'text-green-600' : 'text-brand-600'}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-end leading-tight">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total</span>
                                                        <span className="text-lg font-bold dark:text-white">Rs. {parseFloat(order.totalAmount).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col gap-4">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-white/5">
                                                            <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/50'} className="h-full w-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-1 flex-col leading-tight">
                                                            <span className="text-sm font-bold dark:text-white line-clamp-1">{item.product?.name}</span>
                                                            <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex justify-end pt-2">
                                                    <button className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-widest">
                                                        Order Details <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-20 flex flex-col items-center text-center gap-4">
                                    <Clock size={48} className="text-gray-300" />
                                    <h3 className="font-bold dark:text-white">No orders yet</h3>
                                    <p className="text-sm text-gray-500">When you place an order, it will appear here for tracking.</p>
                                    <Link to="/products" className="btn-primary py-3 px-8 mt-2">Browse Services</Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10">
                            <div className="flex justify-between items-center">
                                <h2 className="heading-md dark:text-white m-0">Profile Information</h2>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] bg-brand-600/10 px-3 py-1 rounded-full">Member Since {new Date(user.createdAt).getFullYear()}</span>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => {
                                e.preventDefault();
                                toast.success('Profile update feature coming in next internal build');
                            }}>
                                <ProfileField label="Full Name" name="name" value={user.name} icon={<User size={20} />} readOnly />
                                <ProfileField label="Email Address" name="email" value={user.email} icon={<Mail size={20} />} readOnly />
                                <ProfileField label="Phone Number" name="phone" value={user.phone || ''} icon={<Phone size={20} />} placeholder="Enter phone" />
                                <ProfileField label="Shipping Address" name="address" value={typeof user.address === 'string' ? user.address : ''} icon={<MapPin size={20} />} placeholder="Street, City, Country" />
                                <div className="md:col-span-2 glass-card p-10 flex flex-col gap-6 bg-brand-600/5 border-brand-200/50">
                                    <h3 className="text-lg font-bold dark:text-white">Security & Account</h3>
                                    <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                                        Update your contact information to ensure smooth deliveries and order communications.
                                        Your password can be changed in the specialized security portal.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <button type="submit" className="btn-primary py-3 px-10 text-xs uppercase tracking-widest font-bold">
                                            Save Changes
                                        </button>
                                        <button type="button" className="btn-secondary py-3 px-10 text-xs uppercase tracking-widest font-bold" onClick={() => toast.error('Security verification required')}>
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const ProfileField = ({ label, name, value, icon, readOnly = false, placeholder }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-600">
                {icon}
            </div>
            <input
                type="text"
                name={name}
                defaultValue={value}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`input-field pl-12 ${readOnly ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-white/5' : ''}`}
            />
        </div>
    </div>
);

export default Profile;
