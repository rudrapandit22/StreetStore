# StreetStore

A clean streetwear e-commerce store with variant support for sellers and an interactive shopping bag.

## Features

- **Product details**: View variant images, select size/color options, and check real-time stock.
- **Cart**: Add items, update quantities with stock limits, and checkout.
- **Seller dashboard**: Create products with ImageKit uploads, add variants (with individual size, color, stock, and price overrides), and manage listings.

## Razorpay Payment Integration

We started connecting the Razorpay payment gateway. You can find the order creation and verification code implemented in `Backend/src/services/payment.service.js`.

Since setting up live API keys takes time, we mapped the checkout flow to a mock service. When you click "Proceed to Checkout", the app makes an API call to empty the cart database collection and returns an "Order placed successfully" notification.

## Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, React Router, CSS
- **Backend**: Node.js, Express, Mongoose
- **Database & Uploads**: MongoDB Atlas, ImageKit

## How to Run

1. Clone and install dependencies in both folders:
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```

2. Add your environment variables in `Backend/.env`:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_url
   JWT_SECRET=your_secret

   IMAGEKIT_PUBLIC_KEY=your_key
   IMAGEKIT_PRIVATE_KEY=your_key
   IMAGEKIT_URL_ENDPOINT=your_endpoint

   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   ```

3. Run the development servers:
   ```bash
   # In Backend folder
   npm run dev

   # In Frontend folder
   npm run dev
   ```
