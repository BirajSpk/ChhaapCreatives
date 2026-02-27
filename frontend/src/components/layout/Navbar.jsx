import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Sun, Moon, Search, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { cartItems } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* Close mobile menu and search on route change */
    useEffect(() => {
        setIsOpen(false);
        setIsSearchOpen(false);
    }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'py-2 px-4 sm:px-8'
            : 'py-4 px-4 sm:px-10'
            }`}>
            <div className={`max-w-7xl mx-auto rounded-glass-lg transition-all duration-300 border border-white/20 dark:border-white/10 ${scrolled
                ? 'bg-white/70 dark:bg-black/70 backdrop-blur-glass shadow-glass'
                : 'bg-white/40 dark:bg-black/40 backdrop-blur-sm'
                }`}>
                <div className="flex items-center justify-between px-6 py-3">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src={theme === 'dark' ? '/chhaapWhite.svg' : '/chhaapBlack.svg'}
                            alt="Chhaap Logo"
                            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="flex flex-col leading-none">
                            <span className={`text-xl font-display font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'
                                }`}>
                                Chhaap
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-700">
                                Creatives
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/products">Products</NavLink>
                        <NavLink to="/services">Services</NavLink>
                        <NavLink to="/blogs">Blog</NavLink>
                        <NavLink to="/about">About Us</NavLink>
                        <NavLink to="/track-order">Track Order</NavLink>
                        <NavLink to="/contact">Contact</NavLink>
                        {user?.role === 'admin' && (
                            <NavLink to="/admin">Admin</NavLink>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`p-2 transition-colors ${isSearchOpen ? 'text-brand-600' : 'text-gray-600 dark:text-gray-300 hover:text-brand-600'}`}
                        >
                            {isSearchOpen ? <X size={22} /> : <Search size={22} />}
                        </button>
                        <Link to="/cart" className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors relative">
                            <ShoppingCart size={22} />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                        </button>
                        <div className="h-6 w-[1px] bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block"></div>
                        <Link
                            to={user ? '/profile' : '/login'}
                            className="hidden sm:flex items-center gap-2 py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-soft"
                        >
                            <User size={18} />
                            <span className="text-sm font-medium">{user ? 'Profile' : 'Login'}</span>
                        </Link>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Search Overlay */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSearchOpen ? 'max-h-24 opacity-100 border-t border-white/20 dark:border-white/10' : 'max-h-0 opacity-0'}`}>
                    <form onSubmit={handleSearch} className="px-10 py-4 flex items-center gap-4">
                        <Search className="text-gray-400" size={18} />
                        <input
                            type="text"
                            autoFocus={isSearchOpen}
                            placeholder="Search for premium stickers, banners, NFC cards..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full dark:text-white placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 hover:text-brand-700">Find Now</button>
                    </form>
                </div>

                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[80vh] border-t border-white/20 dark:border-white/10 overflow-y-auto' : 'max-h-0'
                    }`}>
                    <div className="flex flex-col p-4 gap-1">
                        <MobileNavLink to="/">Home</MobileNavLink>
                        <MobileNavLink to="/products">Products</MobileNavLink>
                        <MobileNavLink to="/services">Services</MobileNavLink>
                        <MobileNavLink to="/blogs">Blog</MobileNavLink>
                        <MobileNavLink to="/about">About Us</MobileNavLink>
                        <MobileNavLink to="/track-order">Track Order</MobileNavLink>
                        <MobileNavLink to="/contact">Contact</MobileNavLink>
                        {user?.role === 'admin' && (
                            <MobileNavLink to="/admin">Admin Panel</MobileNavLink>
                        )}
                        <div className="pt-4 sm:hidden">
                            <Link to={user ? '/profile' : '/login'} className="flex items-center justify-center gap-2 py-3 w-full rounded-xl bg-brand-600 text-white font-medium">
                                <User size={18} />
                                {user ? 'Profile' : 'Login / Register'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link
        to={to}
        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors relative group py-2"
    >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
);

const MobileNavLink = ({ to, children }) => (
    <Link
        to={to}
        className="py-3 px-4 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/20 text-gray-700 dark:text-gray-200 font-medium transition-colors"
    >
        {children}
    </Link>
);

export default Navbar;
