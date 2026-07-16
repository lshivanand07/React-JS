import './Breadcrumbs.css';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter(Boolean);

  const result = pathnames.map(
    (value) => value.charAt(0).toUpperCase() + value.slice(1)
  );

  return (
    <div className="breadcrumbs">
      <Link to="/">Home</Link>
      {result.map((name, index) => {
        const breadcrumbsPath = '/' + result.slice(0, index + 1).join('/');

        const isLastIndex = index === result.length - 1;

        return (
          <span key={breadcrumbsPath}>
            {' > '}
            {isLastIndex ? (
              <span>{name}</span>
            ) : (
              <Link to={breadcrumbsPath}>{name}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
