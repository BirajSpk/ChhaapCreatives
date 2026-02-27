import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await api.get(`/auth/verify-email/${token}`);
                if (res.data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                setStatus('error');
            }
        };
        verifyToken();
    }, [token]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="glass-card-lg max-w-md w-full p-12 flex flex-col items-center text-center gap-6">
                {status === 'verifying' && (
                    <>
                        <Loader2 className="animate-spin text-brand-600" size={48} />
                        <h2 className="heading-md dark:text-white">Verifying your email</h2>
                        <p className="text-gray-500">Please wait while we confirm your email address...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="heading-md dark:text-white">Email Verified!</h2>
                        <p className="text-gray-500 leading-relaxed">
                            Your email has been successfully verified. You can now access all features of Chhaap Creatives.
                        </p>
                        <Link to="/login" className="btn-primary w-full mt-4">
                            Proceed to Login <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center">
                            <XCircle size={40} />
                        </div>
                        <h2 className="heading-md dark:text-white">Verification Failed</h2>
                        <p className="text-gray-500">
                            The verification link is invalid or has expired. Please try logging in to request a new one.
                        </p>
                        <Link to="/login" className="btn-secondary w-full mt-4">
                            Back to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
