/* eslint-disable @typescript-eslint/no-explicit-any */
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchProductDetails } from '../../services/ProductApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import withErrorHandling from '../../hoc/withErrorHandling';
import { useDispatch, useSelector } from 'react-redux';
import { setProduct } from '../../redux/slices/productSlice';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';
import Carousel from '../../components/Carousel/Carousel';

const bannerImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop', // shopping bags
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop', // fashion sale
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop', // electronics
  'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200&h=400&fit=crop', // gadgets
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&h=400&fit=crop',     // shoes/fashion
];

interface HomeProps {
  products: any[];
  navigate: any;
  message: string;
  loading : boolean;
}

function Home({ products, navigate, message, loading }: Readonly<HomeProps>) {
  return (
    <div className="home-page">
      <Navbar />
     <div className="hero-section">
  <div className="orb orb-1"></div>
  <div className="orb orb-2"></div>
  <div className="hero-content">
    <h1>Summer Sale 🔥</h1>
    <p>Up to 70% OFF on Electronics & Fashion</p>
   <Button
  text="Shop Now"
  onClick={() => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  }}
/>
  </div>
</div>
<Carousel images={bannerImages} interval={3000} />
      {loading ?  <Loader /> : 
       <div className="container">
        <div className="products" id='products-section'>
          {Array.isArray(products) &&
            products?.map((product) => (
              <button
                className="product-card"
                key={product.product_id}
                tabIndex={0}
                onClick={() => navigate(`/products/${product.product_id}`)}
              >
                <div className="product_images">
                  <img src={product.image_url} alt="products" />
                </div>
                <h3>{product.product_name}</h3>
                <p className="uppercase">{product.description}</p>
                <p>
                  Discount percentage:{' '}
                  {product.discount_percentage
                    ? product.discount_percentage
                    : 0}
                  %
                </p>
              </button>
            ))}
          {products.length === 0 && message && (
            <div className="product-not-found-div">
              <h3>{message}</h3>
              <Button text="Home Page" onClick={() => navigate('/')}></Button>
            </div>
          )}
        </div>
      </div>
      }
      <MobileMenu />
      <Footer />
    </div>
  );
}

const EnhancedHome = withErrorHandling(Home);

function HomeContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  let productName = location.state?.product_name;
  const [serverError, setServerError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const products = useSelector((state: any) => state.product.productItem);
  console.log(products)

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProductDetails();
      dispatch(setProduct(data));
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const searchProducts = useMemo(() => {
    const productList = Array.isArray(products) ? products : [];

    if (!productName) {
      return productList;
    }

    return productList.filter((product: any) =>
      product.product_name?.toLowerCase().includes(productName.toLowerCase())
    );
  }, [products, productName]);

  const message =
    productName && searchProducts.length === 0 ? 'Product not found' : '';

  return (
    <EnhancedHome
      products={searchProducts}
      serverError={serverError}
      loading={loading}
      navigate={navigate}
      message={message}
    />
  );
}

export default HomeContainer;
