import api from './api';

export async function fetchFlipkartRecords() {
  const response = await api.get('/get-flipkart-records');
  return response.data;
}
