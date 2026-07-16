import api from './api';

export async function fetchFlipkartRecords() {
  console.log('hii')
  const response = await api.get('/get-flipkart-records');
  return response.data;
}
