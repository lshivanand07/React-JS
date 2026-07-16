import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrdersContainer from '../src/pages/Orders/Orders';
import { userOrders } from '../src/services/ordersApi';
import { vi } from 'vitest';
import { checkoutOrder } from '../src/services/checkoutApi';

vi.mock('../src/services/ordersApi', () => ({
  userOrders: vi.fn(),
}));

vi.mock('../src/services/checkoutApi', () => ({
  checkoutOrder: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: vi.fn((selector) =>
    selector({
      order: {
        orderItem: [
          {
            order_id: 1,
            product_name: 'Shirt',
            description: 'Cotton Shirt',
            quantity: 1,
            price: 500,
            order_status: 'Pending',
            order_date: '2026-06-25',
            state: 'Karnataka',
            districts: 'Belagavi',
            city: 'Belagavi',
            landmark: 'Bus Stand',
            pincode: '590001',
            total_amount: 500,
            discount_percentage: 0,
          },
        ],
      },
      address: {
        addressItem: [],
      },
    })
  ),
}));

describe('Orders Page', () => {
  test('renders orders heading', async () => {
    vi.mocked(userOrders).mockResolvedValue({
      message: '',
      0: [],
    } as any);

    render(
      <MemoryRouter>
        <OrdersContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /orders/i })
      ).toBeInTheDocument();
    });
  });

 test('Order placed successfully', async () => {
  vi.mocked(checkoutOrder).mockResolvedValue({
    message: 'Order placed successfully',
  } as any);

  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/orders',
          state: {
            showPaymentMethodChoice: true,
            total_price: 500,
          },
        } as any,
      ]}
    >
      <OrdersContainer />
    </MemoryRouter>
  );

  const confirmBtn = await screen.findByRole('button', {
    name: /confirm/i,
  });

  fireEvent.click(confirmBtn);

  await waitFor(() => {
    expect(checkoutOrder).toHaveBeenCalled();
  });
});
});