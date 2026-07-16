import { vi, describe, test, expect } from 'vitest';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { editUser } from '../src/services/userApi';
import MyProfileContainer from '../src/pages/Profile/MyProfile';
import { fetchUserById } from '../src/services/userApi';
import { fetchUserAddressById, createUserAddress } from '../src/services/addressApi';
import AddressContainer from '../src/pages/Addresses/Address';

vi.mock('../src/services/userApi', () => ({
  fetchUserById: vi.fn(),
  editUser: vi.fn(),
}));

vi.mock('../src/services/addressApi', () => ({
  fetchUserAddressById: vi.fn(),
  createUserAddress: vi.fn()
}));

vi.mock('../src/components/Breadcrumbs/Breadcrumbs', () => ({
  default: () => <div>Breadcrumbs</div>,
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createStore = (userData: any = {},
  addressData: any[] = []) =>
  configureStore({
    reducer: {
      user: () => ({
        userData,
      }),
      address: () => ({
        addressItem: addressData,
      }),
    },
  });

describe('MyProfileContainer', () => {

  test('renders profile page', async () => {
    const store = createStore({
      User_id: 1,
      user_name: 'Shiva',
      email: 'test@gmail.com',
    });

    vi.mocked(fetchUserById).mockResolvedValue([
      [
        {
          User_id: 1,
          user_name: 'Shiva',
          email: 'test@gmail.com',
        },
      ],
    ] as any);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/profile']}>
          <MyProfileContainer />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(fetchUserById).toHaveBeenCalled();
    });
  });

  test('fetches address data when route is address', async () => {
    const store = createStore();

    vi.mocked(fetchUserAddressById).mockResolvedValue([
      [
        {
          address_id: 1,
          country: 'India',
        },
      ],
    ] as any);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/address']}>
          <MyProfileContainer />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(fetchUserAddressById).toHaveBeenCalledTimes(1);
    });
  });

  test('clicking personal info fetches profile', async () => {
  const store = createStore({
    User_id: 1,
    user_name: 'Shiva',
  });

  vi.mocked(fetchUserById).mockResolvedValue([
    [{ User_id: 1, user_name: 'Shiva' }],
  ] as any);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <MyProfileContainer />
      </MemoryRouter>
    </Provider>
  );

  const personalInfoBtn = await screen.findByText('Personal Info');

  fireEvent.click(personalInfoBtn);

  await waitFor(() => {
    expect(fetchUserById).toHaveBeenCalled();
  });
});

test('clicking addresses fetches addresses', async () => {
  const store = createStore({
    User_id: 1,
    user_name: 'Shiva',
  });

  vi.mocked(fetchUserAddressById).mockResolvedValue([
    [
      {
        address_id: 1,
        country: 'India',
      },
    ],
  ] as any);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <MyProfileContainer />
      </MemoryRouter>
    </Provider>
  );

  const addressBtn = await screen.findByText('Addresses');

  fireEvent.click(addressBtn);

  await waitFor(() => {
    expect(fetchUserAddressById).toHaveBeenCalled();
  });
});

test('clicking Edit shows edit profile form', async () => {
  const store = createStore({
     User_id: 1,
    user_name: 'Shiva',
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/profile']}>
        <MyProfileContainer />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(await screen.findByText('Edit'));

  expect(await screen.findByText('Manage Profile')).toBeInTheDocument();
  expect(screen.getByText('Edit Profile')).toBeInTheDocument();
});

test('updates profile input fields', async () => {
  const store = createStore({
     User_id: 1,
    user_name: 'Shiva',
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/profile']}>
        <MyProfileContainer />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(await screen.findByText('Edit'));

  const nameInput = screen.getByPlaceholderText('Shiva');

  fireEvent.change(nameInput, {
    target: { value: 'Rahul' },
  });

  expect(nameInput).toHaveValue('Rahul');

   const Male = screen.getByLabelText('Male');

fireEvent.click(Male);

expect(Male).toBeChecked();
});

test('saves edited profile', async () => {
  (editUser as any).mockResolvedValue({
    message: 'Profile Updated Successfully',
  });

  const store = createStore({
    User_id: 1,
    user_name: 'Shiva',
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/profile']}>
        <MyProfileContainer />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(await screen.findByText('Edit'));

  const phone = screen.getByPlaceholderText('EX: 918618581627');

  fireEvent.change(phone, {
    target: { value: '9876543210' },
  });

  fireEvent.click(screen.getByText('Save'));

  await waitFor(() => {
    expect(editUser).toHaveBeenCalled();
  });

  expect(await screen.findByText('Profile Updated Successfully')).toBeInTheDocument();
});

test('shows no address found message', async () => {
  const store = createStore({
    User_id: 1,
    user_name: 'Shiva',
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/address']}>
        <MyProfileContainer />
      </MemoryRouter>
    </Provider>
  );

  expect(
    await screen.findByText('No Addresses found in your account!')
  ).toBeInTheDocument();
});


test('clicking ADD ADDRESSES opens address form', async () => {
  const store = createStore({
    User_id: 1,
    user_name:'shivu'
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/address']}>
        <MyProfileContainer />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(await screen.findByText('ADD ADDRESSES'));

  expect(await screen.findByText('Manage Addresses')).toBeInTheDocument();
});

test('renders ADD ADDRESSES button when address exists', async () => {
  const store = createStore(
  {
    User_id: 1,
    user_name: 'Shiva',
  },
  [
    {
      address_id: 1,
      user_address_status: 'Home',
      country: 'India',
      state: 'Karnataka',
      districts: 'Bagalkot',
      city: 'Mudhol',
      street: 'Main Road',
      landmark: 'Bus Stand',
      pincode: '587313',
    },
  ]
);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/address']}>
        <MyProfileContainer />
      </MemoryRouter>
    </Provider>
  );

  expect(await screen.findByText('ADD ADDRESSES')).toBeInTheDocument();
});

test('creates address successfully', async () => {
  (createUserAddress as any).mockResolvedValue({
    message: 'Address created successfully',
  });

  const store = createStore({
    User_id: 1,
    user_name: 'Shiva',
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <AddressContainer />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.change(screen.getByPlaceholderText('Enter Your State'), {
    target: { value: 'Karnataka' },
  });

  fireEvent.change(screen.getByPlaceholderText('Enter Your districts'), {
    target: { value: 'Bagalkot' },
  });

  fireEvent.change(screen.getByPlaceholderText('Enter your city'), {
    target: { value: 'Mudhol' },
  });

  fireEvent.change(screen.getByPlaceholderText('Enter your Street'), {
    target: { value: 'Main Road' },
  });

  fireEvent.change(screen.getByPlaceholderText('Enter your Landmark'), {
    target: { value: 'Bus Stand' },
  });

  fireEvent.change(screen.getByPlaceholderText('Enter your pincode'), {
    target: { value: '587313' },
  });

  fireEvent.click(screen.getByText('Save'));

  await waitFor(() => {
    expect(createUserAddress).toHaveBeenCalled();
  });

  expect(await screen.findByText('Address created successfully')).toBeInTheDocument();
});
  });