import api from './api';

export async function allOrders() {
  const response = await api.get('/get-all-orders');
  return response.data;
}

export async function userOrders() {
  const response = await api.get('/get-user-orders');
  return response.data;
}

interface Payload {
  user_id: number;
  order_id: number;
  order_item: number;
  order_status: string;
}

export async function editOrderStatus(payload: Payload) {
  console.log(
    payload.user_id,
    payload.order_id,
    payload.order_status,
    payload.order_item
  );
  console.log(payload);
  const response = await api.put(
    `/edit-user/${payload.user_id}/order/${payload.order_id}/${payload.order_item}`,
    {
      order_status: payload.order_status,
    }
  );
  return response.data;
}
