import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cart, loading, updateQuantity, removeFromCart, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();

    const handleQuantityChange = async (productId, size, currentQuantity, delta) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity >= 1 && newQuantity <= 10) {
            try {
                await updateQuantity(productId, size, newQuantity);
            } catch (err) {
                console.error('Failed to update quantity:', err);
                toast.error('Failed to update quantity');
            }
        }
    };
    const handleRemove = async (productId, size) => {
        try {
            await removeFromCart(productId, size);
            toast.success('Item removed');
        } catch (err) {
            console.error('Failed to remove item:', err);
            toast.error('Failed to remove item');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="pt-[70px] min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-white/50 font-medium tracking-wide">Fetching your cart...</p>
                </div>
            </div>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="pt-[70px] min-h-screen flex items-center justify-center px-6">
                <div className="max-w-md w-full glass p-12 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl border-white/5">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl text-white/20 mb-8 border border-white/10">
                        <FiShoppingBag />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Your cart is empty</h2>
                    <p className="text-white/50 mb-10 leading-relaxed">Looks like you haven't added anything to your cart yet. Let's find something amazing for you!</p>
                    <Link to="/products" className="px-10 py-4 btn-gradient text-white font-bold rounded-full flex items-center gap-3 shadow-xl hover:scale-105 transition-transform">
                        Start Shopping
                        <FiArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[70px] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="flex flex-col mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Shopping Cart</h1>
                    <div className="w-20 h-1.5 btn-gradient rounded-full"></div>
                    <p className="mt-4 text-white/50 font-medium">{cart.items.length} unique item(s) in your selection</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                    {/* Cart Items */}
                    <div className="flex flex-col gap-6">
                        {cart.items.map((item, index) => (
                            <div key={`${item.product?._id}-${item.size}-${index}`} className="flex flex-col sm:flex-row gap-6 p-6 glass-card group hover:border-primary/40 relative">
                                <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                    <img 
                                        src={item.product?.imageUrl} 
                                        alt={item.product?.name} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                
                                <div className="flex flex-col justify-between grow gap-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <Link 
                                                to={`/products/${item.product?._id}`}
                                                className="text-xl font-bold text-white hover:text-primary transition-colors block mb-1"
                                            >
                                                {item.product?.name}
                                            </Link>
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-white/10 text-white/60 text-[10px] font-bold rounded-full uppercase border border-white/5">
                                                    Size: {item.size}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="text-2xl font-extrabold text-white tracking-tighter">
                                                {formatPrice(item.product?.price * item.quantity)}
                                            </span>
                                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                                {formatPrice(item.product?.price)} each
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-1 shadow-inner">
                                            <button 
                                                className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-lg text-white hover:bg-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                                onClick={() => handleQuantityChange(
                                                    item.product?._id, 
                                                    item.size, 
                                                    item.quantity, 
                                                    -1
                                                )}
                                                disabled={item.quantity <= 1}
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className="text-lg font-bold text-white min-w-[30px] text-center">{item.quantity}</span>
                                            <button 
                                                className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-lg text-white hover:bg-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                                onClick={() => handleQuantityChange(
                                                    item.product?._id, 
                                                    item.size, 
                                                    item.quantity, 
                                                    1
                                                )}
                                                disabled={item.quantity >= 10}
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>
                                        
                                        <button 
                                            className="w-11 h-11 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-lg"
                                            onClick={() => handleRemove(item.product?._id, item.size)}
                                            title="Remove from cart"
                                        >
                                            <FiTrash2 className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <aside className="lg:sticky lg:top-32 flex flex-col gap-6">
                        <div className="glass rounded-4xl p-8 border border-white/5 shadow-2xl flex flex-col gap-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight leading-none">Order Summary</h2>
                            
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-white/60 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-white">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-white/60 font-medium">
                                    <span>Calculated Tax (8%)</span>
                                    <span className="text-white">{formatPrice(cartTotal * 0.08)}</span>
                                </div>
                            </div>
                            
                            <div className="h-px bg-white/10"></div>
                            
                            <div className="flex justify-between items-end">
                                <span className="text-white/60 font-bold uppercase tracking-widest text-xs mb-1">Total Amount</span>
                                <span className="text-4xl font-extrabold text-white tracking-tighter leading-none">
                                    {formatPrice(cartTotal * 1.08)}
                                </span>
                            </div>

                            {isAuthenticated ? (
                                <Link to="/checkout" className="w-full py-5 btn-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] transition-transform text-lg">
                                    Proceed to Checkout
                                    <FiArrowRight />
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-4 text-center">
                                    <p className="text-white/40 text-sm italic font-medium">Please log in to proceed with checkout</p>
                                    <Link to="/login" className="w-full py-5 btn-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] transition-transform text-lg">
                                        Login to Continue
                                        <FiArrowRight />
                                    </Link>
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-3 text-white/30 text-xs font-bold uppercase tracking-widest mt-2 bg-white/5 py-4 rounded-xl border border-white/5 shadow-inner">
                                <span className="text-lg">🔒</span>
                                <span>SSL Encrypted Checkout</span>
                            </div>
                        </div>
                        
                        {/* Extra trust info */}
                        <div className="glass p-6 rounded-2xl border-white/5 text-center flex flex-col gap-2">
                             <p className="text-white/40 text-xs leading-relaxed">
                                Satisfaction guaranteed. Not happy? Return it within 30 days for a full refund.
                             </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Cart;
