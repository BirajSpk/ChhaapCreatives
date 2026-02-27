import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
    const handleWhatsApp = () => {
        window.open('https://wa.me/9860184030', '_blank');
    };

    return (
        <div className="section-container pb-20 pt-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Contact Info */}
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <h1 className="heading-lg dark:text-white">Get in Touch</h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md italic">
                            Have a custom design request? Or just want to say hi? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <ContactItem
                            icon={<Phone />}
                            label="Call Us"
                            value="+977 9860184030"
                            link="tel:9860184030"
                        />
                        <ContactItem
                            icon={<Mail />}
                            label="Email Us"
                            value="chhaapcreatives@gmail.com"
                            link="mailto:chhaapcreatives@gmail.com"
                        />
                        <ContactItem
                            icon={<MapPin />}
                            label="Our Studio"
                            value="Gokarneshwor-5, Jorpati, Kathmandu, Nepal"
                            link="https://www.google.com/maps"
                        />
                    </div>

                    <div className="glass-card p-8 flex flex-col gap-6">
                        <h3 className="font-bold text-lg dark:text-white">Ready to start?</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            For rapid response and instant support, chat with our team directly on WhatsApp.
                        </p>
                        <button
                            onClick={handleWhatsApp}
                            className="bg-[#25D366] hover:bg-[#20ba56] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#25D366]/30"
                        >
                            <MessageCircle size={20} />
                            Chat on WhatsApp
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="glass-card-lg p-10">
                    <form className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Name</label>
                                <input type="text" className="input-field" placeholder="John Doe" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
                                <input type="email" className="input-field" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                            <input type="text" className="input-field" placeholder="Custom Sticker Request" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Message</label>
                            <textarea rows="5" className="input-field py-4" placeholder="Tell us more about your project..."></textarea>
                        </div>
                        <button type="submit" className="btn-primary py-4">
                            Send Message <Send size={18} className="ml-2" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, label, value, link }) => (
    <a href={link} target={link.startsWith('http') ? '_blank' : '_self'} className="flex items-center gap-4 group">
        <div className="h-12 w-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-brand-600 flex items-center justify-center shadow-soft group-hover:bg-brand-600 group-hover:text-white transition-all">
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</span>
            <span className="text-sm font-bold dark:text-white group-hover:text-brand-600 transition-colors">{value}</span>
        </div>
    </a>
);

export default Contact;
