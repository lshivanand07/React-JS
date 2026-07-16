import './Seller.css';
import sellerHub from '../../assets/sellerHub.png';
import Button from '../../components/Buttons/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import withErrorHandling from '../../hoc/withErrorHandling';
import withLoader from '../../hoc/withLoader';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

interface SellerProps {
  athenticate: boolean;
  SellerLogin: () => void;
  SellerSignUp: () => void;
  sellerLogout: () => void;
}

function Seller({
  athenticate,
  SellerLogin,
  SellerSignUp,
  sellerLogout,
}: Readonly<SellerProps>) {
  return (
    <div className="container">
      <p>
        Existing Seller? Explore our product recommendations with Dhamaka
        Selection
      </p>
      <hr />
      <div className="sellar-navbar">
        <img src={sellerHub} alt="seller hub" />
        <Link to="#">Sell Online</Link>
        <Link to="#">Fees and Commission</Link>
        <Link to="#">Grow</Link>
        <Link to="#">Learn</Link>
        <Link to="#">Shopsy</Link>
        {athenticate ? (
          <Button text="Logout" onClick={sellerLogout}></Button>
        ) : (
          <Button text="Login" onClick={SellerLogin}></Button>
        )}
        <Button text="Start Selling" onClick={SellerSignUp}></Button>
      </div>
      <Breadcrumbs />
      <div className="hero-sction">
        <h1>Sell Online with Flipkart</h1>
      </div>
    </div>
  );
}

const EnhancedSeller = withLoader(withErrorHandling(Seller));

function SellerContainer() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() =>
    JSON.parse(localStorage.getItem('userToken') || '{}')
  );
  const [athenticate, setAthenticate] = useState(() => {
    const storedToken = JSON.parse(localStorage.getItem('userToken') || '{}');
    return storedToken.token && storedToken.role === 'seller';
  });

  const SellerLogin = useCallback(() => {
    console.log('Logintoken', token);
    if (!token?.token || token?.role !== 'seller') {
      return navigate('/login');
    }
    setAthenticate(true);
  }, [navigate, navigate]);

  const SellerSignUp = useCallback(() => {
    if (!token?.token || token?.role !== 'seller') {
      return navigate('/signup');
    } else {
      return navigate('/seller-account/sell-new-product');
    }
  }, [navigate, token]);

  const sellerLogout = useCallback(() => {
    localStorage.removeItem('userToken');
    setAthenticate(false);
    setToken(null);
  }, []);

  return (
    <EnhancedSeller
      athenticate={athenticate}
      SellerLogin={SellerLogin}
      SellerSignUp={SellerSignUp}
      sellerLogout={sellerLogout}
    />
  );
}

export default SellerContainer;
