"use client";

import React from "react";
import Link from "next/link";
import "@/styles/headphones.css";
import CategorySection from "@/components/CategorySection";
import TopGear from "@/components/BestGear";
import Footer from "@/components/Footer";

export default function Headphones() {
  return (
    <div className="hp-page">
      <header className="hp-hero">
        <h1 className="hp-hero-title">EARPHONES</h1>
      </header>

      <section className="hp-container" aria-labelledby="hp-product-1">
        <div className="hp-image">
          <img src="/images/group-3-6.png" alt="yx1" />
        </div>
        <div className="hp-text" id="hp-product-1">
          <div className="hp-text-inner">
            <p className="hp-new">NEW PRODUCT</p>
            <h2 className="hp-title">
             YX1<br />SPEAKER
            </h2>
            <p className="hp-desc">
              Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.
            </p>
            <Link href="/earphones/yx1" className="hp-cta">
              SEE PRODUCT
            </Link>
          </div>
        </div>
      </section>

      <div className="hp-bottom-sections">
        <CategorySection />
        <TopGear />
      </div>
    </div>
  );
}