import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MenuCard from '../MenuCard';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

// Mock contexts
vi.mock('../../context/CartContext', () => ({
    useCart: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
    useToast: vi.fn(),
}));

describe('MenuCard Component', () => {
    const mockItem = {
        _id: '123',
        name: 'Test Pizza',
        description: 'Delicious test pizza',
        price: 10.99,
        image: 'pizza.jpg',
        category: { name: 'Pizza' }
    };

    const mockAddToCart = vi.fn();
    const mockAddToast = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useCart.mockReturnValue({ addToCart: mockAddToCart });
        useToast.mockReturnValue({ addToast: mockAddToast });
    });

    it('renders menu item details correctly', () => {
        render(<MenuCard item={mockItem} />);

        expect(screen.getByText('Test Pizza')).toBeInTheDocument();
        expect(screen.getByText('Delicious test pizza')).toBeInTheDocument();
        expect(screen.getByText('₹10.99')).toBeInTheDocument();
        expect(screen.getByText('Pizza')).toBeInTheDocument(); // category badge
        expect(screen.getByRole('img')).toHaveAttribute('src', 'pizza.jpg');
    });

    it('calls addToCart and addToast when "Add" button is clicked', () => {
        render(<MenuCard item={mockItem} />);

        const addButton = screen.getByRole('button', { name: /\+ Add/i });
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledWith(mockItem);
        expect(mockAddToast).toHaveBeenCalledWith('Test Pizza added to cart!', 'success');

        // Button should temporarily show "Added"
        expect(screen.getByRole('button', { name: /✓ Added/i })).toBeInTheDocument();
    });
});
