import './MobileMenu.css';
import homeImage from '../../assets/home.png';
import profile from '../../assets/person.png';
import { Link } from 'react-router-dom';
import cartImage from '../../assets/cart.png';
import ordersImage from '../../assets/orders.png';

function MobileMenu() {
  return (
    <div className="mobile-menu">
      <div className="home">
        <Link to="/">
          <img src={homeImage} alt="home" />
        </Link>
        <p>Home</p>
      </div>
      <div className="profile">
        <Link to="/profile">
          <img src={profile} alt="profile" />
        </Link>
        <p>Profile</p>
      </div>
      <div className="mobile-cart">
        <Link to="/cart">
          <img src={cartImage} alt="cart" />
        </Link>
        <p>Cart</p>
      </div>
      <div className="mobile-order">
        <Link to="/orders">
          <img src={ordersImage} alt="orders" />
        </Link>
        <p>Orders</p>
      </div>
    </div>
  );
}

export default MobileMenu;
