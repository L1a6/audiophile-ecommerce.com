"use client";
import React from "react";
import "@/styles/categorysection.css";

interface CategoryCardProps {
  image: string;
  title: string;
  link: string;
  cardType: 'headphones' | 'speakers' | 'earphones';
}

const CategoryCard = ({ image, title, link, cardType }: CategoryCardProps) => {
  return (
    <div className={`category-card category-card-${cardType}`}>
      <div className="category-mask"></div>
      <img src={image} alt={title} className="category-image" />
      <h3 className="category-title">{title}</h3>
      <a href={link} className="category-cta">
        <span className="cta-text">Shop</span>
        <img src="/Images/path-2.png" alt="" className="cta-icon" />
      </a>
    </div>
  );
};

const CategorySection = () => {
  return (
    <section className="category-section">
      <div className="category-container">
        <CategoryCard
          image="/Images/image-headphones.png"
          title="Headphones"
          link="/Category/headphones"
          cardType="headphones"
        />
        <CategoryCard
          image="/Images/image-speakers.png"
          title="Speakers"
          link="/Category/speakers"
          cardType="speakers"
        />
        <CategoryCard
          image="/Images/image-earphones.png"
          title="Earphones"
          link="/Category/earphones"
          cardType="earphones"
        />
      </div>
    </section>
  );
};

export default CategorySection;