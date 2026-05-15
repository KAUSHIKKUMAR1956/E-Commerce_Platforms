import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl tracking-tight text-primary">NexusMart</span>
          </Link>
        </div>

        {/* Desktop Navigation & Search */}
        <div className="hidden md:flex items-center flex-1 max-w-2xl px-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary border-none focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="font-medium text-sm">Hi, {user.fullName || user.email}</span>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm text-primary hover:underline">
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center gap-2 hover:bg-secondary px-4 py-2 rounded-full transition-colors">
              <User className="h-5 w-5" />
              <span className="font-medium text-sm">Login</span>
            </Link>
          )}
          
          <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-full transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {getCartCount() > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center rounded-full transform translate-x-1/4 -translate-y-1/4">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
        
      </div>
    </header>
  );
};

export default Navbar;
