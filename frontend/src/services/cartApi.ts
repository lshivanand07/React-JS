import api from './api';

export async function fetchCartDetails() {
  const response = await api.get('/get-user-cart');
  return response.data;
}

interface SelectedItem {
  product_id: number;
  variant_id: number;
  quantity: number;
}

export async function addCartItems(payload: SelectedItem) {
  console.log("f, cart: ",payload)
  const response = await api.post('/post-user-cart', payload);
  return response.data;
}

interface DeleteCartItemByproductID {
  productID: number;
  variantID: number;
}

export async function deleteCartItem(selectedItem: DeleteCartItemByproductID) {
  console.log('payload', selectedItem);

  const response = await api.delete(
    `/delete-cart-product/${selectedItem.productID}/${selectedItem.variantID}`
  );
  return response.data;
}
