import React from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    Users,
    FileText,
    Settings,
    LogOut,
    TrendingUp,
    CreditCard,
    List,
    MousePointer2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    /* Protect Admin routes */
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-[#f8f6f4] dark:bg-[#0c0a0a] flex text-gray-900 dark:text-gray-100 relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[199] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Admin Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-[200] w-64 border-r border-gray-200 dark:border-white/5  
                bg-white dark:bg-black/40 backdrop-blur-xl flex flex-col h-screen 
                transition-all duration-300 lg:sticky lg:w-64 lg:left-0 lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-8 flex items-center justify-between">
                    <span className="font-display font-black text-2xl tracking-tighter italic">
                        CHHAAP <span className="text-brand-600 block text-xs tracking-[0.4em] not-italic mt-1 uppercase opacity-60">Admin Console</span>
                    </span>
                    <button className="lg:hidden p-2 text-gray-400" onClick={() => setIsSidebarOpen(false)}>
                        <LogOut size={20} className="rotate-180" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
                    <AdminNavLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" end onClick={() => setIsSidebarOpen(false)} />
                    <AdminNavLink to="/admin/orders" icon={<ShoppingBag size={20} />} label="Orders" onClick={() => setIsSidebarOpen(false)} />
                    <AdminNavLink to="/admin/products" icon={<Layers size={20} />} label="Products" onClick={() => setIsSidebarOpen(false)} />
                    <AdminNavLink to="/admin/services" icon={<MousePointer2 size={20} />} label="Services" onClick={() => setIsSidebarOpen(false)} />
                    <AdminNavLink to="/admin/categories" icon={<List size={20} />} label="Categories" onClick={() => setIsSidebarOpen(false)} />
                    <AdminNavLink to="/admin/users" icon={<Users size={20} />} label="Users" onClick={() => setIsSidebarOpen(false)} />
                    <AdminNavLink to="/admin/blogs" icon={<FileText size={20} />} label="Blogs" onClick={() => setIsSidebarOpen(false)} />
                    <div className="h-px bg-gray-100 dark:bg-white/5 my-4 mx-4"></div>
                    <AdminNavLink to="/admin/settings" icon={<Settings size={20} />} label="Config" onClick={() => setIsSidebarOpen(false)} />
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={() => {
                            logout();
                            setIsSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                    >
                        <LogOut size={20} />
                        Exit Admin
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                <header className="h-20 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-[100]">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-brand-600 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <List size={24} />
                        </button>
                        <h2 className="font-bold text-sm lg:text-lg uppercase tracking-widest text-gray-400 line-clamp-1">Management Panel</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-bold">{user.name}</span>
                            <span className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">Administrator</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold ring-4 ring-brand-500/10">
                            {user.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const AdminNavLink = ({ to, icon, label, end, onClick }) => (
    <NavLink
        to={to}
        end={end}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all ${isActive
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`
        }
    >
        {icon}
        {label}
    </NavLink>
);

export default AdminLayout;
