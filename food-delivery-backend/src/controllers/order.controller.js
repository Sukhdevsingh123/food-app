import { validationResult } from "express-validator";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";


export const createOrder = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { items, customer } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let totalAmount = 0;

        for (let item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
            }
            totalAmount += menuItem.price * item.quantity;
        }

        const order = await Order.create({ items, customer, totalAmount });

        req.app.get("io").emit("orderStatusUpdate", {
            orderId: order._id,
            status: order.status
        });

        simulateOrderStatus(order._id, req.app.get("io"));

        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};


export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("items.menuItem").sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        next(err);
    }
};


export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.menuItem");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (err) {
        next(err);
    }
};


export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        req.app.get("io").emit("orderStatusUpdate", { orderId: order._id, status: order.status });

        res.json(order);
    } catch (err) {
        next(err);
    }
};


const simulateOrderStatus = (orderId, io) => {
    const steps = [
        { status: "Preparing", delay: 5000 },
        { status: "Out for Delivery", delay: 10000 },
        { status: "Delivered", delay: 15000 }
    ];

    steps.forEach(({ status, delay }) => {
        setTimeout(async () => {
            try {
                await Order.findByIdAndUpdate(orderId, { status });
                io.emit("orderStatusUpdate", { orderId, status });
            } catch (err) {
                console.error("Status update error:", err);
            }
        }, delay);
    });
};