/* eslint-disable @typescript-eslint/no-explicit-any */
import withErrorHandling from '../../hoc/withErrorHandling';
import withLoader from '../../hoc/withLoader';
import logo from '../../assets/logo.png';
import Button from '../../components/Buttons/Button';
import './Admin.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchAllUser, deleteUser } from '../../services/userApi';
import DataTable from 'react-data-table-component';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { fetchProductDetails, deleteProduct } from '../../services/ProductApi';
import { fetchFlipkartRecords } from '../../services/dashboardApi';
import { allOrders, editOrderStatus } from '../../services/ordersApi';

const customStyles = {
  headRow: {
    style: {
      backgroundColor: 'rgb(196, 196, 237)',
      fontWeight: 'bold',
      minHeight: '50px',
    },
  },
};

interface AdminProps {
  adminLogout: () => void;
  filterRecord: (value: string) => void;
  getUsersByRole: (value: string) => void;
  getProducts: () => void;
  getOrders: () => void;
  getDashboardRecord: () => void;
  showDashboard: boolean;
  dashboardRecord: any;
  filterData: any[];
  columns: any[];
  message: string;
  setShowPopup: (value: boolean) => void;
  showPopup: boolean;
}

function AdminPage({
  adminLogout,
  filterRecord,
  getDashboardRecord,
  dashboardRecord,
  showDashboard,
  filterData,
  columns,
  message,
  setShowPopup,
  showPopup,
}: Readonly<AdminProps>) {
  const navigate = useNavigate();

  return (
    <>
      <header>
        <div className="container">
          <div className="admin-navbar">
            <div className="logo">
              <img src={logo} alt="Flipkart logo" />
            </div>
            <Button text="Logout" onClick={adminLogout}></Button>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="admin-pannel">
          <div className="sidebar">
            <div className="buttons-div">
              <button onClick={getDashboardRecord}>Dashboard</button>
            </div>
            <div className="buttons-div">
              <button onClick={() =>  navigate('/admin/users')}>Users</button>
            </div>
            <div className="buttons-div">
              <button onClick={()=> navigate('/admin/products')}>Products</button>
            </div>
            <div className="buttons-div">
              <button onClick={()=> navigate('/admin/orders')}> Orders</button>
            </div>
            <div className="buttons-div">
              <button onClick={() =>  navigate('/admin/customer')}>
                {' '}
                Customers
              </button>
            </div>
            <div className="buttons-div">
              <button onClick={() =>  navigate('/admin/seller')}>Sellers</button>
            </div>
            <div className="buttons-div">
              <button onClick={adminLogout}> Logout</button>
            </div>
          </div>
          <div className="table-container">
            <Breadcrumbs />

            {showDashboard && (
              <>
                <div className="add-product-user-btn">
                  <Button
                    text="Add Product"
                    onClick={() => navigate('/admin/add-product')}
                  ></Button>
                  <Button
                    text="Add User"
                    onClick={() => navigate('/admin/add-user')}
                  ></Button>
                </div>
                <div className="admin-dashboard">
                  <div className="flipkart-record">
                    <h2>Total Revenue</h2>
                    <h3>₹: {dashboardRecord?.totalRevenue}</h3>
                  </div>
                  <div className="flipkart-record">
                    <h2>Total Products</h2>
                    <h3>{dashboardRecord?.totalProducts}</h3>
                  </div>
                  <div className="flipkart-record">
                    <h2>Total Orders</h2>
                    <h3>{dashboardRecord?.totalOrders}</h3>
                  </div>
                  <div className="flipkart-record">
                    <h2>Total Users</h2>
                    <h3>{dashboardRecord?.totalUsers}</h3>
                  </div>
                  <div className="flipkart-record">
                    <h2>Total Customers</h2>
                    <h3>{dashboardRecord?.totalCustomers}</h3>
                  </div>
                  <div className="flipkart-record">
                    <h2>Total Sellers</h2>
                    <h3>{dashboardRecord?.totalSellers}</h3>
                  </div>
                </div>
              </>
            )}

            {!showDashboard && (
              <>
                <div className="filter-table">
                  <input
                    type="text"
                    placeholder="Search here"
                    onChange={(event) => filterRecord(event.target.value)}
                  />
                </div>
                <DataTable
                  className="data-table"
                  columns={columns}
                  data={filterData}
                  customStyles={customStyles}
                  pagination
                  paginationPerPage={5}
                  paginationRowsPerPageOptions={[5, 10, 20, 50]}
                  responsive
                    expandableRows
                 expandableRowsComponent={ExpandedComponent}
                />
              </>
            )}
          </div>

          {showPopup && (
            <div className="model-overlay">
              <div className="modal-container">
                <h4>{message}</h4>
                <Button
                  text="Ok"
                  onClick={() => {
                    setShowPopup(false);
                    globalThis.location.reload();
                  }}
                ></Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const EnhancedAdmin = withLoader(withErrorHandling(AdminPage));

const getUserColumns = (deleteOneUser: (id: number) => void) => [
  { name: 'ID', cell: (row: any) => (
  <>
    {row.User_id}
    {!row.admin_viewed && (
      <span className="new-badge">NEW</span>
    )}
  </>
), sortable: true },
  { name: 'Name', selector: (row: any) => row.user_name?.toLowerCase(), sortable: true,},
  { name: 'Email', selector: (row: any) => row.email, sortable: true },
  { name: 'DOB', selector: (row: any) => row.dob, sortable: true },
  { name: 'Age', selector: (row: any) => row.age, sortable: true },
  { name: 'Phone', selector: (row: any) => row.phone },
  { name: 'Role', selector: (row: any) => row.role },
  {
    name: 'Action',
    cell: (row: any) => (
      <div className="user-action-btn">
        <Button text="Delete" onClick={() => deleteOneUser(row.User_id)} />
      </div>
    ),
  },
];

const getProductColumns = (deleteOneProduct: (id: number) => void) => [
  { name: 'ID', cell: (row: any) => (
  <>
    {row.product_id}
    {!row.admin_viewed && (
      <span className="new-badge">NEW</span>
    )}
  </>
), sortable: true },
  {
    name: 'image',
    cell: (row: any) => (
      <img
        src={row.image_url}
        alt={row.product_name}
        width="50"
        height="50"
      />
    ),
  },
  {
    name: 'Name',
    selector: (row: any) => row.product_name?.toLowerCase(),
    sortable: true,
  },
  {
    name: 'Description',
    selector: (row: any) => row.description,
    width: '200px',
  },
  {
    name: 'Discount %',
    selector: (row: any) =>
      row.discount_percentage ? row.discount_percentage : '0.00',
  },
  { name: 'Stock', selector: (row: any) => row.stock, sortable: true },
  {
    name: 'action',
    cell: (row: any) => (
      <Button
        text="Delete"
        onClick={() => deleteOneProduct(row.product_id)}
      ></Button>
    ),
  },
];

const getOrderColumns = (editUserOrder: (payload: any) => void) => [
  { name: 'ID', cell: (row: any) => (
  <>
    {row.order_id}
    {!row.admin_viewed && (
      <span className="new-badge">NEW</span>
    )}
  </>
), sortable: true },
  {
    name: 'User',
    selector: (row: any) => row.user_name?.toLowerCase(),
    sortable: true,
  },
  {
    name: 'Product',
    selector: (row: any) => row.product_name?.toLowerCase(),
    sortable: true,
  },
  { name: 'quantity', selector: (row: any) => row.quantity, sortable: true },
  {
    name: 'order date',
    selector: (row: any) => row.order_date?.toLowerCase(),
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row: any) => row.order_status?.toLowerCase(),
    sortable: true,
  },
  {
    name: 'total_amount',
    selector: (row: any) => row.total_amount,
    sortable: true,
  },
  {
    name: 'Action',
    cell: (row: any) => (
      <select
        defaultValue=""
        onChange={(e) =>
          editUserOrder({
            user_id: row.user_id,
            order_id: row.order_id,
            order_item: row.order_item_id,
            order_status: e.target.value,
          })
        }
      >
        <option value="" disabled>
          Order Status
        </option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    ),
  },
];

const ExpandedComponent = ({ data }: any) => (
  <div className="expanded-box">
    {Object.entries(data).map(([key, value]) => (
      <div key={key} className="expanded-item">
        <strong>{key.replace(/_/g, " ")}:</strong> {String(value ?? "-")}
      </div>
    ))}
  </div>
);

function AdminContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardRecord, setDashboardRecord] = useState<any>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<any>(null);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('userToken');
    navigate('/login');
  }, [navigate]);

  const filterRecord = useCallback(
    (searchValue: string) => {
      const newRecord = data.filter((record: any) =>
        Object.values(record).some(
          (value) =>
      value !== null &&
      (typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean') &&
            String(value).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setFilterData(newRecord);
    },
    [data]
  );

  const deleteOneUser = useCallback(async (user_id: number) => {
    try {
      setLoading(true);
      const data = await deleteUser(user_id);
      setMessage(data.message);
      setShowPopup(true);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOneProduct = useCallback(async (productID: number) => {
    try {
      setLoading(true);
      const data = await deleteProduct(productID);
      setMessage(data.message);
      setShowPopup(true);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const editUserOrder = useCallback(async (payload: any) => {
    try {
      setLoading(true);
      const data = await editOrderStatus(payload);
      setMessage(data.message);
      setShowPopup(true);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const userColumnsMapped = useMemo(() => getUserColumns(deleteOneUser), [deleteOneUser]);
  const productColumnsMapped = useMemo(() => getProductColumns(deleteOneProduct), [deleteOneProduct]);
  const orderColumnsMapped = useMemo(() => getOrderColumns(editUserOrder), [editUserOrder]);

  const getUsersByRole = useCallback(async (role?: string) => {
    try {
      setLoading(true);
      const users = await fetchAllUser();
      console.log(users)

      if (!role) {
        setData(users[0]);
        setFilterData(users[0]);
        setColumns(userColumnsMapped);
        setShowDashboard(false);
        return;
      }

      const filteredUsers = users[0]?.filter(
        (users: any) => users.role === role
      );
      setData(filteredUsers);
      setFilterData(filteredUsers);
      setColumns(userColumnsMapped);
      setShowDashboard(false);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }, [userColumnsMapped]);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const products = await fetchProductDetails();
      setData(products);
      setFilterData(products);
      setColumns(productColumnsMapped);
      setShowDashboard(false);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }, [productColumnsMapped]);

  const getDashboardRecord = useCallback(async () => {
    try {
      setLoading(true);
      console.log('hi')
      const data = await fetchFlipkartRecords();
      console.log('records',data)
      setDashboardRecord(data);
      setShowDashboard(true);
      navigate('/admin/dashboard');
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const getOrders = useCallback(async () => {
    try {
      setLoading(true);
      const orders = await allOrders();
      console.log("admin",orders)
      setData(orders);
      setFilterData(orders);
      setShowDashboard(false);
      setColumns(orderColumnsMapped);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }, [orderColumnsMapped]);

  console.log("Users component rendered");
  useEffect(() => {
     console.log("Fetching users...");
    if (location.pathname === '/admin/users') {
      getUsersByRole('');
    } else if (location.pathname === '/admin/customer') {
      getUsersByRole('customer');
    } else if (location.pathname === '/admin/seller') {
      getUsersByRole('seller');
    } else if (location.pathname === '/admin/products') {
      getProducts();
    } else if (location.pathname === '/admin/orders') {
      getOrders();
    } else if (
      location.pathname === '/admin/dashboard' ||
      location.pathname === '/admin' ||
      location.pathname === '/Admin'
    ) {
      getDashboardRecord();
    }
  }, [location.pathname, getUsersByRole, getProducts, getOrders, getDashboardRecord]);

  return (
    <EnhancedAdmin
      serverError={serverError}
      loading={loading}
      adminLogout={adminLogout}
      filterRecord={filterRecord}
      getUsersByRole={getUsersByRole}
      getProducts={getProducts}
      getOrders={getOrders}
      getDashboardRecord={getDashboardRecord}
      dashboardRecord={dashboardRecord}
      showDashboard={showDashboard}
      filterData={filterData}
      columns={columns}
      message={message}
      setShowPopup={setShowPopup}
      showPopup={showPopup}
    />
  );
}

export default AdminContainer;