import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';
import { connect, clearDatabase, closeDatabase } from '../test-setup.js';

beforeAll(async () => await connect());
beforeEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Menu API', () => {
    let mockCategory;
    let mockMenuItem;

    beforeEach(async () => {
        mockCategory = await Category.create({
            name: 'Pizza',
            image: 'pizza.png'
        });

        mockMenuItem = await MenuItem.create({
            name: 'Margherita Pizza',
            description: 'Classic cheese and tomato',
            price: 15.99,
            image: 'margherita.png',
            category: mockCategory._id
        });
    });

    describe('GET /api/menu', () => {
        it('should fetch all menu items when no category is provided', async () => {
            const res = await request(app).get('/api/menu');

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0].name).toEqual('Margherita Pizza');
            expect(res.body[0].category.name).toEqual('Pizza');
        });

        it('should filter menu items by category', async () => {
            await MenuItem.create({
                name: 'Burger',
                description: 'Beef burger',
                price: 10.99,
                image: 'burger.png',
                category: await Category.create({ name: 'Burgers', image: 'burger.png' })._id
            });

            const res = await request(app).get('/api/menu?category=Pizza');

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0].name).toEqual('Margherita Pizza');
        });

        it('should return empty array for non-existent category', async () => {
            const res = await request(app).get('/api/menu?category=Sushi');

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
        });
    });
});
