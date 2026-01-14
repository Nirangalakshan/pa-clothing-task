import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiChevronRight, FiCreditCard, FiTruck, FiCheckCircle, FiShoppingBag, FiArrowLeft, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { ordersAPI } from '../api';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Address state
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
    });

    // Submitting order state
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const validateAddress = () => {
        const { street, city, state, zipCode } = address;
        if (!street || !city || !state || !zipCode) {
            toast.error('Please fill in all shipping details');
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        if (step === 1 && validateAddress()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmitOrder = async () => {
        setLoading(true);
        try {
            const data = await ordersAPI.create({ shippingAddress: address });
            if (data._id) {
                setOrderNumber(data._id);
                setIsSuccess(true);
                clearCart();
                toast.success('Order placed successfully!', {
                    icon: '🎉',
                    style: { background: '#1f1f2e', color: '#fff', border: '1px solid #667eea' }
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    if (isSuccess) {
        return (
            <div className="pt-[70px] min-h-screen flex items-center justify-center px-6">
                <div className="max-w-2xl w-full glass p-12 md:p-16 rounded-[3rem] text-center shadow-2xl border-white/5 animate-scale-in">
                    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                        <FiCheckCircle />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Order Confirmed!</h1>
                    <p className="text-white/50 text-lg mb-8 leading-relaxed">
                        Thank you for your purchase. We've sent a confirmation email with all the details of your order.
                    </p>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 flex flex-col items-center gap-2 shadow-inner">
                        <span className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Order Reference</span>
                        <span className="text-white font-mono text-xl font-bold break-all select-all">{orderNumber}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/orders" className="px-10 py-4 bg-white/5 border border-white/20 rounded-full text-white font-bold hover:bg-white/10 transition-all shadow-lg">
                            View My Orders
                        </Link>
                        <Link to="/" className="px-10 py-4 btn-gradient text-white font-bold rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            Return Home
                            <FiShoppingBag />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const total = cartTotal * 1.08;

    return (
        <div className="pt-[70px] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Complete Your Order</h1>
                        <p className="text-white/50 font-medium tracking-wide">Secure Checkout (Step {step} of 2)</p>
                    </div>
                    
                    {/* Stepper */}
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-inner">
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${step === 1 ? 'btn-gradient text-white shadow-lg' : 'text-white/30 font-bold'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black border-2 ${step === 1 ? 'border-white bg-white/20' : 'border-white/10'}`}>1</div>
                            <span className="text-sm uppercase tracking-widest hidden sm:block">Shipping</span>
                        </div>
                        <div className="w-10 h-px bg-white/10"></div>
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${step === 2 ? 'btn-gradient text-white shadow-lg' : 'text-white/30 font-bold'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black border-2 ${step === 2 ? 'border-white bg-white/20' : 'border-white/10'}`}>2</div>
                            <span className="text-sm uppercase tracking-widest hidden sm:block">Payment</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                    <div className="flex flex-col gap-8">
                        {step === 1 ? (
                            <div className="glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl flex flex-col gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl shadow-lg border border-primary/20">
                                        <FiTruck />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Shipping Information</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2 col-span-2">
                                        <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            placeholder="123 Fashion Ave"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder:text-white/20 shadow-inner"
                                            value={address.street}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="New York"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder:text-white/20 shadow-inner"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">State / Province</label>
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="NY"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder:text-white/20 shadow-inner"
                                            value={address.state}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">Zip / Postal Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="10001"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder:text-white/20 shadow-inner"
                                            value={address.zipCode}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-1">Country</label>
                                        <select
                                            name="country"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-primary focus:bg-white/10 transition-all cursor-pointer shadow-inner"
                                            value={address.country}
                                            onChange={handleAddressChange}
                                        >
                                            <option value="United States" className="bg-dark-bg">United States</option>
                                            <option value="United Kingdom" className="bg-dark-bg">United Kingdom</option>
                                            <option value="Canada" className="bg-dark-bg">Canada</option>
                                            <option value="Australia" className="bg-dark-bg">Australia</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <button className="w-full mt-4 py-5 btn-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.01] transition-transform text-xl cursor-pointer" onClick={handleNextStep}>
                                    Check Order Details
                                    <FiChevronRight className="text-2xl" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-8 animate-slide-up">
                                <div className="glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl flex flex-col gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl shadow-lg border border-primary/20">
                                            <FiCreditCard />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">Payment Method</h2>
                                    </div>
                                    
                                    <div className="p-8 border-2 border-primary bg-primary/5 rounded-[2rem] flex items-center justify-between group shadow-lg">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-10 bg-white/10 rounded-lg flex items-center justify-center shadow-inner pt-1">
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-red-500 opacity-80"></div>
                                                    <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80"></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-lg">Card ending in ...4242</span>
                                                <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Expires 12/28</p>
                                            </div>
                                        </div>
                                        <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                            <FiCheckCircle className="text-white" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex flex-col items-center gap-3 p-6 glass border-white/5 rounded-2xl opacity-40 hover:opacity-100 transition-all cursor-not-allowed grayscale">
                                            <span className="text-3xl">🏦</span>
                                            <span className="text-white/70 font-bold text-xs uppercase">Paypal</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-3 p-6 glass border-white/5 rounded-2xl opacity-40 hover:opacity-100 transition-all cursor-not-allowed grayscale">
                                            <span className="text-3xl">💳</span>
                                            <span className="text-white/70 font-bold text-xs uppercase">Google Pay</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="px-8 py-5 border-2 border-white/10 rounded-2xl text-white font-bold hover:bg-white/5 flex items-center justify-center gap-3 transition-all cursor-pointer" onClick={() => setStep(1)}>
                                        <FiArrowLeft />
                                        Edit Shipping
                                    </button>
                                    <button 
                                        className="flex-1 py-5 btn-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform text-xl cursor-pointer disabled:opacity-70"
                                        onClick={handleSubmitOrder}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Place Order - {formatPrice(total)}
                                                <FiLock className="text-lg opacity-50" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="lg:sticky lg:top-32 flex flex-col gap-6">
                        <div className="glass p-8 rounded-[2.5rem] border-white/10 shadow-2xl flex flex-col gap-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight leading-none">Your Basket</h2>
                            
                            <div className="flex flex-col gap-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center p-3 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                            <img src={item.product?.imageUrl} alt={item.product?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col flex-grow min-w-0">
                                            <span className="text-white font-bold text-sm truncate">{item.product?.name}</span>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-white/40 text-[10px] font-bold uppercase">Sz: {item.size} • Qty: {item.quantity}</span>
                                                <span className="text-primary font-black text-sm">{formatPrice(item.product?.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-white/10"></div>
                            
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-white">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                                    <span>Tax (8%)</span>
                                    <span className="text-white">{formatPrice(cartTotal * 0.08)}</span>
                                </div>
                                <div className="h-px bg-white/10 mt-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Total Pay</span>
                                    <span className="text-3xl font-black text-white leading-none tracking-tighter">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="glass p-6 rounded-2xl border-white/5 flex items-center justify-center gap-3 shadow-xl">
                            <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-lg">🔒</div>
                            <span className="text-white/40 text-[10px] uppercase font-black tracking-widest leading-tight">
                                256-bit Secure Encryption<br/>Your data is safe with us
                            </span>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
