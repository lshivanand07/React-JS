import { MemoryRouter } from "react-router-dom";
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import { Provider } from 'react-redux';
import AddressContainer from "../src/pages/Addresses/Address";
import { configureStore } from "@reduxjs/toolkit";
import { createUserAddress } from '../src/services/addressApi';
import {vi} from 'vitest'


const addressData = [{
    country: 'india',
    state: 'karnataka',
    city: 'bagalkot',
}]

const createStore = (addressData: any[]) =>
  configureStore({
    reducer: {
      address: () => ({
        addressItem: addressData,
      }),
    },
  });


vi.mock('../src/services/addressApi', () => ({
  createUserAddress: vi.fn(),
  editAddress: vi.fn(),
}));

describe ('Address Page', ()=>{

    test('renders address form', () => {
     const store = createStore(addressData);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <AddressContainer />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText('Manage Addresses')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter Your State')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter your city')).toBeInTheDocument();
});

test('updates input and cancel button', () => {
    const store = createStore(addressData);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <AddressContainer />
      </MemoryRouter>
    </Provider>
  );

  const stateInput = screen.getByPlaceholderText('Enter Your State');
  fireEvent.change(stateInput, {
    target: { value: 'Karnataka' },
  });
  expect(stateInput).toHaveValue('Karnataka');

   const DistrictInput = screen.getByPlaceholderText('Enter Your districts');
  fireEvent.change(DistrictInput, {
    target: { value: 'Bagalkot' },
  });
  expect(DistrictInput).toHaveValue('Bagalkot');

   const CityInput = screen.getByPlaceholderText('Enter your city');
  fireEvent.change(CityInput, {
    target: { value: 'Mudhol' },
  });
  expect(CityInput).toHaveValue('Mudhol');

   const StreetInput = screen.getByPlaceholderText('Enter your Street');
  fireEvent.change(StreetInput, {
    target: { value: '3rd main road' },
  });
  expect(StreetInput).toHaveValue('3rd main road');

  const LandMarkInput = screen.getByPlaceholderText('Enter your Landmark');
  fireEvent.change(LandMarkInput, {
    target: { value: 'Near Hanuman tempel' },
  });
  expect(LandMarkInput).toHaveValue('Near Hanuman tempel');

  const PincodeInput = screen.getByPlaceholderText('Enter your pincode');
  fireEvent.change(PincodeInput, {
    target: { value: '587122' },
  });
  expect(PincodeInput).toHaveValue('587122');

   const homeRadio = screen.getByLabelText('Home');
  fireEvent.click(homeRadio);
  expect(homeRadio).toBeChecked();

   const WorkRadio = screen.getByLabelText('Work');
  fireEvent.click(WorkRadio);
  expect(WorkRadio).toBeChecked();

   fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(stateInput).toHaveValue('');
});

test('creates address successfully', async () => {
  vi.mocked(createUserAddress).mockResolvedValue({
    message: 'Address Created',
  } as any);
const store = createStore(addressData);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <AddressContainer />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(createUserAddress).toHaveBeenCalled();
  });
});
})