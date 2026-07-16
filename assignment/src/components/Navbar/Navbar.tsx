import './Navbar.css';
import Button from '../Buttons/Button';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useState, useEffect } from 'react';

function Navbar() {
  const [searchMessage, setSearchMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userToken') || '{}');
    setIsLoggedIn(!!token.token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  function searchProduct(product_name: string) {
    navigate('/', {
      state: {
        product_name: product_name,
      },
    });
  }

  return (
    <header>
      <div className="container">
        <div className="navbar">
          <div className="logo">
            <img src={logo} alt="Flipkart logo" />
          </div>
          <div className="nav-search-bar">
            <input
              className="search-bar"
              type="text"
              value={searchMessage}
              onChange={(event) => {
                setSearchMessage(event.target.value);
                searchProduct(searchMessage);
              }}
              placeholder="Search for Products, Brands and More"
            />
            <button
              className="search-btn"
              onClick={() => searchProduct(searchMessage)}
            >
              Search
            </button>
          </div>
          <button className="cart-button" onClick={() => navigate('/cart')}>
            Cart
          </button>
          {isLoggedIn ? (
            <>
              <div className="account-menu">
                <button className="account-btn">My Account ▼ </button>
                <div className="dropdown">
                  <Link to="/orders">Orders</Link>
                  <Link to="/profile">Profile</Link>
                </div>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Button text="Login" onClick={() => navigate('/login')}></Button>
              <Button text="Sign Up" onClick={() => navigate('/signup')} />
            </>
          )}

          <div className="account-menu">
            <Button text="More ▼"></Button>
            <div className="dropdown">
              <Link to="/seller-account">Become a Seller</Link>
              <Link to="">Notification Settings</Link>
              <Link to="">24*7 Customer Care</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
