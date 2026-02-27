import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
    const { user } = useAuth();

    if (cartItems.length === 0) {
        return (
            <div className="section-container page-section animate-fade-in flex flex-col items-center justify-center text-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                    <ShoppingBag size={48} />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="heading-md dark:text-white">Your cart is empty</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">Looks like you haven't added any premium prints to your cart yet.</p>
                </div>
                <Link to="/products" className="btn-primary py-3 px-8 mt-2">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="section-container page-section animate-fade-in">
            <h1 className="heading-lg dark:text-white mb-10">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {cartItems.map((item) => (
                        <div key={`${item.id}-${item.variantId}`} className="glass-card p-6 flex flex-col sm:flex-row gap-6 relative group overflow-hidden">
                            <div className="h-32 w-32 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={item.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col flex-1 gap-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-lg dark:text-white">{item.name}</h3>
                                        {item.variant && (
                                            <span className="text-xs text-brand-600 font-medium">
                                                {item.variant.size} • {item.variant.quality} • {item.variant.lamination}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.variantId)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="mt-auto flex justify-between items-end">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Quantity</span>
                                        <div className="flex items-center gap-3 p-1 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/10 shadow-sm transition-all dark:text-white"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold min-w-[20px] text-center dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/10 shadow-sm transition-all dark:text-white"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-sm text-gray-400 block mb-0.5">Subtotal</span>
                                        <span className="text-xl font-bold dark:text-white">
                                            Rs. {((parseFloat(item.basePrice) + (item.variant?.priceModifier || 0)) * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-10 flex flex-col gap-8 sticky top-32 border-brand-200/30 dark:border-brand-800/20">
                        <h2 className="heading-sm dark:text-white">Order Summary</h2>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Subtotal ({cartItems.length} items)</span>
                                <span className="font-medium dark:text-white">Rs. {totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                                <span className="text-green-600 font-bold uppercase tracking-wider text-xs">Calculated at checkout</span>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-white/5 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold dark:text-white">Total</span>
                                <span className="text-2xl font-display font-bold text-brand-600">Rs. {totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Link
                                to={user ? "/checkout" : "/login?redirect=checkout"}
                                className="btn-primary w-full py-4 gap-2"
                            >
                                <CreditCard size={20} />
                                Proceed to Checkout
                            </Link>
                            <Link to="/products" className="text-center text-sm font-bold text-gray-500 hover:text-brand-600 transition-colors py-2">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
