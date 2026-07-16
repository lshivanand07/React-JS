import api from './api';

interface CheckoutData {
  payment_method_name: string;
  address_status: string;
}

export async function checkoutOrder(checkoutData: CheckoutData) {
  const response = await api.post(`/checkout-orderItem`, checkoutData);
  return response.data;
}
