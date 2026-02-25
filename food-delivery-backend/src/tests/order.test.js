import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";
import { connectDB, closeDB, clearDB } from "./setup.js";
import { jest } from "@jest/globals";
// need to mock socket io server to inject into req.app
import { Server } from "socket.io";
import http from "http";

let server;
let io;
let testCategory;
let testMenuItem;

beforeAll(async () => {
    await connectDB();
    server = http.createServer(app);
    io = { emit: jest.fn(), on: jest.fn() }; // Mock socket.io
    app.set("io", io);

    testCategory = await Category.create({ name: "Test Burger" });
    testMenuItem = await MenuItem.create({
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with cheddar cheese",
        price: 199,
        image: "test.jpg",
        category: testCategory._id
    });
});

afterAll(async () => {
    await closeDB();
});

afterEach(async () => {
    await Order.deleteMany({});
    jest.clearAllMocks();
});

describe("Order Endpoints", () => {
    describe("POST /api/orders", () => {
        it("should create a new order successfully", async () => {
            const orderPayload = {
                items: [{ menuItem: testMenuItem._id, quantity: 2 }],
                customer: { name: "John Doe", address: "123 Main St", phone: "1234567890" }
            };

            const res = await request(app)
                .post("/api/orders")
                .send(orderPayload)
                .expect(201);

            expect(res.body.customer.name).toBe("John Doe");
            expect(res.body.totalAmount).toBe(398); // 199 * 2
            expect(res.body.status).toBe("Order Received");

            // Ensure real-time event was emitted
            expect(io.emit).toHaveBeenCalledWith("orderStatusUpdate", expect.any(Object));

            // Verify DB storage
            const savedOrder = await Order.findById(res.body._id);
            expect(savedOrder).toBeTruthy();
            expect(savedOrder.totalAmount).toBe(398);
        });

        it("should fail when cart is empty", async () => {
            const orderPayload = {
                items: [],
                customer: { name: "John Doe", address: "123 Main St", phone: "1234567890" }
            };

            const res = await request(app)
                .post("/api/orders")
                .send(orderPayload)
                .expect(400);

            expect(res.body.errors[0].msg).toBe("Cart cannot be empty");
        });

        it("should fail validation if missing customer phone", async () => {
            const orderPayload = {
                items: [{ menuItem: testMenuItem._id, quantity: 1 }],
                customer: { name: "John Doe", address: "123 Main St" }
            };

            const res = await request(app)
                .post("/api/orders")
                .send(orderPayload)
                .expect(400);

            expect(res.body.errors).toBeDefined();
        });
    });

    describe("GET /api/orders", () => {
        it("should get all orders", async () => {
            await Order.create({
                items: [{ menuItem: testMenuItem._id, quantity: 1 }],
                customer: { name: "Jane", address: "Apt 2", phone: "0987654321" },
                totalAmount: 199
            });

            const res = await request(app).get("/api/orders").expect(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(1);
            expect(res.body[0].customer.name).toBe("Jane");
            expect(res.body[0].items[0].menuItem.name).toBe("Classic Cheeseburger");
        });
    });

    describe("GET /api/orders/:id", () => {
        it("should get a single order by ID", async () => {
            const order = await Order.create({
                items: [{ menuItem: testMenuItem._id, quantity: 1 }],
                customer: { name: "Mark", address: "Apt 3", phone: "111222333" },
                totalAmount: 199
            });

            const res = await request(app).get(`/api/orders/${order._id}`).expect(200);
            expect(res.body.customer.name).toBe("Mark");
            expect(res.body.items[0].menuItem.name).toBe("Classic Cheeseburger");
        });

        it("should return 404 for invalid order ID", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/orders/${fakeId}`).expect(404);
            expect(res.body.message).toBe("Order not found");
        });
    });

    describe("PATCH /api/orders/:id/status", () => {
        it("should update order status successfully", async () => {
            const order = await Order.create({
                items: [{ menuItem: testMenuItem._id, quantity: 1 }],
                customer: { name: "Sarah", address: "Apt 4", phone: "444555666" },
                totalAmount: 199,
                status: "Order Received"
            });

            const res = await request(app)
                .patch(`/api/orders/${order._id}/status`)
                .send({ status: "Preparing" })
                .expect(200);

            expect(res.body.status).toBe("Preparing");
            expect(io.emit).toHaveBeenCalledWith("orderStatusUpdate", expect.any(Object));
        });

        it("should reject invalid status updates", async () => {
            const order = await Order.create({
                items: [{ menuItem: testMenuItem._id, quantity: 1 }],
                customer: { name: "Sarah", address: "Apt 4", phone: "444555666" },
                totalAmount: 199,
                status: "Order Received"
            });

            const res = await request(app)
                .patch(`/api/orders/${order._id}/status`)
                .send({ status: "Cooking" }) // Invalid status
                .expect(400);

            expect(res.body.message).toBe("Invalid status value");
        });
    });
});
