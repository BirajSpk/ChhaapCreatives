import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { PasswordInput } from '../../components/inputs/PasswordInput';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (form.password.length < 8) {
            return toast.error('Password must be at least 8 characters');
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password: form.password });
            toast.success('Password reset successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-6">
                <div className="glass-card p-10 text-center">
                    <h2 className="heading-md dark:text-white">Invalid Request</h2>
                    <p className="text-gray-500 mt-2">Missing reset token.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="glass-card-lg max-w-md w-full p-10 flex flex-col gap-8">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="heading-md dark:text-white">New Password</h1>
                    <p className="text-sm text-gray-500">Create a secure password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <PasswordInput
                        name="password"
                        placeholder="••••••••"
                        label="New Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        icon={Lock}
                        disabled={loading}
                    />

                    <PasswordInput
                        name="confirmPassword"
                        placeholder="••••••••"
                        label="Confirm Password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        icon={Lock}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
