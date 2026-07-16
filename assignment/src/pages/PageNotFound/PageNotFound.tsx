import './PageNotFound.css';
import Button from '../../components/Buttons/Button';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="page-not-found">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Button text="GO TO HOMEPAGE" onClick={() => navigate('/')}></Button>
      </div>
    </div>
  );
}

export default PageNotFound;
