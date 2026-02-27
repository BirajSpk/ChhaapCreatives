import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Reset link sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="glass-card-lg max-w-md w-full p-10 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-brand-600 flex items-center gap-1 w-fit transition-colors">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                    <h1 className="heading-md dark:text-white mt-4">Forgot Password?</h1>
                    <p className="text-sm text-gray-500 italic">No worries, it happens. Enter your email and we'll send you a reset link.</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-12"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 shadow-brand-500/20 hover:shadow-brand-500/40"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <span className="flex items-center gap-2">Send Reset Link <Send size={18} /></span>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="bg-brand-50 dark:bg-brand-900/10 p-6 rounded-2xl border border-brand-100 dark:border-brand-800/50 flex flex-col gap-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center mx-auto">
                            <Mail size={24} />
                        </div>
                        <p className="text-sm text-brand-900 dark:text-brand-300 font-medium">
                            If an account is associated with <span className="font-bold">{email}</span>, you will receive a password reset link shortly.
                        </p>
                        <p className="text-xs text-brand-700/60 dark:text-brand-400/60 leading-relaxed">
                            Don't forget to check your spam folder if you don't see it in your inbox.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
