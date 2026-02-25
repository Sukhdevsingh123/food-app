import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderStatus from '../OrderStatus';
import API from '../../services/api';
import socket from '../../services/socket';

vi.mock('../../services/api', () => ({
    default: {
        get: vi.fn(),
    }
}));

vi.mock('../../services/socket', () => ({
    default: {
        on: vi.fn(),
        off: vi.fn(),
    }
}));

describe('OrderStatus Component', () => {
    const mockOrderDetails = { status: 'Preparing' };

    beforeEach(() => {
        vi.clearAllMocks();
        API.get.mockResolvedValue({ data: { status: 'Preparing' } });
    });

    it('renders current status correctly from props', () => {
        render(<OrderStatus orderId="123" orderDetails={mockOrderDetails} />);

        expect(screen.getByRole('heading', { level: 2, name: 'Preparing' })).toBeInTheDocument();
        expect(screen.getByText('Our chefs are preparing your delicious food...')).toBeInTheDocument();
        expect(screen.getByText(/⏱ Estimated/i)).toBeInTheDocument();
    });

    it('fetches initial status from API on mount', async () => {
        API.get.mockResolvedValue({ data: { status: 'Out for Delivery' } });

        render(<OrderStatus orderId="123" orderDetails={mockOrderDetails} />);

        expect(API.get).toHaveBeenCalledWith('/orders/123');

        await waitFor(() => {
            expect(screen.getByText('Out for Delivery')).toBeInTheDocument();
        });
    });

    it('sets up and cleans up socket listener', () => {
        const { unmount } = render(<OrderStatus orderId="123" orderDetails={mockOrderDetails} />);

        expect(socket.on).toHaveBeenCalledWith('orderStatusUpdate', expect.any(Function));

        unmount();

        expect(socket.off).toHaveBeenCalledWith('orderStatusUpdate', expect.any(Function));
    });
});
