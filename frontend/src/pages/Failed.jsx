import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from 'lucide-react';

const Failed = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
            <div className="glass-card-lg max-w-xl w-full p-12 flex flex-col items-center gap-8 animate-scale-in">
                <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center">
                    <XCircle size={56} />
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="heading-md dark:text-white">Transaction Failed</h1>
                    <p className="text-gray-500 leading-relaxed">
                        We couldn't process your payment at this time. This could be due to a connection issue or a declined card.
                    </p>
                </div>

                <div className="w-full bg-red-600/5 dark:bg-red-900/10 rounded-2xl p-6 flex flex-col gap-4 border border-red-100 dark:border-red-900/20">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">
                        Don't worry, no funds were deducted. You can try again or choose Cash on Delivery.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 w-full">
                    <Link to="/checkout" className="btn-primary flex-1 py-4">
                        Try Again <RefreshCw size={18} className="ml-2" />
                    </Link>
                    <a href="https://wa.me/9860184030" target="_blank" className="btn-secondary flex-1 py-4 flex items-center justify-center gap-2">
                        <MessageCircle size={18} /> Support
                    </a>
                </div>

                <Link to="/cart" className="text-sm font-bold text-gray-400 hover:text-brand-600 flex items-center gap-2 transition-all">
                    <ArrowLeft size={16} /> Return to Cart
                </Link>
            </div>
        </div>
    );
};

export default Failed;
