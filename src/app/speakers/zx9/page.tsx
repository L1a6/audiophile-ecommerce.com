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
      id: "zx9",
      name: "ZX9 SPEAKERS",
      price: 4500,
      quantity: quantity,
      image: "/Images/group-3-4.png",
      shortName: "ZX9 SPEAKERS"
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
            <img src="/Images/group-3-4.png" alt="ZX9 SPEAKERS" />
          </figure>

          <article className="product-info">
            <p className="new-product">New product</p>
            <h1 className="product-title">ZX9 SPEAKER</h1>
            <p className="product-description">
              Upgrade your sound system with the all new ZX9 active speaker. It’s a bookshelf speaker system that offers
               truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.
            </p>
            <p className="product-price">$ 4,500</p>

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
              Connect via Bluetooth or nearly any wired source. This speaker features optical, digital coaxial, USB Type-B, stereo RCA, and stereo XLR inputs, allowing you to have up to five wired source devices connected for
               easy switching. Improved bluetooth technology offers near lossless audio quality at up to 328ft (100m).
              <br />
              <br />
              Discover clear, more natural sounding highs than the competition with ZX9’s signature planar diaphragm tweeter. Equally important is its powerful room-shaking bass courtesy of a 6.5” aluminum alloy bass unit. You’ll be able to enjoy equal sound quality whether in a large room or small den. Furthermore,
            you will experience new sensations from old songs since it can respond to even the subtle waveforms.
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
                <span className="box-item-name">10m Optical Cable</span>
              </li>
            </ul>
          </aside>
        </section>

        <section className="gallery-section">
          <div className="gallery-left">
            <figure>
              <img src="/Images/bitmap-7.png" alt="Product detail 1" className="gallery-img-1" />
            </figure>
            <figure>
              <img src="/Images/bitmap-8.png" alt="Product detail 2" className="gallery-img-2" />
            </figure>
          </div>
          <figure className="gallery-right">
            <img src="/Images/bitmap-9.png" alt="Product detail 3" className="gallery-img-3" />
          </figure>
        </section>

        <section className="you-may-like-section">
          <h2 className="you-may-like-title">You may also like</h2>
          <div className="related-products">
            <article className="related-product">
              <img src="/Images/group-12-4.png" alt="ZX7 SPEAKER" className="related-product-image" />
              <h3 className="related-product-title">ZX7 SPEAKER</h3>
              <Link href="/speakers/zx7">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>

            <article className="related-product">
              <img src="/Images/group-12.png" alt="XX59" className="related-product-image" />
              <h3 className="related-product-title">XX99 MARK I</h3>
              <Link href="/headphones/xx99-mark-one">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>

            <article className="related-product">
              <img src="/Images/group-12-1.png" alt="ZX9 Speaker" className="related-product-image" />
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