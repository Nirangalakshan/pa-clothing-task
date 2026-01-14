import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { productsAPI } from '../api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productsAPI.getAll({ limit: 8 });
                setFeaturedProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500', count: '50+ Items' },
        { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500', count: '75+ Items' },
        { name: 'Kids', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500', count: '40+ Items' }
    ];

    const features = [
        { icon: <FiTruck />, title: 'Free Shipping', description: 'On orders over $100' },
        { icon: <FiRefreshCw />, title: 'Easy Returns', description: '30-day return policy' },
        { icon: <FiHeadphones />, title: '24/7 Support', description: 'Always here to help' },
        { icon: <FiShoppingBag />, title: 'Secure Payment', description: 'Safe & encrypted' }
    ];

    return (
        <div className="pt-[70px]">
            {/* Hero Section */}
            <section className="relative px-6 py-16 md:py-32 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
                    <span className="px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full text-primary text-xs font-bold uppercase tracking-widest animate-pulse">
                        New Collection 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1]">
                        Elevate Your <span className="text-gradient">Style</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl">
                        Discover premium clothing that defines your unique personality. Quality meets fashion in every piece.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Link to="/products" className="px-8 py-4 btn-gradient rounded-full text-white font-bold text-lg flex items-center justify-center gap-2 shadow-2xl">
                            <FiShoppingBag />
                            Shop Now
                        </Link>
                        <Link to="/products?category=Women" className="px-8 py-4 bg-white/5 border border-white/20 rounded-full text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                            Explore Women
                            <FiArrowRight />
                        </Link>
                    </div>
                    <div className="flex gap-12 mt-8 pt-8 border-t border-white/10 w-full justify-center lg:justify-start">
                        <div className="flex flex-col">
                            <span className="text-3xl font-extrabold text-white">500+</span>
                            <span className="text-white/50 text-xs uppercase tracking-widest font-bold">Products</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-extrabold text-white">10k+</span>
                            <span className="text-white/50 text-xs uppercase tracking-widest font-bold">Customers</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-extrabold text-white">4.9</span>
                            <span className="text-white/50 text-xs uppercase tracking-widest font-bold">Rating</span>
                        </div>
                    </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative aspect-4/5 lg:aspect-square group animate-float rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                        <img 
                            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800" 
                            alt="Fashion Model" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-10 -right-4 md:-right-8 glass p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-float">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-xl">🔥</div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">Trending</span>
                                <span className="text-white/50 text-[10px] uppercase">This Week</span>
                            </div>
                        </div>
                        <div className="absolute bottom-20 -left-4 md:-left-8 glass p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-float delay-700">
                            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-xl">⭐</div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">Top Rated</span>
                                <span className="text-white/50 text-[10px] uppercase">Best Sellers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-20 max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="glass-card p-8 flex flex-col items-center text-center group hover:border-primary/30">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary text-2xl flex items-center justify-center mb-6 group-hover:btn-gradient group-hover:text-white transition-all duration-500 shadow-lg">
                            {feature.icon}
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </section>

            {/* Categories Section */}
            <section className="px-6 py-20 max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Shop by <span className="text-gradient">Category</span>
                    </h2>
                    <p className="text-white/50 text-lg">Find the perfect style for everyone in the family</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, index) => (
                        <Link 
                            key={index} 
                            to={`/products?category=${cat.name}`}
                            className="relative aspect-3/4 rounded-3xl overflow-hidden group border border-white/5"
                        >
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-dark-bg/60 to-dark-bg/90 flex flex-col justify-end p-8">
                                <h3 className="text-3xl font-bold text-white mb-1">{cat.name}</h3>
                                <span className="text-white/60 mb-6 font-medium">{cat.count}</span>
                                <span className="flex items-center gap-2 text-primary font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    Explore <FiArrowRight />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="px-6 py-20 max-w-[1400px] mx-auto">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Featured <span className="text-gradient">Products</span>
                    </h2>
                    <p className="text-white/50 text-lg">Handpicked favorites you'll love</p>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse border border-white/10"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.slice(0, 8).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
                
                <div className="flex justify-center mt-16">
                    <Link to="/products" className="px-10 py-4 border-2 border-primary text-primary font-bold rounded-full flex items-center gap-3 hover:btn-gradient hover:text-white hover:border-transparent transition-all shadow-xl">
                        View All Products
                        <FiArrowRight />
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-32 mt-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent border-t border-b border-white/10 flex justify-center text-center">
                <div className="max-w-2xl flex flex-col items-center gap-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Ready to upgrade your wardrobe?
                    </h2>
                    <p className="text-white/60 text-lg mb-4">
                        Join thousands of satisfied customers and discover your new favorite outfits today.
                    </p>
                    <Link to="/products" className="px-12 py-5 btn-gradient rounded-full text-white font-bold text-xl flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                        Start Shopping
                        <FiArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
