import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

const subtotal = getCartTotal();
const shipping = subtotal > 100 ? 0 : 15;
const tax = subtotal * 0.08; // 8% tax
const total = subtotal + shipping + tax;

if (cartItems.length === 0) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-48 h-48 mb-8 bg-secondary rounded-full flex items-center justify-center">
        <ShoppingCart className="w-24 h-24 text-muted-foreground opacity-50" />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Looks like you haven't added anything to your cart yet. Browse our categories and discover our best deals!
      </p>
      <Link to="/products" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
        Start Shopping
      </Link>
    </div>
  );
}

return (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items List */}
      <div className="flex-1 space-y-4">
        <div className="bg-card rounded-2xl border border-border p-6 hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {cartItems.map(item => (
          <div key={item.id} className="bg-card rounded-2xl border border-border p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
            {/* Product Info */}
            <div className="col-span-6 flex items-center gap-4 w-full">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-secondary">
                <img src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category?.name || "Uncategorized"}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-destructive text-sm font-medium flex items-center gap-1 mt-2 hover:underline"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-2 text-center w-full md:w-auto flex justify-between md:block mt-4 md:mt-0">
              <span className="md:hidden text-muted-foreground font-medium">Price:</span>
              <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span>
            </div>

            {/* Quantity */}
            <div className="col-span-2 flex justify-center w-full md:w-auto">
              <div className="flex items-center gap-3 border border-border rounded-full px-3 py-1 bg-background">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 hover:text-primary transition-colors disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="col-span-2 text-right w-full md:w-auto flex justify-between md:block mt-4 md:mt-0">
              <span className="md:hidden text-muted-foreground font-medium">Total:</span>
              <span className="font-bold text-foreground text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({cartItems.length} items)</span>
              <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Estimate</span>
              <span className="text-foreground font-medium">
                {shipping === 0 ? <span className="text-green-500">Free</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax Estimate (8%)</span>
              <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-sm text-muted-foreground text-right mt-1">
                Add ${(100 - subtotal).toFixed(2)} more to get free shipping!
              </p>
            )}
          </div>

          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default CartPage;
