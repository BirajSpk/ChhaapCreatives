import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const Success = () => {
    const { orderId } = useParams(); /* Optional if passed in URL */

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6">
            <div className="glass-card-lg max-w-xl w-full p-12 flex flex-col items-center text-center gap-8 animate-scale-in">
                <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                    <CheckCircle size={56} />
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="heading-md dark:text-white">Order Placed Successfully!</h1>
                    <p className="text-gray-500 leading-relaxed">
                        Thank you for choosing Chhaap Creatives. Your order has been received and is now being processed by our team.
                    </p>
                </div>

                <div className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">What's Next?</span>
                    </div>
                    <div className="flex flex-col gap-4 text-left">
                        <Step icon={<Package />} text="We will verify your custom design files if provided." />
                        <Step icon={<ShoppingBag />} text="You will receive updates via email on order status." />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 w-full">
                    <Link to="/profile" className="btn-primary flex-1 py-4">
                        View My Orders <ArrowRight size={18} className="ml-2" />
                    </Link>
                    <Link to="/products" className="btn-secondary flex-1 py-4">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Step = ({ icon, text }) => (
    <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-brand-600 shadow-soft flex-shrink-0">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <p className="text-sm font-medium dark:text-gray-300">{text}</p>
    </div>
);

export default Success;
