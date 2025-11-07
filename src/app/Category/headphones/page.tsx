"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "@/styles/headphones.css";
import CategorySection from "@/components/CategorySection";
import TopGear from "@/components/BestGear";
import Footer from "@/components/Footer";

export default function Headphones() {
  return (
    <div className="hp-page">
      <header className="hp-hero">
        <h1 className="hp-hero-title">HEADPHONES</h1>
      </header>

      <section className="hp-container" aria-labelledby="hp-product-1">
        <div className="hp-image">
          <Image
            src="/images/Group 3.png"
            alt="XX99 Mark II"
            width={540}
            height={560}
            priority
          />
        </div>
        <div className="hp-text" id="hp-product-1">
          <div className="hp-text-inner">
            <p className="hp-new">NEW PRODUCT</p>
            <h2 className="hp-title">
              XX99 Mark II<br />Headphones
            </h2>
            <p className="hp-desc">
              The new XX99 Mark II headphones is the pinnacle of pristine audio.
              It redefines your premium headphone experience by reproducing the
              balanced depth and precision of studio-quality sound.
            </p>
            <Link href="/headphones/xx99-mark-two" className="hp-cta">
              SEE PRODUCT
            </Link>
          </div>
        </div>
      </section>

      <section className="hp-container hp-reverse" aria-labelledby="hp-product-2">
        <div className="hp-image">
          <Image
            src="/images/Group 3 (1).png"
            alt="XX99 Mark I"
            width={540}
            height={560}
            priority
          />
        </div>
        <div className="hp-text" id="hp-product-2">
          <div className="hp-text-inner">
            <h2 className="hp-title">
              XX99 Mark I<br />Headphones
            </h2>
            <p className="hp-desc">
              As the gold standard for headphones, the classic XX99 Mark I offers
              detailed and accurate audio reproduction for audiophiles and professionals alike.
            </p>
            <Link href="/headphones/xx99-mark-one" className="hp-cta">
              SEE PRODUCT
            </Link>
          </div>
        </div>
      </section>

      <section className="hp-container" aria-labelledby="hp-product-3">
        <div className="hp-image">
          <Image
            src="/images/Group 3 (2).png"
            alt="XX59"
            width={540}
            height={560}
            priority
          />
        </div>
        <div className="hp-text" id="hp-product-3">
          <div className="hp-text-inner">
            <h2 className="hp-title">
              XX59<br />Headphones
            </h2>
            <p className="hp-desc">
              Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59. Stylish, comfortable, and truly portable.
            </p>
            <Link href="/headphones/xx59" className="hp-cta">
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