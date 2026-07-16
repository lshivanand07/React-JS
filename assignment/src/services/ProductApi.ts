/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';

export async function fetchProductDetails() {
  console.log('hi')
  const response = await api.get(`/get-all-products`);
  console.log('p',response.data)
  return response.data;
}

export async function fetchProductById(productId: number) {
  const response = await api.get(`/get-one-products/${productId}`);
  return response.data;
}

export async function createProduct(productData: any) {
  const response = await api.post('/post-product-info', productData);
  return response.data;
}

export async function deleteProduct(productID: number) {
  console.log('productID ', productID);
  const response = await api.delete(`/delete-product/${productID}`);
  return response.data;
}
