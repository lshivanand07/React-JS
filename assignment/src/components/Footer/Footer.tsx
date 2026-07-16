import { Link } from 'react-router-dom';
import './Footer.css';
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer">
          <div className="About">
            <p>ABOUT</p>
            <Link to="/#">Contact Us</Link>
            <Link to="#">Contect Us</Link>
            <Link to="#">About Us</Link>
            <Link to="#">Careers</Link>
            <Link to="#">Flipkart Stories</Link>
            <Link to="#">Press</Link>
            <Link to="Corporate Information"></Link>
          </div>
          <div className="GROUP-COMPANIES">
            <p>GROUP COMPANIES</p>
            <Link to="#">Myntra</Link>
            <Link to="#">cleartrip</Link>
            <Link to="Shopsy"></Link>
          </div>
          <div className="HELP">
            <p>HELP</p>
            <Link to="#">Payments</Link>
            <Link to="#">Shipping</Link>
            <Link to="#">Cancellation</Link>
            <Link to="#">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
