"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import '@/styles/checkout.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  shortName: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  paymentMethod: 'e-money' | 'cash';
  eMoneyNumber: string;
  eMoneyPin: string;
}

interface FormErrors {
  email?: string;
  [key: string]: string | undefined;
}

interface CompletedOrder {
  items: CartItem[];
  total: number;
  shipping: number;
  vat: number;
  grandTotal: number;
  orderNumber: string;
}

// Helper function to ensure shortName exists
function ensureShortName(item: any): CartItem {
  if (!item.shortName || item.shortName.trim() === '') {
    const words = item.name.split(' ');
    item.shortName = words.length <= 2 ? item.name : words.slice(0, 2).join(' ');
  }
  return item as CartItem;
}

// Helper to create deep copy of cart items
function deepCopyCartItems(items: CartItem[]): CartItem[] {
  return items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    shortName: item.shortName
  }));
}

const Checkout: React.FC = () => {
  const router = useRouter();
  const createOrder = useMutation(api.orders.create);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use ref to capture order data BEFORE any state changes
  const completedOrderRef = useRef<CompletedOrder | null>(null);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    paymentMethod: 'e-money',
    eMoneyNumber: '',
    eMoneyPin: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem('cart');
        if (stored) {
          const parsedCart = JSON.parse(stored);
          const validatedCart = parsedCart.map((item: any) => ensureShortName(item));
          localStorage.setItem('cart', JSON.stringify(validatedCart));
          console.log('✅ Cart loaded:', validatedCart);
          setCartItems(validatedCart);
        }
      } catch (error) {
        console.error('❌ Error loading cart:', error);
      }
    };

    loadCart();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart' && e.newValue) {
        try {
          const parsedCart = JSON.parse(e.newValue);
          const validatedCart = parsedCart.map((item: any) => ensureShortName(item));
          setCartItems(validatedCart);
        } catch (error) {
          console.error('❌ Error parsing cart:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculate totals
  const calculateTotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = calculateTotal();
  const shipping = 50;
  const vat = Math.round(total * 0.2);
  const grandTotal = total + shipping;

  // Validation functions
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Wrong format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.country.trim()) newErrors.country = 'Required';

    if (formData.paymentMethod === 'e-money') {
      if (!formData.eMoneyNumber.trim()) newErrors.eMoneyNumber = 'Required';
      if (!formData.eMoneyPin.trim()) newErrors.eMoneyPin = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form handlers
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set([...prev, field]));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouchedFields(prev => new Set([...prev, field]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setTouchedFields(new Set(Object.keys(formData)));

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const invalidItems = cartItems.filter(item => !item.shortName || item.shortName.trim() === '');
    if (invalidItems.length > 0) {
      console.error('❌ Items missing shortName:', invalidItems);
      alert('There was an error with your cart items. Please refresh and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📤 Submitting order...');

      // CRITICAL: Capture order data IMMEDIATELY using current state
      const orderSnapshot: CompletedOrder = {
        items: deepCopyCartItems(cartItems),
        total: total,
        shipping: shipping,
        vat: vat,
        grandTotal: grandTotal,
        orderNumber: '' // Will be set after API call
      };

      console.log('📸 Order snapshot captured:', orderSnapshot);

      // Create order
      const result = await createOrder({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          zipCode: formData.zipCode,
          city: formData.city,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          shortName: item.shortName,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: total,
        shipping,
        vat,
        grandTotal
      });

      console.log('✅ Order created:', result.orderNumber);

      // Update order snapshot with order number
      orderSnapshot.orderNumber = result.orderNumber;

      // Store in ref for immediate access
      completedOrderRef.current = orderSnapshot;

      // Update state with complete order data
      setCompletedOrder(orderSnapshot);

      console.log('💾 Completed order set:', orderSnapshot);

      // Clear cart from localStorage
      localStorage.removeItem('cart');
      setCartItems([]);

      // Show thank you modal
      setShowThankYou(true);

    } catch (error: any) {
      console.error('❌ Error submitting order:', error);
      alert(`Error: ${error?.message || 'Failed to create order'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => `$ ${price.toLocaleString()}`;

  // Thank You Modal - Use ref if state hasn't updated yet
  if (showThankYou) {
    const orderToDisplay = completedOrder || completedOrderRef.current;

    if (!orderToDisplay) {
      console.error('❌ No order data available for thank you modal');
      return (
        <div className="thank-you-overlay">
          <div className="thank-you-modal">
            <p>Error loading order details. Please contact support.</p>
            <button className="thank-you-btn" onClick={() => router.push('/')}>
              BACK TO HOME
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="thank-you-overlay">
        <div className="thank-you-modal">
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#D87D4A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="thank-you-title">THANK YOU FOR YOUR ORDER</h1>
          <p className="thank-you-text">You will receive an email confirmation shortly.</p>

          {orderToDisplay.orderNumber && (
            <div style={{
              backgroundColor: '#F1F1F1',
              padding: '16px',
              borderRadius: '8px',
              margin: '24px 0',
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '13px',
                fontWeight: 700,
                opacity: 0.5
              }}>
                ORDER NUMBER
              </p>
              <p style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700
              }}>
                {orderToDisplay.orderNumber}
              </p>
            </div>
          )}

          <div className="thank-you-content">
            <div className="thank-you-items">
              {orderToDisplay.items.slice(0, showAllItems ? orderToDisplay.items.length : 1).map((item, index) => (
                <div key={`${item.id}-${index}`} className="thank-you-item">
                  <img src={item.image} alt={item.name} className="thank-you-item-image" />
                  <div className="thank-you-item-details">
                    <p className="thank-you-item-name">{item.shortName}</p>
                    <p className="thank-you-item-price">{formatPrice(item.price)}</p>
                  </div>
                  <p className="thank-you-item-quantity">x{item.quantity}</p>
                </div>
              ))}
              {orderToDisplay.items.length > 1 && (
                <>
                  <div className="thank-you-divider"></div>
                  <button
                    className="thank-you-toggle"
                    onClick={() => setShowAllItems(!showAllItems)}
                  >
                    {showAllItems ? 'View less' : `and ${orderToDisplay.items.length - 1} other item(s)`}
                  </button>
                </>
              )}
            </div>
            <div className="thank-you-total">
              <p className="thank-you-total-label">GRAND TOTAL</p>
              <p className="thank-you-total-amount">{formatPrice(orderToDisplay.grandTotal)}</p>
            </div>
          </div>
          <button className="thank-you-btn" onClick={() => router.push('/')}>
            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  // Main Checkout Form
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <button className="go-back-btn" onClick={() => router.back()}>
          Go back
        </button>

        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h1 className="checkout-title">CHECKOUT</h1>

            {/* BILLING DETAILS */}
            <section className="form-section">
              <h2 className="section-title">BILLING DETAILS</h2>

              <div className="form-row">
                <div className="form-group">
                  <label className={`form-label ${touchedFields.has('name') && errors.name ? 'error' : ''}`}>
                    Name
                    {touchedFields.has('name') && errors.name && (
                      <span className="error-text">{errors.name}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    className={`form-input ${touchedFields.has('name') && errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Alexei Ward"
                  />
                </div>

                <div className="form-group">
                  <label className={`form-label ${touchedFields.has('email') && errors.email ? 'error' : ''}`}>
                    Email Address
                    {touchedFields.has('email') && errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </label>
                  <input
                    type="email"
                    className={`form-input ${touchedFields.has('email') && errors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="alexei@mail.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className={`form-label ${touchedFields.has('phone') && errors.phone ? 'error' : ''}`}>
                    Phone Number
                    {touchedFields.has('phone') && errors.phone && (
                      <span className="error-text">{errors.phone}</span>
                    )}
                  </label>
                  <input
                    type="tel"
                    className={`form-input ${touchedFields.has('phone') && errors.phone ? 'error' : ''}`}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="+1 202-555-0136"
                  />
                </div>
              </div>
            </section>

            {/* SHIPPING INFO */}
            <section className="form-section">
              <h2 className="section-title">SHIPPING INFO</h2>

              <div className="form-group full-width">
                <label className={`form-label ${touchedFields.has('address') && errors.address ? 'error' : ''}`}>
                  Address
                  {touchedFields.has('address') && errors.address && (
                    <span className="error-text">{errors.address}</span>
                  )}
                </label>
                <input
                  type="text"
                  className={`form-input ${touchedFields.has('address') && errors.address ? 'error' : ''}`}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  placeholder="1137 Williams Avenue"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className={`form-label ${touchedFields.has('zipCode') && errors.zipCode ? 'error' : ''}`}>
                    ZIP Code
                    {touchedFields.has('zipCode') && errors.zipCode && (
                      <span className="error-text">{errors.zipCode}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    className={`form-input ${touchedFields.has('zipCode') && errors.zipCode ? 'error' : ''}`}
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    onBlur={() => handleBlur('zipCode')}
                    placeholder="10001"
                  />
                </div>

                <div className="form-group">
                  <label className={`form-label ${touchedFields.has('city') && errors.city ? 'error' : ''}`}>
                    City
                    {touchedFields.has('city') && errors.city && (
                      <span className="error-text">{errors.city}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    className={`form-input ${touchedFields.has('city') && errors.city ? 'error' : ''}`}
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    placeholder="New York"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className={`form-label ${touchedFields.has('country') && errors.country ? 'error' : ''}`}>
                    Country
                    {touchedFields.has('country') && errors.country && (
                      <span className="error-text">{errors.country}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    className={`form-input ${touchedFields.has('country') && errors.country ? 'error' : ''}`}
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    onBlur={() => handleBlur('country')}
                    placeholder="United States"
                  />
                </div>
              </div>
            </section>

            {/* PAYMENT DETAILS */}
            <section className="form-section">
              <h2 className="section-title">PAYMENT DETAILS</h2>

              <div className="payment-method-row">
                <label className="form-label">Payment Method</label>
                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'e-money' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="e-money"
                      checked={formData.paymentMethod === 'e-money'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'e-money' | 'cash')}
                    />
                    <span className="radio-custom"></span>
                    <span className="payment-label">e-Money</span>
                  </label>

                  <label className={`payment-option ${formData.paymentMethod === 'cash' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'e-money' | 'cash')}
                    />
                    <span className="radio-custom"></span>
                    <span className="payment-label">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'e-money' && (
                <div className="form-row">
                  <div className="form-group">
                    <label className={`form-label ${touchedFields.has('eMoneyNumber') && errors.eMoneyNumber ? 'error' : ''}`}>
                      e-Money Number
                      {touchedFields.has('eMoneyNumber') && errors.eMoneyNumber && (
                        <span className="error-text">{errors.eMoneyNumber}</span>
                      )}
                    </label>
                    <input
                      type="text"
                      className={`form-input ${touchedFields.has('eMoneyNumber') && errors.eMoneyNumber ? 'error' : ''}`}
                      value={formData.eMoneyNumber}
                      onChange={(e) => handleInputChange('eMoneyNumber', e.target.value)}
                      onBlur={() => handleBlur('eMoneyNumber')}
                      placeholder="238521993"
                    />
                  </div>

                  <div className="form-group">
                    <label className={`form-label ${touchedFields.has('eMoneyPin') && errors.eMoneyPin ? 'error' : ''}`}>
                      e-Money PIN
                      {touchedFields.has('eMoneyPin') && errors.eMoneyPin && (
                        <span className="error-text">{errors.eMoneyPin}</span>
                      )}
                    </label>
                    <input
                      type="text"
                      className={`form-input ${touchedFields.has('eMoneyPin') && errors.eMoneyPin ? 'error' : ''}`}
                      value={formData.eMoneyPin}
                      onChange={(e) => handleInputChange('eMoneyPin', e.target.value)}
                      onBlur={() => handleBlur('eMoneyPin')}
                      placeholder="6891"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'cash' && (
                <div className="cash-delivery-info">
                  <p className="cash-text">
                    The 'Cash on Delivery' option enables you to pay in cash when our delivery courier arrives at your residence.
                  </p>
                </div>
              )}
            </section>
          </form>

          {/* ORDER SUMMARY */}
          <aside className="checkout-summary">
            <h2 className="summary-title">SUMMARY</h2>

            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} className="summary-item-image" />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.shortName}</p>
                    <p className="summary-item-price">{formatPrice(item.price)}</p>
                  </div>
                  <p className="summary-item-quantity">x{item.quantity}</p>
                </div>
              ))}
            </div>

            {cartItems.length === 0 && (
              <p style={{ textAlign: 'center', color: '#CD2C2C', margin: '20px 0' }}>
                Your cart is empty
              </p>
            )}

            <div className="summary-totals">
              <div className="summary-row">
                <span className="summary-label">TOTAL</span>
                <span className="summary-value">{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">SHIPPING</span>
                <span className="summary-value">{formatPrice(shipping)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">VAT (INCLUDED)</span>
                <span className="summary-value">{formatPrice(vat)}</span>
              </div>
              <div className="summary-row grand-total">
                <span className="summary-label">GRAND TOTAL</span>
                <span className="summary-value grand">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="summary-btn"
              onClick={handleSubmit}
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting ? 'PROCESSING...' : 'CONTINUE & PAY'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;