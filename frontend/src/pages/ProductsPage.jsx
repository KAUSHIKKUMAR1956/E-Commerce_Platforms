import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, SlidersHorizontal, Loader2, Check } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{id: 0, name: 'All'}]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories([{id: 0, name: 'All'}, ...response.data]);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = '/products';
        const params = new URLSearchParams();
        
        if (activeCategory !== 'All') {
          const categoryObj = categories.find(c => c.name === activeCategory);
          if (categoryObj) {
            params.append('categoryId', categoryObj.id);
          }
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await api.get(url);
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery, categories]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems({ ...addedItems, [product.id]: true });
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Our Products</h1>
          <p className="text-muted-foreground mt-1">Showing {products.length} results</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-input bg-background rounded-xl hover:bg-secondary transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Sort</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-foreground font-semibold pb-4 border-b border-border">
              <Filter className="h-5 w-5" />
              <h2>Categories</h2>
            </div>
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category.id}>
                  <button 
                    onClick={() => setActiveCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === category.name 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <input type="range" className="w-full accent-primary" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>$0</span>
                <span>$1000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-secondary/50 rounded-3xl border border-dashed border-border">
              <p className="text-xl font-medium text-muted-foreground">No products found</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('All')}}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-primary">
                      {product.category?.name || "Uncategorized"}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating || "0.0"}</span>
                      <span className="text-sm text-muted-foreground">({product.numReviews || 0})</span>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className={`p-3 rounded-full transition-colors ${
                          addedItems[product.id] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                        }`}
                      >
                        {addedItems[product.id] ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
