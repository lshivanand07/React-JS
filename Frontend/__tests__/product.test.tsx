import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, } from "react-router-dom";
import { vi } from "vitest";
import ProductContainer from "../src/pages/Product/Product";
import {fetchProductById} from '../src/services/ProductApi'
import {addCartItems} from '../src/services/cartApi'

vi.mock("../src/components/Navbar/Navbar", () => ({
    default: () => <div>Navbar</div>,
}));

vi.mock("../src/components/Footer/Footer", () => ({
    default: () => <div>Footer</div>,
}));

vi.mock("../src/components/Breadcrumbs/Breadcrumbs", () => ({
    default: () => <div>Breadcrumbs</div>,
}));

vi.mock("../src/components/Buttons/Button", () => ({
    default: ({ text, onClick }: any) => (
        <button onClick={onClick}>{text}</button>
    ),
}));

vi.mock("../src/services/ProductApi", () => ({
    fetchProductById: vi.fn(),
}));

vi.mock("../src/services/cartApi", () => ({
    addCartItems: vi.fn(),
}));

const product = {
    product_name: "Shirt",
    description: "Nice Shirt",
    image: "shirt.jpg",
    variants: [
        {
            product_id: 1,
            variant_id: 10,
            color: "Black",
            size: "M",
            stock: 15,
            price: 999,
        },
        {
            product_id: 1,
            variant_id: 11,
            color: "Black",
            size: "L",
            stock: 8,
            price: 1099,
        },
    ],
};

const createStore = (productData: any) =>
  configureStore({
    reducer: {
      product: () => ({
        productItem: productData,
      }),
    },
  });
  

describe("ProductContainer page", () => {
    
    test('renders product details', async () => {
 (fetchProductById as any).mockResolvedValue(product);

    const store = createStore(product);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/product/1']}>
        <ProductContainer />
      </MemoryRouter>
    </Provider>
  );

 await waitFor(() => {
  expect(fetchProductById).toHaveBeenCalled();
});

expect(await screen.findByText("Shirt")).toBeInTheDocument();
    expect(screen.getByText("Nice Shirt")).toBeInTheDocument();
    expect(screen.getByText("Product Details")).toBeInTheDocument();
});

    test('updates color and size', async () => {
  const store = createStore(product);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/product/1']}>
        <ProductContainer/>
      </MemoryRouter>
    </Provider>
  );

  await screen.findByText('Shirt');

  const selects = screen.getAllByRole('combobox');

  fireEvent.change(selects[0], {
    target: { value: 'Black' },
  });

  fireEvent.change(selects[1], {
    target: { value: 'M' },
  });

  expect(screen.getByText('Price: ₹999')).toBeInTheDocument();
  expect(screen.getByText('Stock: 15')).toBeInTheDocument();
});


test('opens add to cart form', async () => {
  const store = createStore(product);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/product/1']}>
        <ProductContainer />
      </MemoryRouter>
    </Provider>
  );

  await screen.findByText('Shirt');

  fireEvent.click(screen.getByText('Add to cart'));

  expect(screen.getByLabelText('Stock')).toBeInTheDocument();
  expect(screen.getByText('confirm')).toBeInTheDocument();
  expect(screen.getByText('cancel')).toBeInTheDocument();
});

test('adds product to cart successfully', async () => {
  (fetchProductById as any).mockResolvedValue(product);

  (addCartItems as any).mockResolvedValue({
    message: 'Product added successfully',
  });

  const store = createStore(product);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/product/1']}>
        <ProductContainer />
      </MemoryRouter>
    </Provider>
  );

  const selects = await screen.findAllByRole('combobox');

  fireEvent.change(selects[0], {
    target: { value: 'Black' },
  });

  fireEvent.change(selects[1], {
    target: { value: 'M' },
  });

  fireEvent.click(screen.getByText('Add to cart'));

  fireEvent.change(screen.getByLabelText('Stock'), {
    target: { value: '2' },
  });

  fireEvent.click(screen.getByText('confirm'));

  await waitFor(() => {
    expect(addCartItems).toHaveBeenCalledWith({
      product_id: 1,
      variant_id: 10,
      quantity: 2,
    });
  });

  expect(
    await screen.findByText('Product added successfully')
  ).toBeInTheDocument();
});
});