import api from './api';

export async function fetchUserAddressById() {
  const response = await api.get('/get-user-address');
  return response.data;
}

interface Address {
  country: string;
  state: string;
  districts: string;
  city: string;
  street: string;
  landmark: string;
  pincode: string;
  user_address_status: string;
}

export async function createUserAddress(address: Address) {
  const response = await api.post('/post-user-address', address);
  return response.data;
}

export async function editAddress(address: Address, addressStatus: string) {
console.log(addressStatus, address)

  const response = await api.put(
    `/edit-user-address/${addressStatus}`,
    address
  );
  return response.data;
}