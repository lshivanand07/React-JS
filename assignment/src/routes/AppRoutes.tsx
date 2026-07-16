import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import SignupContainer from '../pages/SignUp/Signup';
import Home from '../pages/Home/Home';
import ProductContainer from '../pages/Product/Product';
import MyProfileContainer from '../pages/Profile/MyProfile';
import Orders from '../pages/Orders/Orders';
import ProtectedRoutes from './ProtectedRoutes';
import CartContainer from '../pages/Cart/Cart';
import AddressContainer from '../pages/Addresses/Address';
import SellerContainer from '../pages/Seller/Seller';
import SellProductContainer from '../pages/SellNewProduct/SellNewProduct';
import AdminContainer from '../pages/Admin/Admin';
import AdminCreateUser from '../pages/AdminAddUser/AdminAddUser';
import PageNotFound from '../pages/PageNotFound/PageNotFound';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupContainer />} />
      <Route path="/profile" element={<MyProfileContainer />} />
      <Route path="/address" element={<MyProfileContainer />} />
      <Route path="/add-user-address" element={<AddressContainer />} />
      <Route path="/seller-account" element={<SellerContainer />} />
      <Route element={<ProtectedRoutes allowedRoles={['customer']} />}>
        <Route path="/products/:id" element={<ProductContainer />} />
        <Route path="/cart" element={<CartContainer />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
      <Route element={<ProtectedRoutes allowedRoles={['seller']} />}>
        <Route
          path="/seller-account/sell-new-product"
          element={<SellProductContainer />}
        />
      </Route>
      <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminContainer />} />
        <Route path="/admin/dashboard" element={<AdminContainer />} />
        <Route path="/admin/users" element={<AdminContainer />} />
        <Route path="/admin/customer" element={<AdminContainer />} />
        <Route path="/admin/seller" element={<AdminContainer />} />
        <Route path="/admin/orders" element={<AdminContainer />} />
        <Route path="/admin/products" element={<AdminContainer />} />
        <Route path="/admin/add-product" element={<SellProductContainer />} />
        <Route path="/admin/add-user" element={<AdminCreateUser />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRoutes;
