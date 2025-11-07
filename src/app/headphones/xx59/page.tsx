"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "@/styles/productdetail.css";
import CategorySection from "@/components/CategorySection";
import BestGear from "@/components/BestGear";
import Footer from "@/components/Footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  shortName: string;
}

const ProductDetail: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const savedQuantity = localStorage.getItem("productQuantity");
    if (savedQuantity) {
      setQuantity(parseInt(savedQuantity, 10));
    }
  }, []);

  const handleSubtract = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      localStorage.setItem("productQuantity", newQuantity.toString());
    }
  };

  const handleAdd = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    localStorage.setItem("productQuantity", newQuantity.toString());
  };

  const handleAddToCart = () => {
    const product: CartItem = {
      id: "xx59",
      name: "XX59 HEADPHONES",
      price: 899,
      quantity: quantity,
      image: "/images/group-3-8.png",
      shortName: "XX59 HEADPHONES",
    };

    const savedCart = localStorage.getItem("cart");
    let cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += product.quantity;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <main className="product-detail">
        <nav className="go-back" onClick={handleGoBack}>
          Go back
        </nav>

        <section className="product-section">
          <figure className="product-image">
            <img src="/images/group-3-8.png" alt="XX59 Headphones" />
          </figure>

          <article className="product-info">
            <h1 className="product-title">XX59 HEADPHONES</h1>
            <p className="product-description">
             Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. 
             The stylish yet durable versatile wireless headset is a brilliant companion at home or on the move. 
            </p>
            <p className="product-price">$ 899</p>

            <div className="product-actions">
              <div className="quantity-selector">
                <button className="quantity-btn subtract" onClick={handleSubtract}>
                  -
                </button>
                <span className="quantity-number">{quantity}</span>
                <button className="quantity-btn add" onClick={handleAdd}>
                  +
                </button>
              </div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to cart
              </button>
            </div>
          </article>
        </section>

        <section className="features-section">
          <article className="features-content">
            <h2 className="features-title">Features</h2>
            <p className="features-text">
              These headphones have been created from durable, high-quality materials tough enough to take anywhere. Its compact folding design fuses comfort and minimalist style making it perfect for travel. Flawless transmission
             is assured by the latest wireless technology engineered for audio synchronization with videos.
              <br />
              <br />
              More than a simple pair of headphones, this headset features a pair of built-in microphones for clear, hands-free calling when paired with a compatible smartphone. Controlling music and calls is also intuitive thanks to easy-access touch buttons on the earcups. Regardless of how you use the XX59 headphones, you
             can do so all day thanks to an impressive 30-hour battery life that can be rapidly recharged via USB-C.
            </p>
          </article>

          <aside className="in-the-box">
            <h2 className="in-the-box-title">IN THE BOX</h2>
            <ul>
              <li className="box-item">
                <span className="box-quantity">1x</span>
                <span className="box-item-name">Headphone Unit</span>
              </li>
              <li className="box-item">
                <span className="box-quantity">2x</span>
                <span className="box-item-name">Replacement Earcups</span>
              </li>
              <li className="box-item">
                <span className="box-quantity">1x</span>
                <span className="box-item-name">User Manual</span>
              </li>
              <li className="box-item">
                <span className="box-quantity">1x</span>
                <span className="box-item-name">3.5mm 5m Audio Cable</span>
              </li>
            </ul>
          </aside>
        </section>

        <section className="gallery-section">
          <div className="gallery-left">
            <figure>
              <img src="/images/nicer.png" alt="Product detail 1" className="gallery-img-1" />
            </figure>
            <figure>
              <img src="/images/bitmap-5.png" alt="Product detail 2" className="gallery-img-2" />
            </figure>
          </div>
          <figure className="gallery-right">
            <img src="/images/bitmap-6.png" alt="Product detail 3" className="gallery-img-3" />
          </figure>
        </section>

        <section className="you-may-like-section">
          <h2 className="you-may-like-title">You may also like</h2>
          <div className="related-products">
            <article className="related-product">
              <img src="/images/group-12-3.png" alt="XX99 Mark II" className="related-product-image" />
              <h3 className="related-product-title">XX99 MARK II</h3>
              <Link href="/headphones/xx99-mark-two">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>

            <article className="related-product">
              <img src="/images/group-12.png" alt="XX99" className="related-product-image" />
              <h3 className="related-product-title">XX99 MARK I</h3>
              <Link href="/headphones/xx99-mark-one">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>

            <article className="related-product">
              <img src="/images/group-12-2.png" alt="ZX9 Speaker" className="related-product-image" />
              <h3 className="related-product-title">ZX9 SPEAKER</h3>
              <Link href="/speakers/zx9">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>
          </div>
        </section>
      </main>

      <CategorySection />
      <BestGear />
    </>
  );
};

export default ProductDetail;