# 🛍️ Ecommerce Website - Semester Project

A modern, full-stack ecommerce platform developed for my **5th Semester Web Project**. This application features a complete shopping experience, from product browsing to a secure checkout flow.

## 🚀 Features
* **User Authentication**: Secure signup and login powered by Supabase.
* **Product Management**: Dynamic product listing with category filtering.
* **Shopping Cart**: Fully functional cart and wishlist using React Context API.
* **Admin Dashboard**: Dedicated space for managing products, analytics, and transactions.
* **Responsive Design**: Mobile-friendly UI built with Tailwind CSS.
* **Secure Payments**: Integrated payment intent flow via Stripe API.

## 🛠️ Tech Stack
* **Frontend**: [Next.js](https://nextjs.org/) (App Router)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Backend/Database**: [Supabase](https://supabase.com/)
* **State Management**: React Context API
* **Middleware**: Custom Next.js middleware for protected admin routes.

## 📁 Project Structure
* `/app`: Main application routes and API handlers.
* `/components`: Reusable UI elements (Navbar, Footer, Product Cards).
* `/context`: Global state management for Auth, Cart, and Wishlist.
* `/public`: Static assets and product imagery.
* `/utils/supabase`: Database configuration and schema setup.

## ⚙️ Setup Instructions
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up your environment variables in `.env.local`.
4. Run the development server with `npm run dev`.
