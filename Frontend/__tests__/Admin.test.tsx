import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AdminContainer from '../src/pages/Admin/Admin';

import {
  fetchAllUser,
  deleteUser,
} from '../src/services/userApi';

vi.mock('../src/services/userApi', () => ({
  fetchAllUser: vi.fn(),
  deleteUser: vi.fn()
}));

import {
  fetchProductDetails,
  deleteProduct,
} from '../src/services/ProductApi';

vi.mock('../src/services/ProductApi', () => ({
  fetchProductDetails: vi.fn(),
  deleteProduct: vi.fn()
}));

import {
  fetchFlipkartRecords
} from '../src/services/dashboardApi';

vi.mock('../src/services/dashboardApi', () => ({
  fetchFlipkartRecords: vi.fn(),
}));

import {
  allOrders,
  editOrderStatus,
} from '../src/services/ordersApi';

vi.mock('../src/services/ordersApi', () => ({
  allOrders: vi.fn(),
  editOrderStatus: vi.fn()
}));

vi.mock('react-data-table-component', () => ({
  default: ({ data }: any) => (
    <div data-testid="datatable">
      {data?.map((item: any) => (
        <div key={item.id}>{JSON.stringify(item)}</div>
      ))}
    </div>
  ),
}));

describe ('Admin Page', ()=>{

     test('renders dashboard data', async () => {
    vi.mocked(fetchFlipkartRecords).mockResolvedValue({
      totalRevenue: 1000,
      totalProducts: 10,
      totalOrders: 5,
      totalUsers: 4,
      totalCustomers: 3,
      totalSellers: 1,
    });

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AdminContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/1000/i)).toBeInTheDocument();
    });
  });

   test('loads users when Users button clicked', async () => {
    vi.mocked(fetchAllUser).mockResolvedValue([
      [
        {
          User_id: 1,
          user_name: 'Shiva',
          email: 'test@gmail.com',
          role: 'customer',
        },
      ],
    ]);

    render(
      <MemoryRouter>
        <AdminContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Users'));

    await waitFor(() => {
      expect(fetchAllUser).toHaveBeenCalled();
    });
  });

  vi.mock('react-data-table-component', () => ({
  default: ({ columns, data }: any) => (
    <div>
      {data?.map((row: any, rowIndex: number) => (
        <div key={rowIndex}>
          {columns?.map((column: any, columnIndex: number) => (
            <div key={columnIndex}>
              {column.cell
                ? column.cell(row)
                : column.selector
                  ? String(column.selector(row))
                  : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}));

   test('updates order status', async () => {

    vi.mocked(allOrders).mockResolvedValue([
      {
        order_id: 1,
        user_id: 10,
        order_item_id: 5,
        user_name: 'Shiva',
        product_name: 'Phone',
        order_status: 'pending',
      },
    ]);

    vi.mocked(editOrderStatus).mockResolvedValue({
      message: 'Updated',
    });

    render(
      <MemoryRouter>
        <AdminContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Orders'));

    await waitFor(() => {
      expect(allOrders).toHaveBeenCalled();
    });

    const select = await screen.findByRole('combobox');

    fireEvent.change(select, {
      target: {
        value: 'confirmed',
      },
    });

    await waitFor(() => {
      expect(editOrderStatus).toHaveBeenCalled();
    });
  });

   test('calls delete user api', async () => {

    vi.mock('../../components/Buttons/Button', () => ({
  default: ({ text, onClick }: any) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

    vi.mocked(fetchAllUser).mockResolvedValue([
      [
        {
          User_id: 1,
          user_name: 'Shiva',
          email: 'test@gmail.com',
          role: 'customer',
        },
      ],
    ]);

    vi.mocked(deleteUser).mockResolvedValue({
      message: 'User Deleted',
    });

    render(
      <MemoryRouter>
        <AdminContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Users'));

    const deleteBtn = await screen.findByText('Delete');

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(1);
    });
  });

   test('loads orders', async () => {
    vi.mocked(allOrders).mockResolvedValue([
      {
        order_id: 1,
        user_name: 'Shiva',
        product_name: 'Phone',
      },
    ]);

    render(
      <MemoryRouter>
        <AdminContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Orders'));

    await waitFor(() => {
      expect(allOrders).toHaveBeenCalled();
    });
  });


  test('logout navigates user', () => {
    const removeSpy = vi.spyOn(Storage.prototype, 'removeItem');

    render(
      <MemoryRouter>
        <AdminContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByText('Logout')[0]);

    expect(removeSpy).toHaveBeenCalledWith('userToken');
  });

   test('loads product', async () => {
    vi.mocked(fetchProductDetails).mockResolvedValue([
      {
        product_name: 'Phone',
      },
    ]);

    render(
      <MemoryRouter>
        <AdminContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Products'));

    await waitFor(() => {
      expect(fetchProductDetails).toHaveBeenCalled();
    });
  });

  test('calls delete product api', async () => {
  vi.mocked(fetchProductDetails).mockResolvedValue([
    {
      product_id: 1,
      product_name: 'Laptop',
      stock: 10,
    },
  ]);

  vi.mocked(deleteProduct).mockResolvedValue({
    message: 'Product Deleted',
  });

  render(
    <MemoryRouter>
      <AdminContainer />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText('Products'));

  const deleteBtn = await screen.findByRole('button', {
    name: /delete/i,
  });

  fireEvent.click(deleteBtn);

  await waitFor(() => {
    expect(deleteProduct).toHaveBeenCalledWith(1);
  });
});
})