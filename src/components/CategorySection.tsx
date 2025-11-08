"use client";
import React from "react";
import "@/styles/categorysection.css";
import Link from "next/link";


interface CategoryCardProps {
  image: string;
  title: string;
  link: string;
}

const CategoryCard = ({ image, title, link }: CategoryCardProps) => {
  return (
    <div className="category-card">
      <div className="category-mask"></div>
      <img src={image} alt={title} className="category-image" />
      <h3 className="category-title">{title}</h3>
      <a href={link} className="category-cta">
        <span className="cta-text">Shop</span>
        <img src="/images/path-2.png" alt="" className="cta-icon" />
      </a>
    </div>
  );
};

const CategorySection = () => {
  return (
    <section className="category-section">
      <div className="category-container">
        <CategoryCard
          image="/images/image-headphones.png"
          title="Headphones"
          link="/Category/headphones"
        />
        <CategoryCard
          image="/images/image-speakers.png"
          title="Speakers"
          link="/Category/speakers"
        />
        <CategoryCard
          image="/images/image-earphones.png"
          title="Earphones"
          link="/Category/earphones"
        />
      </div>
    </section>
  );
};

export default CategorySection;