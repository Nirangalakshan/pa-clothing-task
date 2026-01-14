import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const { username, email, password, confirmPassword } = userData;
        if (!username || !email || !password || !confirmPassword) {
            toast.error('All fields are required');
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        try {
            await register({
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            toast.success('Account created! Welcome to PA Clothing');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-[70px] pb-12 px-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 translate-y-1/2"></div>
            
            <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 glass p-4 md:p-8 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden min-h-[600px] relative">
                
                {/* Decorative Side (Flip for Register) */}
                <div className="hidden lg:flex relative rounded-4xl overflow-hidden group">
                    <img 
                        src="https://images.unsplash.com/photo-1539109132374-34fa52636c84?w=800" 
                        alt="Fashion Style" 
                        className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-dark-bg/90 via-transparent to-transparent flex flex-col justify-end p-16 gap-4">
                        <span className="text-white/40 uppercase tracking-[0.3em] font-black text-xs">Join the club</span>
                        <h2 className="text-5xl font-black text-white leading-tight">Start Your Fashion Journey</h2>
                        <ul className="flex flex-col gap-4 mt-4">
                            {[
                                'Exclusive seasonal drops',
                                'Early access to sales',
                                'Priority customer support',
                                'Member-only events'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/70 font-medium">
                                    <FiCheckCircle className="text-primary text-xl shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Register</h1>
                        <p className="text-white/40 font-medium">Create your account to start shopping.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                                <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors text-lg" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="FashionLover"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-medium shadow-inner"
                                    value={userData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors text-lg" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-medium shadow-inner"
                                    value={userData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors text-lg" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-medium shadow-inner"
                                    value={userData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group">
                                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors text-lg" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-medium shadow-inner"
                                    value={userData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-5 btn-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] transition-transform text-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Create Account
                                    <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-white/40 font-medium text-sm">
                        Already have an account? <Link to="/login" className="text-white font-bold hover:text-primary transition-all">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
