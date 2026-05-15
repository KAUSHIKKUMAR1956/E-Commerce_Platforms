import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [error, setError] = useState('');
  
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to checkout.');
      setIsProcessing(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const items = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      await api.post('/orders', {
        shippingAddress,
        paymentMethod,
        items
      });
      
      clearCart();
      setStep(3); // Success step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process order.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-xl border border-border text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-4">Payment Successful!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order #ORD-102938 has been confirmed and will be shipped soon.
          </p>
          <Link 
            to="/products" 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Checkout Progress */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-primary -z-10 transition-all duration-500" style={{ width: step === 2 ? '100%' : '50%' }}></div>
          
          <div className={`flex flex-col items-center bg-background px-4 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border'}`}>
              1
            </div>
            <span className="text-sm font-medium">Shipping</span>
          </div>
          
          <div className={`flex flex-col items-center bg-background px-4 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border'}`}>
              2
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm">
            
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <Truck className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Shipping Details</h2>
                </div>
                
                {error && (
                  <div className="mb-6 bg-destructive/10 text-destructive text-sm p-3 rounded-xl border border-destructive/20">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Full Shipping Address</label>
                    <input 
                      required 
                      type="text" 
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="123 Main St, City, Country, ZIP"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all" 
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
                    Continue to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePayment}>
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Payment Method</h2>
                </div>
                
                {error && (
                  <div className="mb-6 bg-destructive/10 text-destructive text-sm p-3 rounded-xl border border-destructive/20">
                    {error}
                  </div>
                )}
                
                <div className="space-y-6">
                  {/* Payment Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="CREDIT_CARD"
                        checked={paymentMethod === 'CREDIT_CARD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="peer sr-only" 
                      />
                      <div className="p-4 rounded-xl border-2 border-border peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-primary" />
                        <span className="font-semibold">Credit Card</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="PAYPAL"
                        checked={paymentMethod === 'PAYPAL'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="peer sr-only" 
                      />
                      <div className="p-4 rounded-xl border-2 border-border peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex items-center gap-3">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
                        </svg>
                        <span className="font-semibold">PayPal</span>
                      </div>
                    </label>
                  </div>
                  
                  {/* Card Details */}
                  <div className="space-y-4 bg-secondary/30 p-6 rounded-2xl border border-border">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Card Number</label>
                      <div className="relative">
                        <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 pl-12 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all font-mono" />
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Expiry Date</label>
                        <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">CVC</label>
                        <input required type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cardholder Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <button type="button" onClick={() => setStep(1)} className="text-muted-foreground font-medium hover:text-foreground">
                    Back to Shipping
                  </button>
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                  >
                    {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    {!isProcessing && <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-card rounded-3xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden shrink-0">
                    <img src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-border text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
                <span className="font-bold text-base">Total</span>
                <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
