'use client';

import React from 'react';
import '@/styles/bestgear.css';

const BestGear: React.FC = () => {
  return (
    <section className="best-gear-section">
      <div className="best-gear-container">
        <div className="best-gear-content">
          <h2>
            BRINGING YOU THE <span className="highlight">BEST</span> AUDIO GEAR
          </h2>
          <p>
            Located at the heart of New York City, Audiophile is the premier store for high end headphones, earphones, speakers, and audio accessories. We have a large showroom and luxury demonstration rooms available for you to browse and experience a wide range of our products. Stop by our store to meet some of the fantastic people who make Audiophile the best place to buy your portable audio equipment.
          </p>
        </div>
        <div className="best-gear-image">
          <img src="/images/Bitmap (1).png" alt="Best Audio Gear" />
        </div>
      </div>
    </section>
  );
};

export default BestGear;