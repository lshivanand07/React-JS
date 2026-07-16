import { MemoryRouter } from "react-router-dom";
import SellerContainer from "../src/pages/Seller/Seller";
import {render, screen, fireEvent} from '@testing-library/react'
import {vi} from 'vitest'

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe ('seller page', ()=>{
    test('renders seller page', () => {
  render(
    <MemoryRouter>
      <SellerContainer />
    </MemoryRouter>
  );

  expect(
    screen.getByText('Sell Online with Flipkart')
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'Start Selling' })
  ).toBeInTheDocument();
});

test('shows login button when user is not seller', () => {
  localStorage.clear();

  render(
    <MemoryRouter>
      <SellerContainer />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('button', { name: 'Login' })
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole('button', { name: 'Login' })
  );

  expect(mockNavigate).toHaveBeenCalledWith('/login');

  fireEvent.click(
    screen.getByRole('button', { name: 'Start Selling' })
  );

  expect(mockNavigate).toHaveBeenCalledWith('/signup');
});

test('seller navigates to sell new product page', () => {
  localStorage.setItem(
    'userToken',
    JSON.stringify({
      token: 'abc123',
      role: 'seller',
    })
  );

  render(
    <MemoryRouter>
      <SellerContainer />
    </MemoryRouter>
  );

  fireEvent.click(
    screen.getByRole('button', { name: 'Start Selling' })
  );

  expect(mockNavigate).toHaveBeenCalledWith(
    '/seller-account/sell-new-product'
  );
});
})