import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Home, Phone, User, MapPin, Truck, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: '',
        paymentMethod: 'cod'
    });
    const navigate = useNavigate();

    if (!user) return <Navigate to="/login?redirect=checkout" />;
    if (cartItems.length === 0) return <Navigate to="/products" />;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const orderData = {
                shippingAddress: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city
                },
                paymentMethod: formData.paymentMethod,
                items: cartItems
            };

            const res = await api.post('/orders', orderData);

            if (res.data.success) {
                toast.success('Order placed successfully!');
                clearCart();
                navigate('/profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="section-container page-section animate-fade-in">
            <h1 className="heading-lg dark:text-white mb-12">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Shipping Info */}
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-brand-600">
                            <Truck size={24} />
                            <h2 className="heading-sm dark:text-white m-0">Shipping Information</h2>
                        </div>
                        <p className="text-gray-500 text-sm">Please provide accurate delivery details for your custom prints.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field pl-12"
                                    placeholder="Recipient Name"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field pl-12"
                                    placeholder="98XXXXXXXX"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">City</label>
                                <div className="relative">
                                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="input-field pl-12"
                                        placeholder="Kathmandu"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Specific Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="input-field pl-12"
                                        placeholder="Tol, House No, Landmark"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex flex-col gap-6 pt-10 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 text-brand-600">
                            <ShieldCheck size={24} />
                            <h2 className="heading-sm dark:text-white m-0">Payment Method</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${formData.paymentMethod === 'cod' ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/20' : 'border-gray-100 dark:border-white/10 opacity-60'}`}
                                onClick={() => setFormData(p => ({ ...p, paymentMethod: 'cod' }))}
                            >
                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-brand-600 px-1' : 'border-gray-300'}`}>
                                    {formData.paymentMethod === 'cod' && <div className="h-2.5 w-2.5 rounded-full bg-brand-600"></div>}
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="font-bold dark:text-white">Cash on Delivery</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Pay at your doorstep</span>
                                </div>
                            </button>
                            <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 dark:border-white/10 opacity-30 cursor-not-allowed">
                                <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="font-bold dark:text-white italic">Online Payment</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Coming Soon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Review */}
                <div className="flex flex-col gap-8">
                    <div className="glass-card p-10 flex flex-col gap-8 sticky top-32">
                        <h2 className="heading-sm dark:text-white">Order Review</h2>

                        <div className="flex flex-col gap-6 max-h-[300px] overflow-y-auto pr-4 scrollbar-thin">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.variantId}`} className="flex gap-4 items-center">
                                    <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex flex-col flex-1 leading-tight">
                                        <span className="font-bold text-sm dark:text-white line-clamp-1">{item.name}</span>
                                        <span className="text-[10px] text-gray-500 font-medium">Qty: {item.quantity} • {item.variant?.size || 'Standard'}</span>
                                    </div>
                                    <span className="font-bold text-sm dark:text-white">
                                        Rs. {((parseFloat(item.basePrice) + (item.variant?.priceModifier || 0)) * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-white/5 my-2"></div>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium dark:text-white">Rs. {totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Shipping (Kathmandu Area)</span>
                                <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free Delivery</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-bold dark:text-white">Total Amount</span>
                                <span className="text-2xl font-display font-bold text-brand-600">Rs. {totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-4 gap-2 text-lg shadow-glass-lg"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Confirm Order
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            <ShieldCheck size={14} className="text-green-500" />
                            Secure multi-phase order verification
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
