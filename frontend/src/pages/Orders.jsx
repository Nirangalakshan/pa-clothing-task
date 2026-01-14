import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiMapPin, FiChevronDown, FiChevronUp, FiExternalLink, FiTruck } from 'react-icons/fi';
import { ordersAPI } from '../api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await ordersAPI.getAll();
                setOrders(data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default: return 'bg-white/10 text-white/50 border-white/5';
        }
    };

    if (loading) {
        return (
            <div className="pt-[70px] min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-white/50 font-medium tracking-wide">Retrieving your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[70px] min-h-screen">
            <div className="max-w-[1000px] mx-auto px-6 py-12">
                <div className="flex flex-col mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Order History</h1>
                    <div className="w-20 h-1.5 btn-gradient rounded-full"></div>
                    <p className="mt-4 text-white/50 font-medium font-medium">Keep track of all your PA Clothing purchases</p>
                </div>

                {orders.length === 0 ? (
                    <div className="glass p-16 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-3xl text-white/20 mb-8 border border-white/10 rotate-12">
                            <FiPackage />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No orders found</h2>
                        <p className="text-white/50 mb-10 max-w-xs leading-relaxed">You haven't placed any orders yet. Once you do, they will appear here!</p>
                        <Link to="/products" className="px-10 py-4 btn-gradient text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
                            Browse Collection
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className={`glass-card overflow-hidden group hover:border-primary/30 transition-all duration-500 ${expandedOrder === order._id ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
                                {/* Order Header */}
                                <div 
                                    className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer select-none"
                                    onClick={() => toggleOrder(order._id)}
                                >
                                    <div className="grid grid-cols-2 md:flex md:items-center gap-8 md:flex-grow">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">Order ID</span>
                                            <span className="text-white font-mono text-sm font-bold truncate max-w-[120px]">#{order._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">Date</span>
                                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                <FiCalendar className="text-primary" />
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">Total</span>
                                            <span className="text-white font-black text-lg tracking-tight">{formatPrice(order.totalPrice)}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">Status</span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border w-fit ${getStatusColor(order.status)}`}>
                                                {order.status || 'Processing'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                        {expandedOrder === order._id ? <FiChevronUp /> : <FiChevronDown />}
                                    </div>
                                </div>

                                {/* Order Details Accordion */}
                                {expandedOrder === order._id && (
                                    <div className="border-t border-white/5 p-6 md:p-8 animate-slide-down bg-white/1">
                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                                            {/* Order Items */}
                                            <div className="flex flex-col gap-6">
                                                <h4 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-2">
                                                    <FiPackage className="text-primary" />
                                                    Order Items
                                                </h4>
                                                <div className="flex flex-col gap-4">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 p-4 bg-white/3 border border-white/5 rounded-2xl transition-all hover:bg-white/5 group">
                                                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/5 shrink-0">
                                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            </div>
                                                            <div className="flex flex-col justify-center flex-grow py-1">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-white font-black leading-tight">{item.name}</span>
                                                                        <span className="text-white/40 text-[10px] font-bold uppercase">Size: {item.size} • Qty: {item.quantity}</span>
                                                                    </div>
                                                                    <span className="text-white font-black text-sm">{formatPrice(item.price * item.quantity)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Order Side Info */}
                                            <div className="flex flex-col gap-10">
                                                <div>
                                                    <h4 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                                                        <FiMapPin className="text-primary" />
                                                        Shipping Address
                                                    </h4>
                                                    <div className="p-6 glass rounded-2xl border-white/5 text-sm text-white/60 leading-relaxed shadow-inner">
                                                        <p className="font-black text-white mb-1">{order.shippingAddress?.street}</p>
                                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                                        <p>{order.shippingAddress?.zipCode}, {order.shippingAddress?.country}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-4">
                                                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg group">
                                                        <FiTruck className="group-hover:translate-x-1 transition-transform" />
                                                        Track Package
                                                    </button>
                                                    <button className="w-full py-4 text-primary font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-70 transition-all">
                                                        Download Invoice
                                                        <FiExternalLink />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
