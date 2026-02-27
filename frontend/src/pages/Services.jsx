import React from 'react';
import { Link } from 'react-router-dom';
import { MousePointer2, Maximize, Frame, ArrowRight, Upload, Palette } from 'lucide-react';

const Services = () => {
    return (
        <div className="section-container pb-20 pt-4 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col gap-4 mb-16 text-center max-w-2xl mx-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-600">Customization Hub</span>
                <h1 className="heading-lg dark:text-white">Print Your Vision</h1>
                <p className="text-gray-500 dark:text-gray-400">Professional custom print services with live interactive previews and precision manufacturing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Custom Stickers */}
                <ServiceTile
                    icon={<MousePointer2 size={24} />}
                    title="Custom Stickers"
                    description="Upload your artwork and choose from our precise size matrix. Available in Glossy, Matte, and Transparent finishes."
                    features={['35mm - 90mm options', 'Live Preview', 'Bulk Discounts']}
                    link="/services/custom-stickers"
                    badge="Most Popular"
                    color="bg-brand-600"
                />

                {/* Custom Flex */}
                <ServiceTile
                    icon={<Maximize size={24} />}
                    title="Custom Flex Printing"
                    description="Large scale banner printing for events and businesses. Durable material with vibrant UV-stable inks."
                    features={['Any Custom Size', 'Durable Material', 'Next-Day Delivery']}
                    link="/services/custom-flex"
                    color="bg-blue-600"
                />

                {/* Custom Frames */}
                <ServiceTile
                    icon={<Frame size={24} />}
                    title="Custom Frames"
                    description="Elegant minimal black frames for your photos. Upload your design, and we'll handle the assembly."
                    features={['Minimal Black Style', 'Fixed Design', 'Ready-to-hang']}
                    link="/services/custom-frames"
                    color="bg-neutral-900"
                />
            </div>

            {/* Quality Section */}
            <div className="mt-32 p-12 glass-card-lg flex flex-col md:flex-row items-center gap-12 border-brand-100/20">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-600/20">
                        <Palette size={24} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="heading-md dark:text-white">Professional Color Grading</h2>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Our advanced logic ensures your designs are printed with 99.9% color accuracy. We use industrial-grade CMYK+ processors for every custom order.</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600">
                            <Upload size={14} /> High-Speed Upload
                        </div>
                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600">
                            Vector Ready Support
                        </div>
                    </div>
                </div>
                <div className="flex-1 h-64 w-full bg-gray-100 dark:bg-white/5 rounded-3xl overflow-hidden relative">
                    <img
                        src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800"
                        alt="Quality Print"
                        className="h-full w-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 dark:from-black/40 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

const ServiceTile = ({ icon, title, description, features, link, badge, color }) => (
    <div className="glass-card group flex flex-col p-8 hover:-translate-y-2 transition-all duration-500 border-white/40 dark:border-white/5 shadow-soft hover:shadow-glass-lg">
        <div className={`h-16 w-16 rounded-2xl ${color} flex items-center justify-center text-white mb-8 shadow-xl relative`}>
            {icon}
            {badge && (
                <span className="absolute -top-3 -right-3 px-3 py-1 bg-yellow-400 text-black text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {badge}
                </span>
            )}
        </div>

        <div className="flex flex-col gap-4 flex-1">
            <h3 className="heading-sm dark:text-white group-hover:text-brand-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
            </p>

            <ul className="flex flex-col gap-3 mt-4">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-600"></div>
                        {f}
                    </li>
                ))}
            </ul>
        </div>

        <Link to={link} className="btn-primary py-4 px-8 mt-10 w-full flex items-center justify-center gap-3 group-hover:shadow-brand-600/30">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Start Configuring</span>
            <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
        </Link>
    </div>
);

export default Services;
