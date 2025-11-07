import React from 'react';
import Link from 'next/link';
import BestGear from '@/components/BestGear';
import '@/styles/landingpage.css';
import '@/components/CategorySection';
import '@/components/Navbar';
import CategorySection from '@/components/CategorySection';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <img 
          src="/images/Bitmap (2).png" 
          alt="XX99 Mark II Headphones" 
          className="hero-image"
        />
        <div className="hero-content">
          <p className="hero-label">NEW PRODUCT</p>
          <h1 className="hero-title">XX99 MARK II HEADPHONES</h1>
          <p className="hero-description">
            Experience natural, lifelike audio and exceptional build quality made
             for the passionate music enthusiast.
          </p>
          <Link href="/headphones/xx99-mark-two">
          <button className="cta-button primary">SEE PRODUCT</button>
          </Link>
        </div>
      </section>
<section className="category-section">
      <CategorySection />
      </section>

      

      {/* ZX9 Speaker Section */}
      <section className="zx9-section">
        <div className="zx9-container">
          <img src="/images/Group 4.png" alt="" className="zx9-pattern" />
          <img 
            src="/images/image-removebg-preview(38).png" 
            alt="ZX9 Speaker" 
            className="zx9-speaker-image"
          />
          <div className="zx9-content">
            <h2 className="zx9-title">ZX9 SPEAKER</h2>
            <p className="zx9-description">
              Upgrade to premium speakers that are phenomenally built to deliver truly remarkable sound.
            </p>
            <Link href="/speakers/zx9">
            <button className="cta-button black">SEE PRODUCT</button></Link>
          </div>
        </div>
      </section>

      {/* ZX7 Speaker Section */}
      <section className="zx7-section">
        <div className="zx7-container">
          <img src="/images/Bitmap2.png" alt="ZX7 Speaker" className="zx7-image" />
          <div className="zx7-content">
            <h2 className="zx7-title">ZX7 SPEAKER</h2>
          <Link href="/speakers/zx7"><button className="cta-button outline">SEE PRODUCT</button></Link>
          </div>
        </div>
      </section>

      {/* YX1 Earphones Section */}
      <section className="yx1-section">
        <div className="yx1-container">
          <img src="/images/Group 12.png" alt="YX1 Earphones" className="yx1-image-left" />
          <div className="yx1-right">
            <img src="/images/Mask (5).png" alt="" className="yx1-mask" />
            <div className="yx1-content">
              <h2 className="yx1-title">YX1 EARPHONES</h2>
              <Link href="/earphones/yx1"><button className="cta-button outline">SEE PRODUCT</button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-content">
            <h2 className="about-title">
              BRINGING YOU THE <span className="highlight">BEST</span> AUDIO GEAR
            </h2>
            <p className="about-description">
              Located at the heart of New York City, Audiophile is the premier store for high end headphones, earphones, speakers, and audio accessories. We have a large showroom and luxury demonstration rooms available for you to browse and experience a wide range of our products. Stop by our store to meet some of the fantastic people who make Audiophile the best place to buy your portable audio equipment.
            </p>
          </div>
          <img 
            src="/images/Bitmap (1).png" 
            alt="Person with headphones" 
            className="about-image"
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;