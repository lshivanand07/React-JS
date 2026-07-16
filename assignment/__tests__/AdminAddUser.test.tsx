import { MemoryRouter } from "react-router-dom";
import AdminCreateUser from "../src/pages/AdminAddUser/AdminAddUser";
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import validateSignup from "../src/components/validations/validations";
import { CreateUser } from "../src/services/userApi";
import {vi} from 'vitest'

vi.mock('../src/components/validations/validations', () => ({
  default: vi.fn(),
}));

vi.mock('../src/services/userApi', () => ({
  CreateUser: vi.fn(),
}));

describe('Admin Add User Page', ()=>{

    test('renders create user form and upadate input', () => {
  render(
    <MemoryRouter>
      <AdminCreateUser />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('heading', { name: 'Add User' })
  ).toBeInTheDocument();

  const nameInput = screen.getByPlaceholderText('Enter name');
  fireEvent.change(nameInput, {
    target: { value: 'Shivanand' },
  });
  expect(nameInput).toHaveValue('Shivanand');

  const emailInput = screen.getByPlaceholderText('Enter email');
  fireEvent.change(emailInput, {
    target: { value: 'shivanand@gmail.com' },
  });
  expect(emailInput).toHaveValue('shivanand@gmail.com');

  const PhoneInput = screen.getByLabelText('Phone');
  fireEvent.change(PhoneInput, {
    target: { value: '8618581627' },
  });
  expect(PhoneInput).toHaveValue('8618581627');

  const DobInput = screen.getByLabelText('DOB');
  fireEvent.change(DobInput, {
    target: { value: '2026-11-10' },
  });
  expect(DobInput).toHaveValue('2026-11-10');

  const GenderRadio = screen.getByLabelText('Male');
  fireEvent.click(GenderRadio);
  expect(GenderRadio).toBeChecked();

  const UserRoleRadio = screen.getByLabelText('Customer');
  fireEvent.click(UserRoleRadio);
  expect(UserRoleRadio).toBeChecked();

  const PasswordInput = screen.getByLabelText('Password');
  fireEvent.change(PasswordInput, {
    target: { value: 'Shivu@1234' },
  });
  expect(PasswordInput).toHaveValue('Shivu@1234');

  const AgeInput = screen.getByLabelText('Age');
  fireEvent.change(AgeInput, {
    target: { value: 23 },
  });
  expect(AgeInput).toHaveValue(23);
});


test('shows validation errors', async () => {
  vi.mocked(validateSignup).mockReturnValue({
    user_name: 'Name required',
    email: 'Email required',
  });

  render(
    <MemoryRouter>
      <AdminCreateUser />
    </MemoryRouter>
  );

  fireEvent.click(
    screen.getByRole('button', { name: 'Create User' })
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

test('creates user successfully', async () => {
  vi.mocked(validateSignup).mockReturnValue({});

  vi.mocked(CreateUser).mockResolvedValue({
    message: 'User Created Successfully',
  } as any);

  render(
    <MemoryRouter>
      <AdminCreateUser />
    </MemoryRouter>
  );
  fireEvent.change(screen.getByPlaceholderText('Enter name'), {
    target: { value: 'Shivanand' },
  });

  fireEvent.change(screen.getByPlaceholderText('Enter email'), {
    target: { value: 'test@gmail.com' },
  });

  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'Shivu@1234' },
  });

  fireEvent.click(
    screen.getByRole('button', { name: 'Create User' })
  );

  await waitFor(() => {
    expect(CreateUser).toHaveBeenCalledTimes(1);
  });

  expect(
    await screen.findByText('User Created Successfully')
  ).toBeInTheDocument();
});

test('shows server error message when API fails', async () => {
  vi.mocked(validateSignup).mockReturnValue({});

  vi.mocked(CreateUser).mockRejectedValue({
    response: {
      data: {
        message: 'Email already exists',
      },
    },
  });

  render(
    <MemoryRouter>
      <AdminCreateUser />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Enter name'), {
    target: { value: 'Shivanand' },
  });

  fireEvent.change(screen.getByPlaceholderText('Enter email'), {
    target: { value: 'test@gmail.com' },
  });

  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'Shivu@1234' },
  });

  fireEvent.click(
    screen.getByRole('button', { name: 'Create User' })
  );

  await waitFor(() => {
    expect(CreateUser).toHaveBeenCalled();
  });

  expect(
    await screen.findByText('Email already exists')
  ).toBeInTheDocument();
});

})