import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CheckoutForm from '../CheckoutForm';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

vi.mock('../../context/CartContext', () => ({
    useCart: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
    useToast: vi.fn(),
}));

vi.mock('../../services/api', () => ({
    default: {
        post: vi.fn(),
    }
}));

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

describe('CheckoutForm Component', () => {
    const mockClearCart = vi.fn();
    const mockAddToast = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        useCart.mockReturnValue({
            cart: [{ _id: 'item1', quantity: 2 }],
            clearCart: mockClearCart
        });

        useToast.mockReturnValue({ addToast: mockAddToast });
        useNavigate.mockReturnValue(mockNavigate);
    });

    it('renders checkout form correctly', () => {
        render(<CheckoutForm />);

        expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Delivery Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields on submit', async () => {
        render(<CheckoutForm />);

        fireEvent.submit(screen.getByRole('button', { name: /Place Order/i }));

        expect(await screen.findByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Address is required')).toBeInTheDocument();
        expect(screen.getByText('Phone is required')).toBeInTheDocument();
        expect(API.post).not.toHaveBeenCalled();
    });

    it('shows validation error for invalid phone number', async () => {
        render(<CheckoutForm />);

        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { name: 'name', value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Delivery Address'), { target: { name: 'address', value: '123 Main St' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { name: 'phone', value: '123' } });

        fireEvent.submit(screen.getByRole('button', { name: /Place Order/i }));

        expect(await screen.findByText('Enter a valid 10-digit phone number')).toBeInTheDocument();
        expect(API.post).not.toHaveBeenCalled();
    });

    it('submits successfully when form is valid', async () => {
        API.post.mockResolvedValue({ data: { _id: 'order123' } });

        render(<CheckoutForm />);

        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { name: 'name', value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Delivery Address'), { target: { name: 'address', value: '123 Main St' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { name: 'phone', value: '9876543210' } });

        fireEvent.submit(screen.getByRole('button', { name: /Place Order/i }));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith('/orders', {
                items: [{ menuItem: 'item1', quantity: 2 }],
                customer: { name: 'John Doe', address: '123 Main St', phone: '9876543210' }
            });
        });

        expect(mockClearCart).toHaveBeenCalled();
        expect(mockAddToast).toHaveBeenCalledWith(expect.stringContaining('successfully'), 'success');
        expect(mockNavigate).toHaveBeenCalledWith('/order/order123');
    });
});
