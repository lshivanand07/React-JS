import { MemoryRouter } from "react-router-dom";
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import SignupContainer from "../src/pages/SignUp/Signup";
import validateSignup from '../src/components/validations/validations';
import CreateUser from '../src/services/signUpApi';
import {vi} from 'vitest'

vi.mock('../src/components/validations/validations', () => ({
  default: vi.fn(),
}));

vi.mock('../src/services/signUpApi', () => ({
  default: vi.fn(),
}));

describe('SignUp page', ()=>{
    test('renders signup form and input', () => {
  render(
    <MemoryRouter>
      <SignupContainer />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('heading', { name: 'Sign Up' })
  ).toBeInTheDocument();

  const NameInput = screen.getByPlaceholderText('Enter your name')
  fireEvent.click(NameInput, {
    target: {value:'Shivu'},
  })
  expect(NameInput).toHaveValue('Shivu')

  const EmailInput = screen.getByPlaceholderText('Ex: shivu@gmail.com')
  fireEvent.click(EmailInput, {
    target: {value:'Shivu@gmail.com'},
  })
  expect(EmailInput).toHaveValue('Shivu@gmail.com')

  const CustomerRadio = screen.getByLabelText('Customer')
  fireEvent.click(CustomerRadio)
  expect(CustomerRadio).toBeChecked()

   const PasswordInput = screen.getByPlaceholderText('Enter your password')
  fireEvent.click(PasswordInput, {
    target: {value:'Shivu@123'},
  })
  expect(PasswordInput).toHaveValue('Shivu@123')

});

test('shows validation errors', async () => {
  vi.mocked(validateSignup).mockReturnValue({
    user_name: 'Name required',
    email: 'Email required',
  });

  render(
    <MemoryRouter>
      <SignupContainer />
    </MemoryRouter>
  );

  fireEvent.click(
    screen.getByRole('button', { name: 'Sign Up' })
  );

  await waitFor(() => {
    expect(
      screen.getByText('Name required')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Email required')
    ).toBeInTheDocument();
  });
});

test('signup success', async () => {
  vi.mocked(validateSignup).mockReturnValue({});

  vi.mocked(CreateUser).mockResolvedValue({
    message: 'User Registered Successfully',
  } as any);

  render(
    <MemoryRouter>
      <SignupContainer />
    </MemoryRouter>
  );

  fireEvent.change(
    screen.getByPlaceholderText('Enter your name'),
    {
      target: { value: 'Shivu' },
    }
  );

  fireEvent.change(
    screen.getByPlaceholderText('Ex: shivu@gmail.com'),
    {
      target: { value: 'shivu@gmail.com' },
    }
  );

  fireEvent.change(
    screen.getByPlaceholderText('Enter your password'),
    {
      target: { value: 'password123' },
    }
  );

  fireEvent.click(screen.getByLabelText('Customer'));

  fireEvent.click(
    screen.getByRole('button', { name: 'Sign Up' })
  );

  await waitFor(() => {
    expect(CreateUser).toHaveBeenCalled();
  });

  expect(
    screen.getByText('User Registered Successfully')
  ).toBeInTheDocument();
});
})