# Audiophile E-commerce Platform

## Overview
*Audiophile* is a modern, responsive e-commerce platform built with *Next.js* and *TypeScript. It allows users to browse and purchase audio products, with a fully functional checkout system integrated with a **Convex backend*. The platform emphasizes pixel-perfect UI fidelity, accessibility, and seamless user experience across all devices.

---

## Features

### Core Features
- Pixel-perfect UI based on the Audiophile Figma design
- Product browsing and category filtering (Headphones, Speakers, Earphones)
- Fully functional *checkout system*
  - Collects user details: Name, Email, Phone, Address, ZIP, City, Country
  - Inline form validation with error messages
  - Handles invalid inputs, empty cart, duplicate submissions
- Orders stored in *Convex* backend
  - Stores customer details, items purchased, totals, shipping, VAT, and timestamps
- Order confirmation page displaying order summary, total amounts, and shipping info
- Responsive design for mobile, tablet, and desktop
- Accessible forms, navigation, and error handling

---

## Preview

![Preview](./public/images/preview.png)

---

### Static Assets
- All images and icons served from the /public/images folder
- Images rendered using standard HTML <img> tags
- Compatible with Next.js static rendering and production builds

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TypeScript |
| Styling | CSS Modules / Custom CSS |
| Backend | Convex (orders and state management) |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/audiophile.git
cd audiophile

2. Install Dependencies

npm install

3. Set Environment Variables

Create a .env.local file in the root directory with the following:

NEXT_PUBLIC_CONVEX_URL=<your_convex_public_url>
NEXT_PUBLIC_CONVEX_API_KEY=<your_convex_api_key>

4. Run Development Server

npm run dev

The app will be available at http://localhost:3000.

5. Build for Production

npm run build
npm run start

---

## Deployment

The project is deployed on Vercel:
https://your-vercel-deployment-url.vercel.app