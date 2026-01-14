import { FiMail, FiPhone, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0f] border-t border-white/10 mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-extrabold tracking-widest text-white">
                        PA <span className="text-gradient">CLOTHING</span>
                    </h2>
                    <p className="text-white/50 leading-relaxed max-w-xs">
                        Premium fashion for everyone. Quality clothes that make you feel confident and stylish.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-lg hover:btn-gradient transition-all"><FiInstagram /></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-lg hover:btn-gradient transition-all"><FiFacebook /></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-lg hover:btn-gradient transition-all"><FiTwitter /></a>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Shop</h4>
                    <ul className="flex flex-col gap-4 text-white/50 text-sm">
                        <li><a href="/products?category=Men" className="hover:text-white hover:pl-2 transition-all">Men</a></li>
                        <li><a href="/products?category=Women" className="hover:text-white hover:pl-2 transition-all">Women</a></li>
                        <li><a href="/products?category=Kids" className="hover:text-white hover:pl-2 transition-all">Kids</a></li>
                        <li><a href="/products" className="hover:text-white hover:pl-2 transition-all">All Products</a></li>
                    </ul>
                </div>

                <div className="flex flex-col gap-6">
                    <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Support</h4>
                    <ul className="flex flex-col gap-4 text-white/50 text-sm">
                        <li><a href="#" className="hover:text-white hover:pl-2 transition-all">FAQ</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-2 transition-all">Order Tracking</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-2 transition-all">Returns</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-2 transition-all">Size Guide</a></li>
                    </ul>
                </div>

                <div className="flex flex-col gap-6">
                    <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Contact Us</h4>
                    <div className="flex flex-col gap-4 text-white/50 text-sm">
                        <div className="flex items-center gap-3">
                            <FiMail className="text-primary text-lg" />
                            <span>support@paclothing.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FiPhone className="text-primary text-lg" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5 py-8 text-center px-4">
                <p className="text-white/30 text-xs tracking-widest uppercase">
                    © 2026 PA Clothing. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
