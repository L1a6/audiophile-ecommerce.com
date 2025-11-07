
"use client";

import React, { useState, useEffect } from 'react';
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

const Checkout: React.FC = () => {
  const router = useRouter();
  const createOrder = useMutation(api.orders.create);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

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
          setCartItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart' && e.newValue) {
        try {
          setCartItems(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing cart:', error);
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

    // Mark all fields as touched for validation display
    setTouchedFields(new Set(Object.keys(formData)));

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order (this will automatically trigger email via scheduler)
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

      // Store order number for thank you page
      setOrderNumber(result.orderNumber);

      // Clear cart
      localStorage.removeItem('cart');
      setCartItems([]);

      // Show thank you modal
      setShowThankYou(true);

      console.log('✅ Order created successfully:', result.orderNumber);
    } catch (error) {
      console.error('❌ Error submitting order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format price
  const formatPrice = (price: number) => `$ ${price.toLocaleString()}`;

  // Thank You Modal
  if (showThankYou) {
    return (
      <div className="thank-you-overlay">
        <div className="thank-you-modal">
          <img src="/group-12-5.png" alt="Success" className="thank-you-icon" />
          <h1 className="thank-you-title">THANK YOU FOR YOUR ORDER</h1>
          <p className="thank-you-text">You will receive an email confirmation shortly.</p>
          
          {orderNumber && (
            <div className="order-number-display">
              <p className="order-number-label">Order Number:</p>
              <p className="order-number-value">{orderNumber}</p>
            </div>
          )}

          <div className="thank-you-content">
            <div className="thank-you-items">
              {cartItems.slice(0, showAllItems ? cartItems.length : 1).map(item => (
                <div key={item.id} className="thank-you-item">
                  <img src={item.image} alt={item.name} className="thank-you-item-image" />
                  <div className="thank-you-item-details">
                    <p className="thank-you-item-name">{item.shortName}</p>
                    <p className="thank-you-item-price">{formatPrice(item.price)}</p>
                  </div>
                  <p className="thank-you-item-quantity">x{item.quantity}</p>
                </div>
              ))}
              {cartItems.length > 1 && (
                <>
                  <div className="thank-you-divider"></div>
                  <button 
                    className="thank-you-toggle" 
                    onClick={() => setShowAllItems(!showAllItems)}
                  >
                    {showAllItems ? 'View less' : `and ${cartItems.length - 1} other item(s)`}
                  </button>
                </>
              )}
            </div>
            <div className="thank-you-total">
              <p className="thank-you-total-label">GRAND TOTAL</p>
              <p className="thank-you-total-amount">{formatPrice(grandTotal)}</p>
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
            <div className="form-section">
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
                    className={`form-input ${touchedFields.has('phone') && errors.phone ? 'error' : 
''}`}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="+1 202-555-0136"
                  />
                </div>
              </div>
            </div>

            {/* SHIPPING INFO */}
            <div className="form-section">
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
            </div>

            {/* PAYMENT DETAILS */}
            <div className="form-section">
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
                  <img src="/cash-on-delivery.svg" alt="Cash on Delivery" className="cash-icon" />
                  <p className="cash-text">
                    The 'Cash on Delivery' option enables you to pay in cash when our delivery courier arrives at your residence. Just make sure your address is correct so that your order will not be cancelled.
                  </p>
                </div>
              )}
            </div>
          </form>

          {/* ORDER SUMMARY */}
          <div className="checkout-summary">
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

            {cartItems.length === 0 && (
              <p className="empty-cart-message">Your cart is empty</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;