import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiCheck, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productsAPI } from '../api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productsAPI.getById(id);
                if (data.name) {
                    setProduct(data);
                    if (data.sizes && data.sizes.length > 0) {
                        setSelectedSize(data.sizes[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }

        setAdding(true);
        try {
            await addToCart(product._id, selectedSize, quantity);
            toast.success('Added to cart!', {
                icon: '🛒',
                style: {
                    background: '#1f1f2e',
                    color: '#fff',
                    border: '1px solid rgba(102, 126, 234, 0.3)'
                }
            });
        } catch (err) {
            console.error('Failed to add to cart:', err);
            toast.error('Failed to add to cart');
        } finally {
            setAdding(false);
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
            <div className="pt-[70px] min-h-screen">
                <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-4/5 bg-white/5 rounded-3xl animate-pulse border border-white/10"></div>
                    <div className="flex flex-col gap-6">
                        <div className="h-10 w-3/4 bg-white/5 rounded-xl animate-pulse"></div>
                        <div className="h-8 w-1/4 bg-white/5 rounded-xl animate-pulse"></div>
                        <div className="h-24 w-full bg-white/5 rounded-xl animate-pulse"></div>
                        <div className="h-16 w-full bg-white/5 rounded-xl animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-[70px] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
                    <p className="text-white/50 mb-8">The product you're looking for doesn't exist.</p>
                    <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 btn-gradient text-white font-bold rounded-full transition-all shadow-xl">
                        <FiArrowLeft />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[70px] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <Link to="/products" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-all mb-12 font-medium">
                    <FiArrowLeft />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Section */}
                    <div className="lg:sticky lg:top-32">
                        <div className="aspect-4/5 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <span className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/10 shadow-xl">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">{product.name}</h1>
                            <p className="text-3xl font-extrabold text-gradient tracking-tighter">{formatPrice(product.price)}</p>
                            
                            <div className="flex flex-col justify-center grow py-1">
                                <span className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                                    <FiCheck />
                                    In Stock
                                </span>
                                <span className="text-white/40 text-sm font-medium flex items-center gap-2">
                                    ✨ Premium Quality Guaranteed
                                </span>
                            </div>
                        </div>

                        <p className="text-white/60 text-lg leading-relaxed border-l-2 border-primary/20 pl-6 py-1 italic">
                            {product.description}
                        </p>

                        {/* Size Selection */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-70">Select Size</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`w-16 h-16 flex items-center justify-center rounded-2xl border-2 font-bold text-lg transition-all cursor-pointer ${
                                            selectedSize === size
                                                ? 'bg-primary border-transparent text-white shadow-xl shadow-primary/30 transform scale-110'
                                                : 'bg-white/5 border-white/10 text-white/50 hover:border-primary hover:text-white'
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-70">Quantity</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 w-full sm:w-fit shadow-inner">
                                    <button 
                                        className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl text-white hover:bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span className="text-xl font-bold text-white min-w-[40px] text-center">{quantity}</span>
                                    <button 
                                        className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl text-white hover:bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= 10}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                                
                                <button 
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 btn-gradient text-white rounded-2xl font-bold text-lg shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] cursor-pointer"
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                >
                                    {adding ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <FiShoppingCart className="text-xl" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                
                                <div className="flex gap-3">
                                    <button className="w-14 h-14 flex items-center justify-center glass border-white/10 rounded-2xl text-white/70 hover:text-red-400 hover:border-red-400/50 transition-all cursor-pointer">
                                        <FiHeart className="text-xl" />
                                    </button>
                                    <button className="w-14 h-14 flex items-center justify-center glass border-white/10 rounded-2xl text-white/70 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                        <FiShare2 className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center gap-4 glass p-5 rounded-2xl border-white/5 transition-all hover:bg-white/10 group">
                                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">✨</span>
                                <div className="flex flex-col">
                                    <strong className="text-white text-sm">Best Quality</strong>
                                    <p className="text-white/40 text-[10px] uppercase">Crafted with care</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 glass p-5 rounded-2xl border-white/5 transition-all hover:bg-white/10 group">
                                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">↩️</span>
                                <div className="flex flex-col">
                                    <strong className="text-white text-sm">30-Day Returns</strong>
                                    <p className="text-white/40 text-[10px] uppercase">Easy exchanges</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 glass p-5 rounded-2xl border-white/5 transition-all hover:bg-white/10 group">
                                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🔒</span>
                                <div className="flex flex-col">
                                    <strong className="text-white text-sm">Secure Checkout</strong>
                                    <p className="text-white/40 text-[10px] uppercase">Verified payments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
