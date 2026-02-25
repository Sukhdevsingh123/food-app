import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';
import { jest } from '@jest/globals';
import { connect, clearDatabase, closeDatabase } from '../test-setup.js';

beforeAll(async () => await connect());
beforeEach(async () => {
    await clearDatabase();
    // Mock io on app so simulateOrderStatus doesn't crash during tests
    app.set('io', { emit: jest.fn() });
});
afterAll(async () => await closeDatabase());

describe('Order API', () => {
    let mockCategory;
    let mockMenuItem;

    const mockCustomer = {
        name: 'John Doe',
        address: '123 Main St, New York',
        phone: '1234567890'
    };

    beforeEach(async () => {
        mockCategory = await Category.create({ name: 'Pizza', image: 'pizza.png' });
        mockMenuItem = await MenuItem.create({
            name: 'Margherita Pizza',
            description: 'Classic cheese and tomato',
            price: 15.99,
            image: 'margherita.png',
            category: mockCategory._id
        });
    });

    describe('POST /api/orders', () => {
        it('should create a new order', async () => {
            const orderPayload = {
                items: [{ menuItem: mockMenuItem._id, quantity: 2 }],
                customer: mockCustomer
            };

            const res = await request(app).post('/api/orders').send(orderPayload);

            expect(res.statusCode).toEqual(201);
            expect(res.body.customer.name).toEqual(mockCustomer.name);
            expect(res.body.totalAmount).toEqual(31.98); // 15.99 * 2
            expect(res.body.status).toEqual('Order Received');
        });

        it('should validate inputs carefully (missing items)', async () => {
            const orderPayload = {
                // missing items
                customer: mockCustomer
            };

            const res = await request(app).post('/api/orders').send(orderPayload);

            expect(res.statusCode).toEqual(400); // Because of empty cart check
        });

        it('should handle non-existent menu items', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const orderPayload = {
                items: [{ menuItem: fakeId, quantity: 1 }],
                customer: mockCustomer
            };

            const res = await request(app).post('/api/orders').send(orderPayload);
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toContain('Menu item not found');
        });
    });

    describe('GET /api/orders', () => {
        beforeEach(async () => {
            await Order.create({
                items: [{ menuItem: mockMenuItem._id, quantity: 1 }],
                customer: mockCustomer,
                totalAmount: 15.99
            });
        });

        it('should fetch all orders', async () => {
            const res = await request(app).get('/api/orders');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            // It populates items
            expect(res.body[0].items[0].menuItem.name).toEqual('Margherita Pizza');
        });
    });

    describe('GET /api/orders/:id', () => {
        let orderId;

        beforeEach(async () => {
            const order = await Order.create({
                items: [{ menuItem: mockMenuItem._id, quantity: 1 }],
                customer: mockCustomer,
                totalAmount: 15.99
            });
            orderId = order._id;
        });

        it('should fetch an order by ID', async () => {
            const res = await request(app).get(`/api/orders/${orderId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.customer.name).toEqual('John Doe');
            expect(res.body.items[0].menuItem.name).toEqual('Margherita Pizza');
        });

        it('should return 404 for invalid order ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/orders/${fakeId}`);
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PATCH /api/orders/:id/status', () => {
        let orderId;

        beforeEach(async () => {
            const order = await Order.create({
                items: [{ menuItem: mockMenuItem._id, quantity: 1 }],
                customer: mockCustomer,
                totalAmount: 15.99
            });
            orderId = order._id;
        });

        it('should update the order status', async () => {
            const res = await request(app).patch(`/api/orders/${orderId}/status`).send({ status: 'Preparing' });
            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('Preparing');
        });

        it('should reject invalid status', async () => {
            const res = await request(app).patch(`/api/orders/${orderId}/status`).send({ status: 'Eating' });
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Invalid status value');
        });
    });
});
