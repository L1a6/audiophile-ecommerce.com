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
      id: "zx7",
      name: "ZX7 SPEAKERS",
      price: 3500,
      quantity: quantity,
      image: "/images/Group 3 (9).png",
      shortName: "ZX7 SPEAKERS",
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
            <img src="/images/Group 3 (9).png" alt="ZX7 SPEAKER" />
          </figure>

          <article className="product-info">
            <h1 className="product-title">ZX7 SPEAKER</h1>
            <p className="product-description">
              Stream high quality sound wirelessly with minimal to no loss. The ZX7 speaker uses high-end
               audiophile components that represents the top of the line powered speakers for home or studio use.udio setups.
            </p>
            <p className="product-price">$ 3,500</p>

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
             Reap the advantages of a flat diaphragm tweeter cone. This provides a fast response rate and excellent high frequencies that lower tiered bookshelf speakers cannot provide. The woofers are made from 
             aluminum that produces a unique and clear sound. XLR inputs allow you to connect to a mixer for more advanced usage.
              <br />
              <br />
              The ZX7 speaker is the perfect blend of stylish design and high performance. It houses an encased MDF wooden enclosure which minimises acoustic resonance. Dual connectivity allows pairing through bluetooth or traditional optical and RCA input. Switch input sources and control volume at your finger tips with the included
             wireless remote. This versatile speaker is equipped to deliver an authentic listening experience.
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
              <li className="box-item">
                <span className="box-quantity">1x</span>
                <span className="box-item-name">7.5m Optical Cable</span>
              </li>
            </ul>
          </aside>
        </section>

        <section className="gallery-section">
          <div className="gallery-left">
            <figure>
              <img src="/images/Bitmap (10).png" alt="Product detail 1" className="gallery-img-1" />
            </figure>
            <figure>
              <img src="/images/Bitmap (11).png" alt="Product detail 2" className="gallery-img-2" />
            </figure>
          </div>
          <figure className="gallery-right">
            <img src="/images/Bitmap (12).png" alt="Product detail 3" className="gallery-img-3" />
          </figure>
        </section>

        <section className="you-may-like-section">
          <h2 className="you-may-like-title">You may also like</h2>
          <div className="related-products">

            <article className="related-product">
              <img src="/images/Group 12 (2).png" alt="ZX9 SPEAKER" className="related-product-image" />
              <h3 className="related-product-title">ZX9 SPEAKER</h3>
              <Link href="/speakers/zx9">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>

            <article className="related-product">
              <img src="/images/Group 12.png" alt="XX99 MARK I" className="related-product-image" />
              <h3 className="related-product-title">XX99 MARK I</h3>
              <Link href="/speakers/xx99-mark-one">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>

            <article className="related-product">
              <img src="/images/Group 12 (1).png" alt="XX59" className="related-product-image" />
              <h3 className="related-product-title">XX59</h3>
              <Link href="/headphones/xx59">
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