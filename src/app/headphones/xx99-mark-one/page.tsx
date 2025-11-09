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
      id: "xx99-mark-one",
      name: "XX99 MARK I HEADPHONES",
      price: 1750,
      quantity: quantity,
      image: "/Images/group-3-7.png",
      shortName: "XX99 MARK I HEADPHONES",
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
            <img src="/Images/group-3-7.png" alt="XX99 Mark I Headphones" />
          </figure>

          <article className="product-info">
            <h1 className="product-title">XX99 MARK I HEADPHONES</h1>
            <p className="product-description">
              As the gold standard for headphones, the classic XX99 Mark I offers
               detailed and accurate audio reproduction for audiophiles, mixing engineers, 
               and music aficionados alike in studios and on the go. 
            </p>
            <p className="product-price">$ 1,750</p>

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
              As the headphones all others are measured against, the XX99 Mark I 
              demonstrates over five decades of audio expertise, redefining the 
              critical listening experience. This pair of closed-back headphones 
              are made of industrial, aerospace-grade materials to emphasize 
              durability at a relatively light weight of 11 oz.
              <br />
              <br />
              From the handcrafted microfiber ear cushions to the robust 
              metal headband with inner damping element, the components 
              work together to deliver comfort and uncompromising sound. 
              Its closed-back design delivers up to 27 dB of passive noise cancellation,
               reducing resonance by reflecting sound to a dedicated absorber. 
               For connectivity, a specially tuned cable is included with a balanced gold connector.
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
              <img src="/Images/nice.png" alt="Product detail 1" className="gallery-img-1" />
            </figure>
            <figure>
              <img src="/Images/bitmap-3.png" alt="Product detail 2" className="gallery-img-2" />
            </figure>
          </div>
          <figure className="gallery-right">
            <img src="/Images/bitmap-4.png" alt="Product detail 3" className="gallery-img-3" />
          </figure>
        </section>

        <section className="you-may-like-section">
          <h2 className="you-may-like-title">You may also like</h2>
          <div className="related-products">
            <article className="related-product">
              <img src="/Images/group-12-3.png" alt="XX99 Mark II" className="related-product-image" />
              <h3 className="related-product-title">XX99 MARK II</h3>
              <Link href="/headphones/xx99-mark-two">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>

            <article className="related-product">
              <img src="/Images/group-12-1.png" alt="XX59" className="related-product-image" />
              <h3 className="related-product-title">XX59</h3>
              <Link href="/headphones/xx59">
                <button className="related-product-btn">See product</button>
              </Link>
            </article>

            <article className="related-product">
              <img src="/Images/group-12-2.png" alt="ZX9 Speaker" className="related-product-image" />
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