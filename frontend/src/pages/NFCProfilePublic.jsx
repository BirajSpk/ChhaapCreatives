import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Mail, Globe, MapPin, Share2, Download, ExternalLink, Loader2 } from 'lucide-react';
import api from '../services/api';

const NFCProfilePublic = () => {
    const { slug } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/nfc/public/${slug}`);
                if (res.data.success) setProfile(res.data.data);
                else setError(true);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-light dark:bg-neutral-dark">
                <Loader2 className="animate-spin text-brand-600" size={40} />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 text-center bg-neutral-light dark:bg-neutral-dark">
                <div className="glass-card p-10 max-w-md">
                    <h1 className="heading-md dark:text-white text-red-600">Profile Not Found</h1>
                    <p className="text-gray-500 mt-4 leading-relaxed">The NFC business card link you followed is invalid or has been deactivated.</p>
                </div>
            </div>
        );
    }

    const { fullName, designation, phone, email, profileImage, links, themeSettings } = profile;
    const primaryColor = themeSettings?.primaryColor || '#c45320';

    return (
        <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark pb-20 font-sans">
            {/* Aesthetic Header */}
            <div className={`h-48 w-full bg-gradient-to-br from-brand-600 to-brown-900 relative`}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
            </div>

            {/* Profile Info */}
            <div className="max-w-md mx-auto px-6 -mt-20 relative z-10 flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-32 w-32 rounded-full border-[6px] border-neutral-light dark:border-neutral-dark shadow-2xl overflow-hidden bg-white">
                        <img
                            src={profileImage || 'https://via.placeholder.com/200'}
                            className="h-full w-full object-cover"
                            alt={fullName}
                        />
                    </div>
                    <div className="text-center flex flex-col gap-1">
                        <h1 className="text-3vw font-black dark:text-white leading-tight" style={{ fontSize: '1.8rem' }}>{fullName}</h1>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{designation}</p>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-3 gap-6 w-full">
                    <ActionButton icon={<Phone size={24} />} label="Call" link={`tel:${phone}`} color={primaryColor} />
                    <ActionButton icon={<Mail size={24} />} label="Email" link={`mailto:${email}`} color={primaryColor} />
                    <ActionButton icon={<Share2 size={24} />} label="Share" onClick={() => navigator.share?.({ title: fullName, url: window.location.href })} color={primaryColor} />
                </div>

                {/* Links Section */}
                <div className="flex flex-col gap-4 w-full">
                    {links?.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-card p-5 flex items-center justify-between group hover:scale-[1.02] active:scale-[0.98] transition-all border-l-4"
                            style={{ borderLeftColor: primaryColor }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                                    <Globe size={20} />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-200">{link.label}</span>
                            </div>
                            <ExternalLink size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))}
                </div>

                {/* Footer Branding */}
                <div className="flex flex-col items-center gap-4 pt-10 mt-10 border-t border-gray-200 dark:border-white/5 w-full opacity-50">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Powered by</p>
                    <span className="font-display font-black text-xl tracking-tighter dark:text-white italic">
                        CHHAAP <span className="text-brand-600">CREATIVES</span>
                    </span>
                    <button className="text-[10px] font-bold text-brand-600 hover:underline">Get your Smart Business Card</button>
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ icon, label, link, onClick, color }) => (
    <a
        href={link}
        onClick={onClick}
        className="flex flex-col items-center gap-2 group"
    >
        <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 active:scale-95 transition-all"
            style={{ backgroundColor: color }}
        >
            {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</span>
    </a>
);

export default NFCProfilePublic;
