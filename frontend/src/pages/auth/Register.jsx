import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Phone, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../../components/inputs/PasswordInput';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number').optional().or(z.literal('')),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain one uppercase letter')
        .regex(/[0-9]/, 'Must contain one number'),
    confirmPassword: z.string(),
    rememberMe: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login: setAuthUser, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/profile', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: fieldValue }));
        const fieldName = name === 'confirmPassword' ? 'confirmPassword' : name;
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            registerSchema.parse(formData);

            const { confirmPassword, ...registerData } = formData;
            const response = await api.post('/auth/register', registerData);

            if (response.data.success) {
                /* Store token for authenticated requests */
                if (response.data.data.accessToken) {
                    localStorage.setItem('token', response.data.data.accessToken);
                }
                setAuthUser(response.data.data.user, formData.rememberMe);
                toast.success('Welcome to Chhaap Creatives! Your account is ready.');
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
                const message = error.response?.data?.message || 'Registration failed. Email might already be taken.';
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
                    <h2 className="heading-md dark:text-white">Join Chhaap</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Create an account to start designing and ordering premium prints.
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                            <AlertCircle size={18} />
                            {errors.general}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5">
                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className={`input-field pl-12 ${errors.name ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && <span className="text-xs text-red-500 ml-1 mt-0.5">{errors.name}</span>}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className={`input-field pl-12 ${errors.email ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && <span className="text-xs text-red-500 ml-1 mt-0.5">{errors.email}</span>}
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Phone (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="98XXXXXXXX"
                                    className={`input-field pl-12 ${errors.phone ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.phone && <span className="text-xs text-red-500 ml-1 mt-0.5">{errors.phone}</span>}
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <PasswordInput
                                    name="password"
                                    placeholder="••••••••"
                                    label="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    disabled={isLoading}
                                />
                                {/* Strength Meter */}
                                {formData.password && (
                                    <div className="mt-2 flex flex-col gap-1.5">
                                        <div className="flex gap-1 h-1">
                                            {[1, 2, 3].map((step) => {
                                                const strength = formData.password.length < 6 ? 1 : (formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)) ? 3 : 2;
                                                return (
                                                    <div
                                                        key={step}
                                                        className={`flex-1 rounded-full transition-all duration-500 ${step <= strength ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-200 dark:bg-white/10'}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            {formData.password.length < 6 ? 'Too Weak' : (formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)) ? 'Strong Security' : 'Medium Strength'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <PasswordInput
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    label="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={errors.confirmPassword}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                            Keep me signed in for 30 days
                        </label>
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
                                <UserPlus size={20} className="mr-2" />
                                Register Now
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
                            Log in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
