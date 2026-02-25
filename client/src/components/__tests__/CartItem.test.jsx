import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartItem from '../CartItem';
import { useCart } from '../../context/CartContext';

vi.mock('../../context/CartContext', () => ({
    useCart: vi.fn(),
}));

describe('CartItem Component', () => {
    const mockItem = {
        _id: '123',
        name: 'Test Burger',
        price: 15.00,
        image: 'burger.jpg',
        quantity: 2
    };

    const mockUpdateQuantity = vi.fn();
    const mockRemoveFromCart = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useCart.mockReturnValue({
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart
        });
    });

    it('renders cart item correctly', () => {
        render(<CartItem item={mockItem} />);

        expect(screen.getByText('Test Burger')).toBeInTheDocument();
        expect(screen.getByText('₹15 each')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // quantity
        expect(screen.getByText('₹30')).toBeInTheDocument(); // subtotal
        expect(screen.getByRole('img')).toHaveAttribute('src', 'burger.jpg');
    });

    it('calls updateQuantity on increase', () => {
        render(<CartItem item={mockItem} />);

        const increaseBtn = screen.getByRole('button', { name: /Increase quantity/i });
        fireEvent.click(increaseBtn);

        expect(mockUpdateQuantity).toHaveBeenCalledWith('123', 3);
    });

    it('calls updateQuantity on decrease when quantity > 1', () => {
        render(<CartItem item={mockItem} />);

        const decreaseBtn = screen.getByRole('button', { name: /Decrease quantity/i });
        fireEvent.click(decreaseBtn);

        expect(mockUpdateQuantity).toHaveBeenCalledWith('123', 1);
    });

    it('calls removeFromCart on decrease when quantity is 1', () => {
        const itemQuantity1 = { ...mockItem, quantity: 1 };
        render(<CartItem item={itemQuantity1} />);

        const decreaseBtn = screen.getByRole('button', { name: /Decrease quantity/i });
        fireEvent.click(decreaseBtn);

        expect(mockRemoveFromCart).toHaveBeenCalledWith('123');
    });

    it('calls removeFromCart when remove button is clicked', () => {
        render(<CartItem item={mockItem} />);

        const removeBtn = screen.getByRole('button', { name: /Remove item/i });
        fireEvent.click(removeBtn);

        expect(mockRemoveFromCart).toHaveBeenCalledWith('123');
    });
});
