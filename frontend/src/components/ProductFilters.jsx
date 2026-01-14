import { FiX } from 'react-icons/fi';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const categories = ['Men', 'Women', 'Kids'];
    const sizes = ['S', 'M', 'L', 'XL'];

    const handleCategoryChange = (category) => {
        const currentCategories = filters.category ? filters.category.split(',') : [];
        let newCategories;
        
        if (currentCategories.includes(category)) {
            newCategories = currentCategories.filter(c => c !== category);
        } else {
            newCategories = [...currentCategories, category];
        }
        
        onFilterChange({ ...filters, category: newCategories.join(',') });
    };

    const handleSizeChange = (size) => {
        const currentSizes = filters.size ? filters.size.split(',') : [];
        let newSizes;
        
        if (currentSizes.includes(size)) {
            newSizes = currentSizes.filter(s => s !== size);
        } else {
            newSizes = [...currentSizes, size];
        }
        
        onFilterChange({ ...filters, size: newSizes.join(',') });
    };

    const handlePriceChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const hasActiveFilters = filters.category || filters.size || filters.minPrice || filters.maxPrice;

    return (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h3 className="text-white text-lg font-bold">Filters</h3>
                {hasActiveFilters && (
                    <button 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        onClick={onClearFilters}
                    >
                        <FiX />
                        Clear
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-8">
                {/* Category Filter */}
                <div>
                    <h4 className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-4">Category</h4>
                    <div className="flex flex-col gap-3">
                        {categories.map(category => (
                            <label key={category} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={filters.category?.split(',').includes(category) || false}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    <div className="w-5 h-5 border-2 border-white/30 rounded-md peer-checked:bg-primary peer-checked:border-transparent transition-all group-hover:border-primary"></div>
                                    <FiX className="absolute inset-0 m-auto text-white text-[10px] opacity-0 peer-checked:opacity-100 transition-opacity rotate-45 peer-checked:rotate-0" />
                                </div>
                                <span className="text-sm font-medium">{category}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Size Filter */}
                <div>
                    <h4 className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-4">Size</h4>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                            <button
                                key={size}
                                className={`w-11 h-11 flex items-center justify-center rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                                    filters.size?.split(',').includes(size)
                                        ? 'bg-primary border-transparent text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/5 border-white/10 text-white/70 hover:border-primary hover:text-white'
                                }`}
                                onClick={() => handleSizeChange(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <h4 className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-4">Price Range</h4>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-7 pr-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                value={filters.minPrice || ''}
                                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                            />
                        </div>
                        <span className="text-white/30 text-sm">to</span>
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-7 pr-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                value={filters.maxPrice || ''}
                                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
