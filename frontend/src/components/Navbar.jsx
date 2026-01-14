import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between h-[70px] gap-4">
                <Link to="/" className="flex items-center gap-2 no-underline group">
                    <span className="text-white text-2xl font-extrabold tracking-widest group-hover:text-primary transition-colors">PA</span>
                    <span className="text-gradient text-xl font-bold tracking-tight">CLOTHING</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    <Link to="/products" className="text-white/80 hover:text-white font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Shop</Link>
                    <Link to="/products?category=Men" className="text-white/80 hover:text-white font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Men</Link>
                    <Link to="/products?category=Women" className="text-white/80 hover:text-white font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Women</Link>
                    <Link to="/products?category=Kids" className="text-white/80 hover:text-white font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Kids</Link>
                </div>

                <form className="flex-1 max-w-sm relative hidden sm:block" onSubmit={handleSearch}>
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <div className="flex items-center gap-4">
                    <Link to="/cart" className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:btn-gradient transition-all">
                        <FiShoppingCart className="text-xl" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-dark-bg">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button 
                                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full bg-white/5 text-white text-sm hover:bg-white/10 hover:border-primary transition-all cursor-pointer"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <FiUser />
                                <span className="hidden md:block">{user.username}</span>
                            </button>
                            {showUserMenu && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-48 glass rounded-xl p-2 shadow-2xl">
                                    <Link 
                                        to="/orders" 
                                        className="flex items-center gap-3 w-full px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <FiPackage />
                                        My Orders
                                    </Link>
                                    <button 
                                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg text-sm transition-all text-left cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        <FiLogOut />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 px-6 py-2.5 btn-gradient rounded-full text-white font-semibold text-sm transition-all">
                            <FiUser />
                            <span className="hidden md:block">Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
