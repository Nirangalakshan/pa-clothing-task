import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';

const ProductCard = ({ product }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <Link 
            to={`/products/${product._id}`} 
            className="flex flex-col h-full bg-white/3 border border-white/8 rounded-2xl overflow-hidden no-underline transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_25px_50px_-12px_rgba(102,126,234,0.25)] group"
        >
            <div className="relative aspect-4/5 overflow-hidden">
                <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-2 px-6 py-2.5 btn-gradient text-white rounded-full font-medium text-sm translate-y-5 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                        <FiShoppingBag />
                        View Product
                    </span>
                </div>
                <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/10">
                    {product.category}
                </span>
            </div>
            
            <div className="p-5 flex flex-col gap-2 grow">
                <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-white/50 text-xs line-clamp-2 leading-relaxed">{product.description}</p>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gradient">{formatPrice(product.price)}</span>
                    <div className="flex gap-1.5">
                        {product.sizes.slice(0, 3).map(size => (
                            <span key={size} className="px-2 py-1 bg-white/10 text-white/60 text-[10px] font-bold rounded border border-white/5 uppercase">
                                {size}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
