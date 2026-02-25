# Initial Setup Before Recording
Before hitting record, ensure you have:
1. Your frontend running (`npm run dev` in `client`).
2. Your backend running (`npm run dev` in `food-delivery-backend`).
3. Both terminal windows visible or easily accessible.
4. Your IDE (VS Code) open with the project structure visible.
5. Your web browser open to `http://localhost:5173`.

---

# Loom Video Script (12-15 Minutes)

## 1. Introduction (1 min)
**[Screen: Show the running web application in the browser]**

"Hi everyone, my name is Sukhdev, and today I'll be walking you through the Order Management feature I've built for a food delivery application. The goal of this assessment was to create a functional app that allows users to place orders, view a menu, and track their order status in real-time. 

I'll be explaining how I structured the application, running through a quick demo, discussing the architecture, my testing strategy, and how I leveraged AI tools to speed up my workflow."

## 2. Quick Demo (2-3 mins)
**[Screen: Stay on the browser, interact with the app]**

"First, let's take a quick look at the application in action. 
* As you can see, on the home page, we have our `Menu Display` fetching items directly from the backend. 
* I can filter the items by category *(click a category filter if applicable, or just scroll)*.
* I'll add a couple of items to my cart. Notice the toast notification giving immediate feedback *(click "Add" on a few items)*.
* Now, let's head over to the Cart. Here, the user can easily update quantities or remove items, and the subtotal calculates dynamically *(demonstrate increasing/decreasing quantity)*.
* Next, I'll proceed to the checkout form. This form handles input validation, so if I try to submit it empty, it blocks me *(click Place Order to show errors)*. 
* I'll fill in my delivery details—name, address, and a valid 10-digit phone number—and place the order.
* *(Submit the order)* This immediately routes me to the Order Status page. Look here—it says 'Order Received'. Because I've implemented WebSockets using Socket.io, watch the screen. In a few seconds, the backend will simulate a status update, and this UI will update automatically to 'Preparing', then 'Out for Delivery', and finally 'Delivered', without me having to refresh the page."

## 3. Architecture and Design Choices (3-4 mins)
**[Screen: Switch to VS Code, show folder structure]**

"Now, let's dive into the code. I adopted a standard MERN stack architecture—MongoDB, Express, React, and Node.js. 

**Backend (`food-delivery-backend`):**
* I structured the backend cleanly using the MVC (Model-View-Controller) pattern. 
* *[Open `routes/order.routes.js` and `controllers/order.controller.js`]* Here in the backend, I have separate routes for the menu and orders. In the `order.controller`, you can see the REST API endpoints. We have `POST /api/orders` to create an order, and a `setTimeout` chain that triggers `socket.emit` to simulate the real-time status progression. 
* *[Open `models/Order.js`]* I used Mongoose to define strict schemas for the Menu Items and Orders, ensuring data integrity before it even hits the database.

**Frontend (`client`):**
* On the frontend, I used React with Vite for a fast development experience, and TailwindCSS to manage the UI. My main focus for the UI was making it clean, responsive, and intuitive.
* *[Open `context/CartContext.jsx`]* I chose to use the React Context API for state management rather than Redux, because Context is perfectly lightweight and sufficient for managing the Cart and Toast notifications across the app. 
* *[Open `components/OrderStatus.jsx`]* In the `OrderStatus` component, this `useEffect` hook connects to the Socket.io server. It listens for the 'orderStatusUpdate' event and updates the React state locally, which is what triggers the visual progress bar you saw earlier."

## 4. Test-Driven Development (TDD) (2-3 mins)
**[Screen: Switch to Terminal or show test files in VS Code]**

"A major requirement for this project was Test-Driven Development, and I took that very seriously. 

* *[Open `src/__tests__/order.test.js` in backend]* On the backend, I used Jest along with Supertest. Importantly, I incorporated `mongodb-memory-server`. This spins up a temporary, in-memory database during the test run so my tests are completely isolated and don't muddy my actual development database. I wrote tests verifying CRUD operations, ensuring users can't submit empty carts, and checking that the order status updates correctly. 
* *[Run `npm test` in the backend terminal]* As you can see, all backend tests pass seamlessly.

* *[Open `src/components/__tests__/CheckoutForm.test.jsx` in frontend]* On the frontend, I used Vitest and React Testing Library. I focused my tests on the critical user paths: verifying the `MenuCard` adds items correctly, checking the `CartItem` increment logic, and simulating form submissions on the `CheckoutForm` to catch validation errors.
* *[Run `npm test` in the frontend terminal]* Running the frontend tests yields a passing suite as well."

## 5. Use of AI Tools during Development (1-2 mins)
**[Screen: VS Code or face camera]**

"I actively utilized AI tools during exactly this cycle to accelerate development without compromising quality.

* **Code Generation:** I used AI to quickly scaffold out the boilerplate for my React components and Mongoose schemas. For instance, creating the UI for the progressive step tracker on the order status page—I gave the AI my Tailwind design constraints, and it generated the complex layout efficiently.
* **Testing:** Writing thorough test suites can be repetitive. I leaned on AI to generate permutations of edge cases for the `CheckoutForm.test.jsx`. I also used AI to debug an issue I ran into with Jest scoping where `mongodb-memory-server` wasn't initializing early enough in the test lifecycle.
* **Refactoring:** After implementing an initial working version, I used AI to ensure my Context API usage was fully optimized and to recommend minor UI/UX enhancements like hover effects."

## 6. Challenges Faced & Solutions (1-2 mins)
**[Screen: Face camera]**

"As for challenges, the main one I encountered was ensuring the database schemas were registered correctly in Mongoose before they were queried. Early on, I was hitting a `MissingSchemaError` when trying to fetch the menu because the `Category` schema wasn't bound before the `MenuItem` query ran. I solved this by strictly ordering my model imports in `server.js` to ensure Mongoose recognized all references prior to route initialization.

Another challenge was managing the real-time Socket.io connections in React. Initially, the component was rendering twice due to React Strict Mode, which caused multiple socket listeners to attach, leading to erratic status jumps. I solved this by utilizing a `useRef` to track if the component was mounted, and ensuring I properly called `socket.off()` in the `useEffect` cleanup function to prevent memory leaks."

## 7. Conclusion (30 seconds)
"To wrap up, this project successfully implements a scalable, real-time food ordering flow. The code is modular, fully tested, and the UI is very user-friendly. The repository is public on GitHub, and the live application is hosted on Vercel for you to try out.

Thank you very much for your time, and I look forward to your feedback!"
