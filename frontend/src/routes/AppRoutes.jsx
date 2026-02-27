import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

/* Pages */
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Products from '../pages/Products';
import Services from '../pages/Services';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Profile from '../pages/Profile';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import BlogList from '../pages/BlogList';
import BlogDetail from '../pages/BlogDetail';
import About from '../pages/About';
import Contact from '../pages/Contact';
import OrderTracking from '../pages/OrderTracking';
import Success from '../pages/Success';
import Failed from '../pages/Failed';
import NFCProfilePublic from '../pages/NFCProfilePublic';

/* Admin Pages */
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/AdminDashboard';
import AdminOrders from '../pages/AdminOrders';
import AdminProducts from '../pages/AdminProducts';
import AdminCategories from '../pages/AdminCategories';
import AdminUsers from '../pages/AdminUsers';
import AdminBlogs from '../pages/AdminBlogs';
import AdminSettings from '../pages/AdminSettings';

const NotFound = () => (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
        <h1 className="text-9xl font-black text-brand-600/20 dark:text-brand-400/10">404</h1>
        <div className="flex flex-col gap-4 -mt-10">
            <h2 className="heading-md dark:text-white">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="btn-primary mt-4 self-center">
                Go Home
            </Link>
        </div>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:slug" element={<ProductDetail />} />
                <Route path="services" element={<Services />} />
                <Route path="services/:slug" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="profile" element={<Profile />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="verify-email/:token" element={<VerifyEmail />} />

                <Route path="blogs" element={<BlogList />} />
                <Route path="blogs/:slug" element={<BlogDetail />} />

                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="track-order" element={<OrderTracking />} />

                <Route path="order-success" element={<Success />} />
                <Route path="order-failed" element={<Failed />} />

                <Route path="nfc/:slug" element={<NFCProfilePublic />} />

                {/* Admin Routes */}
                <Route path="admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Placeholder for future routes */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

/* Internal placeholder for Link helper in NotFound */
import { Link } from 'react-router-dom';

export default AppRoutes;
