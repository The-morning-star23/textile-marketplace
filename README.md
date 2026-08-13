# 🧵 ThreadMarket

A robust, full-stack B2B textile sourcing marketplace connecting fabric suppliers with fashion brands and bulk buyers.

ThreadMarket streamlines the complex B2B textile procurement process. It bridges the gap between wholesale suppliers and buyers by offering an intuitive e-commerce experience alongside powerful, SaaS-level inventory management tools for suppliers.

---

## Overview

ThreadMarket is designed to simplify the process of sourcing textiles in bulk while giving suppliers the tools they need to manage inventory, stock visibility, and order fulfillment efficiently.

---

## ✨ Key Features

### 🛒 For Buyers (Procurement & Sourcing)

- Smart Marketplace Feed: Browse a global catalog of fabrics with dynamic category filtering and instant search.
- Variant-Specific Purchasing: Select specific colorways with accurate hex codes and localized variant images.
- Intelligent Cart System: B2B-focused cart that enforces Minimum Order Quantities (MOQ), calculates bulk subtotals, and supports direct typing for large-scale meterage.
- Frictionless Checkout: "Buy Now" capabilities to bypass the cart, with seamless end-to-end data flow capturing exact variants.
- Real-Time Availability: Dual-layer stock validation ensures buyers cannot order fabrics that are depleted or manually paused by the supplier.
- Order Tracking Hub: A dedicated "My Purchases" dashboard to track active orders, shipping statuses, and historical procurement data.

### 🏭 For Suppliers (Inventory & Order Management)

- Professional SaaS Layout: A dedicated, sidebar-driven administrative dashboard to manage business operations efficiently.
- Live Analytics Dashboard: Real-time metrics tracking active products, pending orders, and low-inventory alerts.
- Dual-Layer Inventory Control:
  - Automatic Deduction: The database instantly mathematically deducts stock when an order is placed to prevent overselling.
  - Manual Override (Kill-Switch): A 1-click "Out of Stock" toggle allows suppliers to instantly hide products from the marketplace for quality-control emergencies without losing their exact stock counts.
- Granular Product Listings: Upload textiles with deep specifications including width, weight, composition, MOQs, and variant color arrays.

---

## 🛠️ Tech Stack

### Frontend

- Framework: Next.js (App Router)
- Library: React 18
- Styling: Tailwind CSS (Dark-mode optimized, glassmorphism UI)
- State Management: React Context API (AuthContext, CartContext)

### Backend

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB & Mongoose
- Authentication: JSON Web Tokens (JWT) & bcrypt for password hashing
- Architecture: RESTful API with distinct routing modules (productRoutes, orderRoutes, userRoutes)

---

## 🏗️ Project Structure

The repository is structured as a monorepo containing both the client and server applications.

```plaintext
threadmarket/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── buyer/      # Buyer-specific routes (Cart, Checkout, Dashboard)
│   │   │   ├── supplier/   # Supplier SaaS routes (Dashboard, Inventory, Orders)
│   │   │   ├── product/    # Dynamic product details pages
│   │   │   └── marketplace/# Global product feed
│   │   ├── context/        # Global state (Auth, Cart)
│   │   └── components/     # Reusable UI elements
│   ├── public/             # Static assets
│   └── package.json
│
└── server/                 # Express.js Backend
    ├── controllers/        # Business logic (Optional, currently routed)
    ├── models/             # Mongoose schemas (Product, Order, User)
    ├── routes/             # API endpoints
    ├── middleware/         # Auth verification (JWT)
    ├── server.js           # Entry point & DB connection
    └── package.json
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js (v16.0 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/threadmarket.git
cd threadmarket
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the server directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
npm run dev
# Server will start on http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal window, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Start the Next.js development server:

```bash
npm run dev
# Client will start on http://localhost:3000
```

---

## 🔐 Database Schemas Overview

### Product Schema (Product.js)

- Tracks core details (title, fabricType, price, images).
- Houses nested variant arrays (availableColors with hex codes and specific images).
- Enforces limits (moq, availableStock).
- Manages visibility (inStock boolean for manual supplier overrides).

### Order Schema (Order.js)

- Connects buyer and supplier via ObjectIds.
- Locks in the exact color, image, and quantity at the time of checkout.
- Tracks status (Pending, Processing, Shipped, Delivered, Cancelled).

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the Branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See LICENSE for more information.