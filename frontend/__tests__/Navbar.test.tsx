import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Navbar from '../src/components/Navbar/Navbar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../src/components/Buttons/Button', () => ({
  default: ({ text, onClick }: any) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('renders login and signup buttons when user is not logged in', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('navigates to login page', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Login'));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to signup page', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Sign Up'));

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  test('navigates to cart page', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Cart'));

    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });

  test('search button navigates with search text', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(
      'Search for Products, Brands and More'
    );

    fireEvent.change(input, {
      target: { value: 'Laptop' },
    });

    fireEvent.click(screen.getByText('Search'));

    expect(mockNavigate).toHaveBeenCalledWith('/', {
      state: {
        product_name: 'Laptop',
      },
    });
  });

  test('shows logout button when logged in', () => {
    localStorage.setItem(
      'userToken',
      JSON.stringify({
        token: 'test-token',
      })
    );

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('My Account ▼')).toBeInTheDocument();
  });

  test('logout clears localStorage and redirects to login', () => {
    localStorage.setItem(
      'userToken',
      JSON.stringify({
        token: 'test-token',
      })
    );

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));

    expect(localStorage.getItem('userToken')).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
