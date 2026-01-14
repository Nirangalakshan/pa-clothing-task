import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import { productsAPI } from '../api';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        size: searchParams.get('size') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        page: parseInt(searchParams.get('page')) || 1,
        limit: 12
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params[key] = filters[key];
                }
            });
            
            const data = await productsAPI.getAll(params);
            setProducts(data.products || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
        
        // Update URL params
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] && key !== 'limit') {
                params.set(key, filters[key]);
            }
        });
        setSearchParams(params);
    }, [filters, fetchProducts, setSearchParams]);

    useEffect(() => {
        const newFilters = {
            search: searchParams.get('search') || '',
            category: searchParams.get('category') || '',
            size: searchParams.get('size') || '',
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            page: parseInt(searchParams.get('page')) || 1,
            limit: 12
        };
        
        if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
            setFilters(newFilters);
        }
    }, [searchParams]);

    const handleFilterChange = (newFilters) => {
        setFilters({ ...newFilters, page: 1 });
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            category: '',
            size: '',
            minPrice: '',
            maxPrice: '',
            page: 1,
            limit: 12
        });
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        if (!pagination.totalPages || pagination.totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-16">
                <button 
                    className="w-10 h-10 flex items-center justify-center glass text-white/70 rounded-xl hover:border-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                >
                    <FiChevronLeft />
                </button>
                
                {startPage > 1 && (
                    <>
                        <button className="p-3 glass rounded-xl text-white/50 hover:text-white transition-all duration-300" onClick={() => handlePageChange(1)}>1</button>
                        {startPage > 2 && <span className="px-2 text-white/30">...</span>}
                    </>
                )}
                
                {pages.map(page => (
                    <button
                        key={page}
                        className={`w-10 h-10 font-bold rounded-xl transition-all cursor-pointer ${
                            pagination.currentPage === page 
                                ? 'btn-gradient text-white shadow-lg' 
                                : 'glass text-white/70 hover:border-primary hover:text-white'
                        }`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                
                {endPage < pagination.totalPages && (
                    <>
                        {endPage < pagination.totalPages - 1 && <span className="px-2 text-white/30">...</span>}
                        <button className="w-10 h-10 font-bold glass text-white/70 rounded-xl hover:border-primary hover:text-white transition-all" onClick={() => handlePageChange(pagination.totalPages)}>
                            {pagination.totalPages}
                        </button>
                    </>
                )}
                
                <button 
                    className="w-10 h-10 flex items-center justify-center glass text-white/70 rounded-xl hover:border-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                >
                    <FiChevronRight />
                </button>
            </div>
        );
    };

    return (
        <div className="pt-[70px] min-h-screen">
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {filters.search ? `Search: "${filters.search}"` : 
                             filters.category ? `${filters.category}'s Collection` : 
                             'All Products'}
                        </h1>
                        <p className="text-white/50">{pagination.totalProducts || 0} products found</p>
                    </div>
                    <button 
                        className="lg:hidden flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-semibold transition-all hover:bg-white/10 shadow-xl"
                        onClick={() => setShowMobileFilters(true)}
                    >
                        <FiFilter />
                        Filters
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
                    {/* Desktop Filters */}
                    <aside className="hidden lg:block">
                        <ProductFilters 
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                        />
                    </aside>

                    {/* Mobile Filters Modal */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-60 lg:hidden" role="dialog" aria-modal="true">
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                            <div className="relative w-full max-h-[90vh] bg-[#0f0f14] border-t border-white/10 rounded-t-[2.5rem] p-8 overflow-y-auto animate-slide-up">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-white">Filters</h3>
                                    <button 
                                        className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white cursor-pointer" 
                                        onClick={() => setShowMobileFilters(false)}
                                    >
                                        <FiX className="text-xl" />
                                    </button>
                                </div>
                                <ProductFilters 
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={handleClearFilters}
                                />
                                <button 
                                    className="w-full mt-8 py-4 btn-gradient text-white font-bold rounded-2xl shadow-2xl"
                                    onClick={() => setShowMobileFilters(false)}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <main className="min-h-[500px]">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="aspect-4/5 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                                {renderPagination()}
                            </>
                        ) : (
                            <div className="flex flex-col justify-center grow py-1 text-center prose prose-invert">
                                <div className="text-7xl mb-6 grayscale opacity-40">🔍</div>
                                <h2 className="text-3xl font-bold text-white mb-2">No products found</h2>
                                <p className="text-white/50 mb-8 max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
                                <button 
                                    className="px-8 py-3 bg-primary/20 border border-primary/40 text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all shadow-xl" 
                                    onClick={handleClearFilters}
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
