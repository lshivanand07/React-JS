import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fetchCartDetails, deleteCartItem } from '../src/services/cartApi';
import CartDataContainer from '../src/pages/Cart/Cart';
import { vi } from 'vitest';

vi.mock('../src/services/cartApi', () => ({
  fetchCartDetails: vi.fn(),
  deleteCartItem: vi.fn(),
}));

const store = configureStore({
  reducer: {
    cart: () => ({
      cartItem: [
        [
          {
            product_id: 1,
            variant_id: 1,
            product_name: 'T-Shirt',
            price: 100,
            quantity: 2,
            color: 'Black',
            size: 'M',
            description: 'Test Product',
            image_url: 'image.jpg',
            discount_percentage: 10,
          },
        ],
      ],
    }),
  },
});

describe('Cart Page', () => {
  test('fetches and displays cart items', async () => {
    vi.mocked(fetchCartDetails).mockResolvedValue([
      [
        {
          product_id: 1,
          variant_id: 1,
          product_name: 'T-Shirt',
          price: 100,
          quantity: 2,
          color: 'Black',
          size: 'M',
          description: 'Test Product',
          image_url: 'image.jpg',
          discount_percentage: 10,
        },
      ],
    ] as any);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartDataContainer />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText('T-Shirt')).toBeInTheDocument();

    expect(fetchCartDetails).toHaveBeenCalledTimes(1);
     expect(
    await screen.findByRole('button', {
      name: 'PLACE ORDER',
    })
  ).toBeInTheDocument();
  });

  test('shows empty cart message', async () => {
  vi.mocked(fetchCartDetails).mockResolvedValue({
    message: 'Cart is empty',
  } as any);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CartDataContainer />
      </MemoryRouter>
    </Provider>
  );

  expect(
    await screen.findByText('Cart is empty')
  ).toBeInTheDocument();
});

test('opens delete confirmation popup', async () => {
  vi.mocked(fetchCartDetails).mockResolvedValue([
    [
      {
        product_id: 1,
        variant_id: 1,
        product_name: 'T-Shirt',
        price: 100,
        quantity: 1,
      },
    ],
  ] as any);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CartDataContainer />
      </MemoryRouter>
    </Provider>
  );

  const deleteBtn = await screen.findByRole('button', {
    name: 'Delete',
  });

  fireEvent.click(deleteBtn);

  expect(
    screen.getByText('Are you sure you want to delete this item?')
  ).toBeInTheDocument();
});

test('deletes cart item successfully', async () => {
  vi.mocked(fetchCartDetails).mockResolvedValue([
    [
      {
        product_id: 1,
        variant_id: 1,
        product_name: 'T-Shirt',
        price: 100,
        quantity: 1,
      },
    ],
  ] as any);

  vi.mocked(deleteCartItem).mockResolvedValue({
    message: 'Item deleted successfully',
  } as any);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CartDataContainer />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(
    await screen.findByRole('button', { name: 'Delete' })
  );

  fireEvent.click(
    screen.getByRole('button', { name: 'Ok' })
  );

  await waitFor(() => {
    expect(deleteCartItem).toHaveBeenCalledTimes(1);
  });

  expect(
    screen.getAllByText('Item deleted successfully')
  ).toHaveLength(2);
});
});