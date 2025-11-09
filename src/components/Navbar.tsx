'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/navbar.css';

interface CartItem {
  id: string;
  name: string;
  shortName: string; 
  price: number;
  quantity: number;
  image: string;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
 
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    loadCartFromStorage();

    const handleStorageChange = () => loadCartFromStorage();
    const handleCartUpdate = () => loadCartFromStorage();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    const interval = setInterval(() => loadCartFromStorage(), 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart: CartItem[] = JSON.parse(savedCart);
      setCartItems(cart);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  };

  // Menu and cart toggles
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsMenuOpen(false);
  };

  const closeMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('menu-overlay')) {
      setIsMenuOpen(false);
    }
  };

  const closeCart = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('cart-overlay')) {
      setIsCartOpen(false);
    }
  };

  // Update quantity of cart items
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      const updatedCart = cartItems.filter(item => item.id !== id);
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      loadCartFromStorage();
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCartFromStorage();
  };

  const removeAllItems = () => {
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem('cart');
    localStorage.removeItem('productQuantity');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatItemName = (name: string) => {
    const words = name.split(' ');
    if (words.length <= 2) return name;
    return words.slice(0, 2).join(' ');
  };

  const addToCart = (product: { id: string; name: string; price: number; image: string }) => {
    const savedCart = localStorage.getItem('cart');
    const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        shortName: formatItemName(product.name), 
        price: product.price,
        quantity: 1,
        image: product.image,
      };
      cart.push(newItem);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    loadCartFromStorage();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <>
      <nav className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="navbar-container">
          <button className="hamburger" onClick={toggleMenu} aria-label="Menu" aria-expanded={isMenuOpen}>
            {isMenuOpen ? (
              <svg width="16" height="15" viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg">
                <g fill="#FFF" fillRule="evenodd">
                  <rect transform="rotate(45 8 7.5)" x="-1" y="6.5" width="18" height="2" rx="1"/>
                  <rect transform="rotate(-45 8 7.5)" x="-1" y="6.5" width="18" height="2" rx="1"/>
                </g>
              </svg>
            ) : (
              <svg width="16" height="15" viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg">
                <g fill="#FFF" fillRule="evenodd">
                  <rect width="16" height="3" rx="1"/>
                  <rect y="6" width="16" height="3" rx="1"/>
                  <rect y="12" width="16" height="3" rx="1"/>
                </g>
              </svg>
            )}
          </button>

          <div className="logo">
            <Link href="/">
              <img src="/Images/audiophile.png" alt="Audiophile" width={143} height={25} />
            </Link>
          </div>

          <div className="nav-links">
            <Link href="/">HOME</Link>
            <Link href="/Category/headphones">HEADPHONES</Link>
            <Link href="/Category/speakers">SPEAKERS</Link>
            <Link href="/Category/earphones">EARPHONES</Link>
          </div>

          <div className="cart-icon" onClick={toggleCart}>
            <img src="/Images/combined-shape.svg" alt="Cart" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>
        <div className="navbar-divider"></div>
      </nav>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="menu-bar" onClick={(e) => e.stopPropagation()}>
            <div className="menu-content">
              <Link href="/Category/headphones" className="menu-category-item" onClick={() => setIsMenuOpen(false)}>
                <div className="menu-category-card">
                  <div className="menu-category-mask"></div>
                  <img src="/Images/image-headphones.png" alt="Headphones" className="menu-category-image" />
                  <h3 className="menu-category-title">HEADPHONES</h3>
                  <div className="menu-shop-link">
                    <span className="menu-cta-text">SHOP</span>
                    <img src="/Images/path-2.png" alt="" className="menu-cta-icon" />
                  </div>
                </div>
              </Link>

              <Link href="/Category/speakers" className="menu-category-item" onClick={() => setIsMenuOpen(false)}>
                <div className="menu-category-card">
                  <div className="menu-category-mask"></div>
                  <img src="/Images/image-speakers.png" alt="Speakers" className="menu-category-image speakers-image" />
                  <div className="menu-category-shadow"></div>
                  <h3 className="menu-category-title">SPEAKERS</h3>
                  <div className="menu-shop-link">
                    <span className="menu-cta-text">SHOP</span>
                    <img src="/Images/path-2.png" alt="" className="menu-cta-icon" />
                  </div>
                </div>
              </Link>

              <Link href="/Category/earphones" className="menu-category-item" onClick={() => setIsMenuOpen(false)}>
                <div className="menu-category-card">
                  <div className="menu-category-mask"></div>
                  <img src="/Images/image-earphones.png" alt="Earphones" className="menu-category-image earphones-image" />
                  <h3 className="menu-category-title">EARPHONES</h3>
                  <div className="menu-shop-link">
                    <span className="menu-cta-text">SHOP</span>
                    <img src="/Images/path-2.png" alt="" className="menu-cta-icon" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="cart-overlay" onClick={closeCart}>
          <div className="cart-popup">
            <div className="cart-header">
              <h2 className="cart-title">CART ({cartCount})</h2>
              <button className="remove-all" onClick={removeAllItems}>Remove all</button>
            </div>

            <div className="cart-items-container">
              {cartItems.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.shortName}</p>
                      <p className="cart-item-price">$ {item.price.toLocaleString()}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button className="quantity-btn-cart" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button className="quantity-btn-cart" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="cart-total">
                  <span className="total-label">TOTAL</span>
                  <span className="total-amount">$ {calculateTotal().toLocaleString()}</span>
                </div>

                <Link href="/checkout" className="checkout-btn">
                  Checkout
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;