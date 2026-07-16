import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

import HomeContainer from '../src/pages/Home/Home';
import { fetchProductDetails } from '../src/services/ProductApi';

vi.mock('../src/services/ProductApi', () => ({
  fetchProductDetails: vi.fn(),
}));

vi.mock('../src/components/Buttons/Button', () => ({
  default: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

vi.mock('../src/hoc/withLoader', () => ({
  default: (Component: any) => Component,
}));

vi.mock('../src/hoc/withErrorHandling', () => ({
  default: (Component: any) => Component,
}));

const mockUseLocation = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');

  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    useNavigate: () => mockNavigate,
  };
});

const products = [
  {
    product_id: 1,
    product_name: 'Laptop',
    description: 'Dell Laptop',
    image_url: 'test.jpg',
    discount_percentage: 10,
  },
];

const createStore = (productData: any[]) =>
  configureStore({
    reducer: {
      product: () => ({
        productItem: productData,
      }),
    },
  });

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  mockUseLocation.mockReturnValue({
    state: {},
  });
});

describe('Home Page', () => {
  test('renders product data', () => {
    const store = createStore(products);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomeContainer />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Dell Laptop')).toBeInTheDocument();
  });

  test('calls fetchProductDetails on mount', async () => {
    (fetchProductDetails as any).mockResolvedValue(products);

    const store = createStore([]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomeContainer />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(fetchProductDetails).toHaveBeenCalledTimes(1);
    });
  });

  test('filters matching products', () => {
    mockUseLocation.mockReturnValue({
      state: {
        product_name: 'lap',
      },
    });

    const store = createStore(products);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomeContainer />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  test('shows product not found message', () => {
    mockUseLocation.mockReturnValue({
      state: {
        product_name: 'mobile',
      },
    });

    const store = createStore(products);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomeContainer />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  test('shows Home Page button when no product found', () => {
    mockUseLocation.mockReturnValue({
      state: {
        product_name: 'mobile',
      },
    });

    const store = createStore(products);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomeContainer />
        </MemoryRouter>
      </Provider>
    );

    const HomeButton = screen.getByRole('button', {
      name: 'Home Page',
    });
    expect(HomeButton).toBeInTheDocument();

    fireEvent.click(HomeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
