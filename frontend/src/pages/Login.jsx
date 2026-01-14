import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(credentials);
            toast.success('Welcome back!', {
                style: { background: '#1f1f2e', color: '#fff' }
            });
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-[70px] pb-12 px-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[450px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[450px] bg-secondary/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 glass p-4 md:p-8 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden min-h-[600px]">
                {/* Form Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center gap-10">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Login</h1>
                        <p className="text-white/40 font-medium">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors text-lg" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-medium shadow-inner"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-white/30 text-[10px] font-black uppercase tracking-widest">Password</label>
                                <a href="#" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline transition-all">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors text-lg" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-medium shadow-inner"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-5 btn-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] transition-transform text-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Sign In
                                    <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-white/40 font-medium text-sm">
                        Don't have an account? <Link to="/register" className="text-white font-bold hover:text-primary transition-all">Join PA Clothing</Link>
                    </p>
                </div>

                {/* Decorative Side */}
                <div className="hidden lg:flex relative rounded-[2rem] overflow-hidden group">
                    <img 
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" 
                        alt="Join Us" 
                        className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-dark-bg/90 via-transparent to-transparent flex flex-col justify-end p-16 gap-4">
                        <span className="text-white/40 uppercase tracking-[0.3em] font-black text-xs">Premium Fashion</span>
                        <h2 className="text-5xl font-black text-white leading-tight">Elevate Your Everyday Style</h2>
                        <p className="text-white/60 text-lg leading-relaxed max-w-sm font-medium">
                            Join our community and get access to exclusive drops and special offers.
                        </p>
                    </div>
                    {/* Floating badge */}
                    <div className="absolute top-12 right-12 glass px-6 py-4 rounded-3xl animate-float shadow-2xl border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center text-primary text-xl font-black shadow-lg">PA</div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-xs uppercase tracking-widest leading-none">Established</span>
                            <span className="text-white/40 font-bold text-[10px] mt-1">EST 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
