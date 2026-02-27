import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral dark:bg-neutral-dark border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/chhaapBlack.svg" alt="Chhaap Logo" className="h-10 dark:hidden" />
                            <img src="/chhaapWhite.svg" alt="Chhaap Logo" className="h-10 hidden dark:block" />
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                            Your premium destination for high-quality printing and aesthetic design services in Nepal. From stickers to NFC business cards, we bring your ideas to life.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <SocialIcon icon={<Facebook size={18} />} href="https://www.facebook.com/profile.php?id=61586908922625" />
                            <SocialIcon icon={<Instagram size={18} />} href="https://www.instagram.com/_bungaharu/" />
                            <SocialIcon icon={<Youtube size={18} />} href="https://youtube.com/@bungaharu?si=oksQfuo6h103p_gu" />
                            <a
                                href="https://www.tiktok.com/@_bungaharu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:hover:bg-brand-600 transition-all shadow-soft"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21,7H20a4,4,0,0,1-4-4H12V14.5a2.5,2.5,0,1,1-4-2V8.18a6.5,6.5,0,1,0,8,6.32V9.92A8,8,0,0,0,20,11h1Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Services</h4>
                        <ul className="flex flex-col gap-4">
                            <FooterLink to="/products?category=stickers">Stickers</FooterLink>
                            <FooterLink to="/products?category=banners">Flex & Banners</FooterLink>
                            <FooterLink to="/products?category=nfc">NFC Business Cards</FooterLink>
                            <FooterLink to="/products?category=design">Design Services</FooterLink>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-display font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Support</h4>
                        <ul className="flex flex-col gap-4">
                            <FooterLink to="/about">About Us</FooterLink>
                            <FooterLink to="/contact">Contact</FooterLink>
                            <FooterLink to="/blogs">Blog</FooterLink>
                            <FooterLink to="/privacy">Privacy Policy</FooterLink>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Contact Us</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Phone size={18} className="text-brand-600 mt-1 flex-shrink-0" />
                                <span>+977 9860184030</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Mail size={18} className="text-brand-600 mt-1 flex-shrink-0" />
                                <span>chhaapcreatives@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin size={18} className="text-brand-600 mt-1 flex-shrink-0" />
                                <span>Gokarneshwor-5, Jorpati, Kathmandu, Nepal</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        © {currentYear} Chhaap Creatives. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-xs text-gray-500">
                        <Link to="/terms" className="hover:text-brand-600 underline decoration-brand-600/30">Terms of Service</Link>
                        <p>Designed with love in Nepal</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <li>
        <Link
            to={to}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
            {children}
        </Link>
    </li>
);

const SocialIcon = ({ icon, href }) => (
    <a
        href={href}
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:hover:bg-brand-600 transition-all shadow-soft"
    >
        {icon}
    </a>
);

export default Footer;
