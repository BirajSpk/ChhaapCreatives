import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login: setAuthUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        /* Clear error when user types */
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            /* Validate with Zod */
            loginSchema.parse(formData);

            const response = await api.post('/auth/login', formData);

            if (response.data.success) {
                /* Store token for authenticated requests */
                if (response.data.data.accessToken) {
                    localStorage.setItem('token', response.data.data.accessToken);
                }
                setAuthUser(response.data.data.user);
                toast.success('Welcome back to Chhaap Creatives!');
                navigate('/');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = {};
                error.errors.forEach(err => {
                    formattedErrors[err.path[0]] = err.message;
                });
                setErrors(formattedErrors);
            } else {
                const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
                toast.error(message);
                setErrors({ general: message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-md w-full glass-card-lg p-10 flex flex-col gap-8">
                <div className="text-center flex flex-col gap-3">
                    <h2 className="heading-md dark:text-white">Welcome Back</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Log in to access your custom designs and orders.
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                            <AlertCircle size={18} />
                            {errors.general}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                className={`input-field pl-12 ${errors.email ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && <span className="text-xs text-red-500 ml-1 mt-0.5">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
                            <Link to="/forgot-password" size="sm" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className={`input-field pl-12 ${errors.password ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.password && <span className="text-xs text-red-500 ml-1 mt-0.5">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-4 mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <LogIn size={20} className="mr-2" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
