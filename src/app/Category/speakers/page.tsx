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
        <h1 className="hp-hero-title">SPEAKERS</h1>
      </header>

      <section className="hp-container" aria-labelledby="hp-product-1">
        <div className="hp-image">
          <img
            src="/Images/group-3-4.png"
            alt="ZX9"
          />
        </div>
        <div className="hp-text" id="hp-product-1">
          <div className="hp-text-inner">
            <p className="hp-new">NEW PRODUCT</p>
            <h2 className="hp-title">
             ZX9<br />SPEAKER
            </h2>
            <p className="hp-desc">
              Upgrade your sound system with the all new ZX9 active speaker. It’s a bookshelf speaker system that offers truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.
            </p>
            <Link href="/speakers/zx9" className="hp-cta">
              SEE PRODUCT
            </Link>
          </div>
        </div>
      </section>

      <section className="hp-container hp-reverse" aria-labelledby="hp-product-2">
        <div className="hp-image">
          <img
            src="/Images/group-3-5.png"
            alt="ZX9"
          />
        </div>
        <div className="hp-text" id="hp-product-2">
          <div className="hp-text-inner">
            <h2 className="hp-title">
              ZX7<br />SPEAKER
            </h2>
            <p className="hp-desc">
              Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components that represents the top of the line powered speakers for home or studio use.
            </p>
            <Link href="/product/xx99-mark-i" className="hp-cta">
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