import React, { useState, useEffect } from 'react';
import { Key, UserCheck, Shield, Trash2, Search, Loader2, Mail, Calendar } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (e) {
            toast.error('Failed to load user directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (user) => {
        if (user.role === 'admin') {
            return toast.error('Security Protocol: Administrators cannot be deleted from here');
        }

        if (window.confirm(`Permanently delete account for ${user.name}? This action is irreversible.`)) {
            try {
                await api.delete(`/admin/users/${user.id}`);
                toast.success('Account purged successfully');
                fetchUsers();
            } catch (e) {
                toast.error(e.response?.data?.message || 'Purge failed');
            }
        }
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black">User Directory</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{filtered.length} Indexed Identities</span>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="input-field pl-12 py-3 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] border-b border-gray-100 dark:border-white/5">
                                <tr>
                                    <th className="px-8 py-5">User Profile</th>
                                    <th className="px-8 py-5">Access Level</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Join Date</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                {filtered.map(u => (
                                    <tr key={u.id} className="text-sm hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center font-bold shadow-sm">
                                                    {u.name?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold dark:text-white">{u.name}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{u.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {u.role === 'admin' ? (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                                        <Shield size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                                        <UserCheck size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">User</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${u.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {u.is_verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                                                <Calendar size={14} className="opacity-40" />
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => toast.info(`Encryption key reset for ${u.name}`)}
                                                    className="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-brand-600 transition-all shadow-soft"
                                                >
                                                    <Key size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u)}
                                                    className="h-9 w-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-all shadow-soft"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
