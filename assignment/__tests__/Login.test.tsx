import {vi} from 'vitest'
import { MemoryRouter } from 'react-router-dom';
import LoginContainer from '../src/pages/Login/Login';
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import fetchLoginDetails from '../src/services/loginApi';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../src/services/loginApi', () => ({
  default: vi.fn(),
}));

describe('Login page Testing', ()=>{

   test('renders login form', ()=>{
     render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    const Login = screen.getByRole('heading', {name:'Login'})

    expect(Login).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
   })

      test('updates input values', () => {
    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter Email');
    const passwordInput = screen.getByPlaceholderText('Enter Password');

    fireEvent.change(emailInput, {
      target: { value: 'test@gmail.com' },
    });

    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    expect(emailInput).toHaveValue('test@gmail.com');
    expect(passwordInput).toHaveValue('123456');
  });

    test('shows validation when fields are empty', async () => {
    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', {name:'Login'}));

    await waitFor(() => {
      expect(
        screen.getByText('Email fields required')
      ).toBeInTheDocument();

      expect(
        screen.getByText('Password fields required')
      ).toBeInTheDocument();
    });
  });


   test('login success', async () => {
    vi.mocked(fetchLoginDetails).mockResolvedValue({
      token: 'token123',
      user_role: 'customer',
    });

    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'test@gmail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', {name: 'Login'}));

    await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
    })
  });


  test('login success customer', async () => {
    (fetchLoginDetails as jest.Mock).mockResolvedValue({
      token: 'token123',
      user_role: 'customer',
    });

    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'test@gmail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', {name:'Login'}));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    expect(localStorage.getItem('userToken')).toContain('customer');
  });

  test('login success seller', async () => {
    (fetchLoginDetails as jest.Mock).mockResolvedValue({
      token: 'token123',
      user_role: 'seller',
    });

    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'seller@gmail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', {name:'Login'}));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/seller-account');
    });
  });

  test('login success admin', async () => {
    (fetchLoginDetails as jest.Mock).mockResolvedValue({
      token: 'token123',
      user_role: 'admin',
    });

    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), {
      target: { value: 'admin@gmail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', {name:'Login'}));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });
})