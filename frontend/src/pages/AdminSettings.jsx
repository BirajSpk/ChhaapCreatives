import React, { useState, useEffect } from 'react';
import { Settings, Save, Globe, Shield, Bell, Loader2, DollarSign, Truck } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        storeName: '',
        contactEmail: '',
        contactPhone: '',
        taxRate: 0,
        shippingFee: 0,
        minFreeShipping: 0,
        currency: 'Rs.',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/admin/settings');
                if (res.data.success) {
                    setSettings(prev => ({ ...prev, ...res.data.data }));
                }
            } catch (e) {
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch('/admin/settings', settings);
            toast.success('System configuration synchronized');
        } catch (e) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>;

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black">System Configuration</h1>
                <button
                    disabled={saving}
                    className="btn-primary py-3 px-8 flex items-center gap-2 text-sm disabled:opacity-50"
                    onClick={handleSave}
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Deploy Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="glass-card p-8 flex flex-col gap-8">
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                        <Globe size={18} className="text-brand-600" />
                        <h3 className="font-bold dark:text-white uppercase tracking-widest text-xs">Storefront</h3>
                    </div>

                    <div className="flex flex-col gap-5">
                        <SettingField label="Store Name" value={settings.storeName} onChange={val => setSettings({ ...settings, storeName: val })} />
                        <SettingField label="Contact Email" value={settings.contactEmail} onChange={val => setSettings({ ...settings, contactEmail: val })} />
                        <SettingField label="Contact Phone" value={settings.contactPhone} onChange={val => setSettings({ ...settings, contactPhone: val })} />
                    </div>
                </div>

                {/* Financial & Logistics */}
                <div className="glass-card p-8 flex flex-col gap-8">
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                        <DollarSign size={18} className="text-green-600" />
                        <h3 className="font-bold dark:text-white uppercase tracking-widest text-xs">Pricing & Logistics</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SettingField label="Tax Rate (%)" type="number" value={settings.taxRate} onChange={val => setSettings({ ...settings, taxRate: parseFloat(val) })} />
                        <SettingField label="Standard Shipping" type="number" value={settings.shippingFee} onChange={val => setSettings({ ...settings, shippingFee: parseFloat(val) })} />
                        <SettingField label="Free Shipping Above" type="number" value={settings.minFreeShipping} onChange={val => setSettings({ ...settings, minFreeShipping: parseFloat(val) })} />
                        <SettingField label="Currency Symbol" value={settings.currency} onChange={val => setSettings({ ...settings, currency: val })} />
                    </div>
                </div>

                {/* Security (Simplified) */}
                <div className="glass-card p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                        <Shield size={18} className="text-brand-600" />
                        <h3 className="font-bold dark:text-white uppercase tracking-widest text-xs">Security Control</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold dark:text-gray-300 uppercase tracking-widest">User Registration</span>
                            <div className="h-5 w-10 rounded-full bg-brand-600 relative flex items-center justify-end px-1 cursor-pointer">
                                <div className="h-3 w-3 rounded-full bg-white shadow-md"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                            <span className="text-xs font-bold dark:text-gray-300 uppercase tracking-widest">Public API Access</span>
                            <div className="h-5 w-10 rounded-full bg-gray-200 dark:bg-white/10 relative flex items-center justify-start px-1">
                                <div className="h-3 w-3 rounded-full bg-white shadow-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingField = ({ label, value, onChange, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-field py-2.5 text-sm"
        />
    </div>
);

export default AdminSettings;
