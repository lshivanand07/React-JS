import SellProductContainer from "../src/pages/SellNewProduct/SellNewProduct";
import { MemoryRouter } from "react-router-dom";
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import { createProduct } from '../src/services/ProductApi';
import {vi} from 'vitest'

vi.mock('../src/services/ProductApi', () => ({
  createProduct: vi.fn(),
}));


describe('Sell New Product', ()=>{

    test('input testing', ()=>{
         render(
    <MemoryRouter>
      <SellProductContainer />
    </MemoryRouter>
  );

 const ProductInput = screen.getByPlaceholderText('Product Name')
 fireEvent.change(ProductInput , {
    target: {value: 'Laptop'}
 })
  expect(ProductInput).toHaveValue('Laptop')
 
const ImageUrlInput = screen.getByPlaceholderText('Image URL')
 fireEvent.change(ImageUrlInput , {
    target: {value: 'http:/image.url'}
 })
  expect(ImageUrlInput).toHaveValue('http:/image.url')

  const DescriptionInput = screen.getByPlaceholderText('Description')
 fireEvent.change(DescriptionInput , {
    target: {value: 'it is good'}
 })
  expect(DescriptionInput).toHaveValue('it is good')

  const DiscountInput = screen.getByPlaceholderText('Discount %')
 fireEvent.change(DiscountInput , {
    target: {value: 34}
 })
  expect(DiscountInput).toHaveValue(34)

  const StartDateInput = screen.getByLabelText('Start Date')
 fireEvent.change(StartDateInput , {
    target: {value: '2024-04-23'}
 })
  expect(StartDateInput).toHaveValue('2024-04-23')

  const EndDateInput = screen.getByLabelText('End Date')
 fireEvent.change(EndDateInput , {
    target: {value: '2026-06-23'}
 })
  expect(EndDateInput).toHaveValue('2026-06-23')

  const SizeInput = screen.getByLabelText('Size')
 fireEvent.change(SizeInput , {
    target: {value: '64DB'}
 })
  expect(SizeInput).toHaveValue('64DB')

  const ColorInput = screen.getByLabelText('Color')
 fireEvent.change(ColorInput , {
    target: {value: 'Black'}
 })
  expect(ColorInput).toHaveValue('Black')

   const PriceInput = screen.getByLabelText('Price')
 fireEvent.change(PriceInput , {
    target: {value: 999}
 })
  expect(PriceInput).toHaveValue(999)

  const StockInput = screen.getByLabelText('Stock')
 fireEvent.change(StockInput , {
    target: {value: 10}
 })
  expect(StockInput).toHaveValue(10)

    })

    test('adds variant', () => {
  render(
    <MemoryRouter>
      <SellProductContainer />
    </MemoryRouter>
  );

  expect(screen.getByText('varient 1')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Add More Variant'));

  expect(screen.getByText('varient 2')).toBeInTheDocument();
});

test('opens create product popup', () => {
  render(
    <MemoryRouter>
      <SellProductContainer />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', {name:'Create Product'}));
  expect(
    screen.getByText('are you sure you want to add New Product')
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', {name:'Cancel'}));
  expect(
    screen.getByText('Sell New Product')
  ).toBeInTheDocument();
});


test('creates product successfully', async () => {
  vi.mocked(createProduct).mockResolvedValue({
    message: 'Product Created Successfully',
  } as any);

  render(
    <MemoryRouter>
      <SellProductContainer />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText('Create Product'));

  fireEvent.click(screen.getAllByText('Ok')[0]);

  await waitFor(() => {
    expect(createProduct).toHaveBeenCalled();
  });

  expect(
    screen.getByText('Product Created Successfully')
  ).toBeInTheDocument();
});

})