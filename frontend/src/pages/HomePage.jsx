import { ShoppingCart, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAddToCart, isAdded }) => (
  <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
    <div className="relative overflow-hidden aspect-square">
      <img 
        src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"} 
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
          onClick={() => onAddToCart(product)}
          className={`p-3 rounded-full transition-colors ${
            isAdded 
              ? 'bg-green-500 text-white' 
              : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          {isAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
        </button>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/products');
        // Just take the first 4 for the featured section
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems({ ...addedItems, [product.id]: true });
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-secondary py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 animate-fade-in">
              Special Offer - Up to 50% Off
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              Discover Premium <br/>
              <span className="text-primary">Tech & Lifestyle</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Upgrade your life with our curated collection of high-quality products. Free shipping on orders over $100.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                Shop Now
              </Link>
              <Link to="/categories" className="bg-background text-foreground border border-border px-8 py-3 rounded-full font-semibold hover:bg-secondary transition-colors">
                Explore Categories
              </Link>
            </div>
          </div>
          <div className="relative z-10 hidden md:block">
            <div className="relative w-full aspect-square rounded-full bg-primary/5 p-8">
              <img 
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000" 
                alt="Hero Product" 
                className="w-full h-full object-cover rounded-full shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-foreground">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked items just for you</p>
            </div>
            <Link to="/products" className="text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                isAdded={addedItems[product.id]}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl">
            <div className="mb-8 md:mb-0 max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Join our Newsletter</h2>
              <p className="text-primary-foreground/80 text-lg">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-6 py-3 rounded-full text-foreground w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-background"
              />
              <button className="bg-background text-primary px-8 py-3 rounded-full font-bold hover:bg-secondary transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
