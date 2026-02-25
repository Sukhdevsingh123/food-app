# Food Delivery App - Order Management Feature

## Project Overview

This project is a functional Order Management feature for a food delivery application. It allows users to browse a menu, add items to their cart, proceed to checkout, and track their order status in real-time. 

### What Problem Does This Solve?
Building an intuitive and seamless food ordering experience requires robust state management on the frontend and reliable real-time communication from the backend. This project solves that by providing:
1. **Interactive Menu Display**: A responsive grid to browse food categories and items.
2. **Dynamic Cart Management**: Real-time quantity adjustments and cart updates.
3. **Seamless Order Placement**: A checkout form that validates user details and securely submits the order.
4. **Real-Time Order Tracking**: Utilizing WebSockets (Socket.io) to instantly push simulated status updates ("Order Received" -> "Preparing" -> "Out for Delivery" -> "Delivered") explicitly to the client without page refreshes.

---

# Project Screenshots

<div align="center">
  <a href="https://food-app-beta-smoky.vercel.app/">
    <img src="https://raw.githubusercontent.com/Sukhdevsingh123/Allergen-Label-displayer/main/client/src/assets/1.png" alt="Allergen Label Displayer Screenshot 1" width="800"/>
  </a>
  <br/><br/>
  <a href="https://food-app-beta-smoky.vercel.app/">
    <img src="https://raw.githubusercontent.com/Sukhdevsingh123/Allergen-Label-displayer/main/client/src/assets/2.png" alt="Allergen Label Displayer Screenshot 2" width="800"/>
  </a>
  <br/><br/>
  <a href="https://food-app-beta-smoky.vercel.app/">
    <img src="https://raw.githubusercontent.com/Sukhdevsingh123/Allergen-Label-displayer/main/client/src/assets/3.png" alt="Allergen Label Displayer Screenshot 3" width="800"/>
  </a>
</div>


---
## Architecture & Tech Stack

### Frontend
- **React 19 & Vite**: Fast, modern frontend library and build tool.
- **TailwindCSS**: Utility-first CSS framework for beautiful, responsive design.
- **Context API**: Handles global state for the Cart and Toasts (notifications).
- **Socket.io-Client**: Connects to the backend WebSocket for real-time status updates.
- **Vitest & React Testing Library**: Used for thorough UI component testing.

### Backend
- **Node.js & Express**: Fast, unopinionated web framework for building the REST API.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling library to persist Menu Items, Categories, and Orders.
- **Socket.io**: Enables real-time, bi-directional communication between the server and the frontend.
- **Jest & Supertest**: Used for comprehensive backend API and validation testing (in-memory MongoDB).

---

## Backend API Endpoints

The REST API is built with modular routing, input validation (using `express-validator`), and clear separation of concerns.

### Menu API
- `GET /api/menu`: Fetches all available menu items. Can be filtered by passing a `?category=Name` query parameter.

### Orders API
- `POST /api/orders`: Creates a new order. Expects a fully-detailed JSON body containing cart items and secure `.trim()` validated customer information (Name, Address, valid 10-digit Phone).
- `GET /api/orders`: Fetches a list of all historical placed orders.
- `GET /api/orders/:id`: Retrieves specific nested details for a single order by ID.
- `PATCH /api/orders/:id/status`: Updates the status of an active order securely. Validates that the requested status rigidly matches predefined options before emitting real-time socket updates.

---

## How to Run This Project Locally

### Prerequisites
Make sure you have **Node.js** (v18+ recommended) and **MongoDB** installed and running on your local machine.

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd food-delivery-backend
```

Install dependencies:
```bash
npm install
```

Set up your environment variables. Create a `.env` file in the `food-delivery-backend` directory:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/food_delivery
```

Seed the database with initial food categories and menu items:
```bash
npm run seed
```

Start the backend server (runs on `http://localhost:5001` by default):
```bash
npm run dev
```

### 2. Frontend Setup

Open a new terminal and navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the Vite development server (runs on `http://localhost:5173` by default):
```bash
npm run dev
```

Once both servers are running, open `http://localhost:5173` in your browser to interact with the app.

---

## Running Automated Tests (TDD)

This project strictly follows Test-Driven Development (TDD) principles.

**To test the Backend API (CRUD & Validation):**
```bash
cd food-delivery-backend
npm test
```

**To test the Frontend Components (UI & Logic):**
```bash
cd client
npm test
```
