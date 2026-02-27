import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ArrowLeft } from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-20 relative">
                {!isHome && (
                    <div className="section-container">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 group text-gray-400 hover:text-brand-600 transition-colors pt-4 pb-2"
                        >
                            <div className="h-9 w-9 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-soft group-hover:shadow-md transition-all">
                                <ArrowLeft size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Go Back</span>
                        </button>
                    </div>
                )}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
