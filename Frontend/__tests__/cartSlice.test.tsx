import cartReducer, { setCart } from '../src/redux/slices/cartSlice';

describe('cartSlice', () => {
  test('set cart items', () => {
    const initialState = {
      cartItem: [],
    };

    const newState = cartReducer(
      initialState,
      setCart([{ id: 1, name: 'Mobile' }])
    );

    expect(newState.cartItem).toEqual([{ id: 1, name: 'Mobile' }]);
  });
});
