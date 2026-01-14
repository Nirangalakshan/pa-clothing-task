import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        try {
            const data = await cartAPI.get();
            setCart(data || { items: [] });
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart, user]);

    const addToCart = async (productId, size, quantity = 1) => {
        try {
            const data = await cartAPI.add(productId, size, quantity);
            if (data.items) {
                setCart(data);
            }
            return data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (productId, size, quantity) => {
        try {
            const data = await cartAPI.update(productId, size, quantity);
            if (data.items) {
                setCart(data);
            }
            return data;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (productId, size) => {
        try {
            const data = await cartAPI.remove(productId, size);
            if (data.items) {
                setCart(data);
            }
            return data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await cartAPI.clear();
            setCart({ items: [] });
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    const cartCount = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    
    const cartTotal = cart.items?.reduce((acc, item) => {
        const price = item.product?.price || 0;
        return acc + (price * item.quantity);
    }, 0) || 0;

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            fetchCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
