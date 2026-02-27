import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <ThemeProvider>

                <AuthProvider>
                    <CartProvider>
                        <AppRoutes />
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                className: 'glass-card text-sm font-medium',
                                style: {
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    color: '#333',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#d4692e',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
