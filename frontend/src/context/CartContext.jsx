import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, variant, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item =>
                item.id === product.id &&
                (!variant || item.variantId === variant.id)
            );

            if (existing) {
                return prev.map(item =>
                    item.id === product.id && (!variant || item.variantId === variant.id)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prev, {
                ...product,
                variantId: variant?.id,
                variant,
                quantity
            }];
        });
    };

    const removeFromCart = (id, variantId) => {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.variantId === variantId)));
    };

    const updateQuantity = (id, variantId, quantity) => {
        setCartItems(prev => prev.map(item =>
            item.id === id && item.variantId === variantId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
        ));
    };

    const clearCart = () => setCartItems([]);

    const totalAmount = cartItems.reduce((acc, item) =>
        acc + (parseFloat(item.basePrice) + (item.variant?.priceModifier || 0)) * item.quantity, 0
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
