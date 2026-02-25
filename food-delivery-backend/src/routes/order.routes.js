import express from "express";
import { body } from "express-validator";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
} from "../controllers/order.controller.js";

const router = express.Router();

const orderValidation = [
    body("customer.name").trim().notEmpty().withMessage("Name is required"),
    body("customer.address").trim().notEmpty().withMessage("Address is required"),
    body("customer.phone")
        .trim()
        .notEmpty().withMessage("Phone is required")
        .isMobilePhone().withMessage("Invalid phone number"),
    body("items").isArray({ min: 1 }).withMessage("Cart cannot be empty"),
    body("items.*.menuItem").notEmpty().withMessage("Each item must have a menuItem ID"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
];

router.get("/", getAllOrders);
router.post("/", orderValidation, createOrder);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

export default router;