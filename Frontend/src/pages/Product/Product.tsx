/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import './product.css';
import { useState, useEffect, useCallback } from 'react';
import { fetchProductById } from '../../services/ProductApi';
import Button from '../../components/Buttons/Button';
import { addCartItems } from '../../services/cartApi';
import withErrorHandling from '../../hoc/withErrorHandling';
import withLoader from '../../hoc/withLoader';

import { useDispatch, useSelector } from 'react-redux';
import { setProduct } from '../../redux/slices/productSlice';
import Navbar from '../../components/Navbar/Navbar';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Footer from '../../components/Footer/Footer';

interface ProductDetails {
  productItems: any;
  message: string;
  stockForm: boolean;
  setStockForm: (value: boolean) => void;
  setStock: (value: number) => void;
  handleAddCart: (product_id: number, variant_id: number) => void;
  showPopup: boolean;
  PopupModel: () => void;
}

function OneProductDetails({
  productItems,
  message,
  stockForm,
  setStockForm,
  setStock,
  handleAddCart,
  showPopup,
  PopupModel,
}: Readonly<ProductDetails>) {
  const item = productItems;

  const [selectedVariantItem, setSelectedVariantItem] = useState({
    color: '',
    size: '',
  });

  const filteredColor =
    productItems?.variants?.filter(
      (color: any) => color.color === selectedVariantItem.color
    ) || [];

  const filteredSize =
    filteredColor?.filter(
      (size: any) => size.size === selectedVariantItem.size
    ) || [];

  console.log(filteredSize);

  return (
    <>
      <Navbar />
      <div className="container">
        <Breadcrumbs />
        <h1 className="product-heading">Product Details</h1>

        <div className="product-veriants">
          <div className="product_img">
            {''}
            <img src={item?.image} alt="product" />{' '}
          </div>

          <div>
            <h3>{item?.product_name}</h3>
            <p>{item?.description}</p>
            <div className="variants">
              <select
                value={selectedVariantItem.color}
                onChange={(event) =>
                  setSelectedVariantItem({
                    color: event.target.value,
                    size: '',
                  })
                }
              >
                <option value="" disabled>
                  -- Color --
                </option>
                {productItems?.variants?.map((item: any) => (
                  <option key={item?.product_id}>{item.color}</option>
                ))}
              </select>

              <select
                value={selectedVariantItem.size}
                onChange={(event) =>
                  setSelectedVariantItem({
                    ...selectedVariantItem,
                    size: event.target.value,
                  })
                }
              >
                <option value="" disabled>
                  -- Size --
                </option>
                {filteredColor?.map((item: any) => (
                  <option key={item?.product_id}>{item.size}</option>
                ))}
              </select>

              {filteredSize.length > 0 && (
                <div>
                  <p>Price: ₹{filteredSize[0].price}</p>
                  <p>Stock: {filteredSize[0].stock}</p>
                </div>
              )}
            </div>
          </div>

          <Button
            text="Add to cart"
            onClick={() => setStockForm(true)}
          ></Button>

          {stockForm && (
            <div className="overlay">
              <div className="add-items-in-cart-form">
                <form>
                  <label htmlFor="stock">Stock</label>

                  <input
                    id="stock"
                    type="number"
                    min={1}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />

                  <div className="confirm-Cancel-btn">
                    <Button
                      text="confirm"
                      onClick={() =>
                        handleAddCart(
                          filteredSize[0].product_id,
                          filteredSize[0].variant_id
                        )
                      }
                    />
                    <Button text="cancel" onClick={() => setStockForm(false)} />
                  </div>
                  <p className="error">{message}</p>
                </form>
              </div>
            </div>
          )}

          {showPopup && (
            <div className="model-overlay">
              <div className="modal-container">
                <h4>{message}</h4>
                <Button text="Ok" onClick={PopupModel}></Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

const EnhancedProducts = withLoader(withErrorHandling(OneProductDetails));

const ProductContainer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);
  console.log('productId ', productId);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<Error | null>(null);
  const [message, setMessage] = useState('');
  const [stock, setStock] = useState<number>();
  const [stockForm, setStockForm] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const dispatch = useDispatch();
  const productItems = useSelector((state: any) => state.product.productItem);

  console.log(productItems);

  const productData = async () => {
    try {
      setLoading(true);
      const data = await fetchProductById(productId);
      console.log('Single ', data);
      dispatch(setProduct(data));
    } catch (error) {
      setServerError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    productData();
  }, []);

  const handleAddCart = async (product_id: number, variant_id: number) => {
    try {
      if (!stock || stock < 1) {
        setMessage('Please enter valid stock');
        return;
      }

      setLoading(true);
      setMessage('');

      const payload = {
        product_id: product_id,
        variant_id: variant_id,
        quantity: stock,
      };
      console.log('payload', payload);
      const data = await addCartItems(payload);
      setMessage(data.message);
      setShowPopup(true);
      setStockForm(false);
    } catch (error) {
      setServerError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const PopupModel = useCallback(() => {
    setShowPopup(false);
    navigate('/cart');
  }, [navigate]);

  return (
    <EnhancedProducts
      loading={loading}
      serverError={serverError}
      message={message}
      productItems={productItems}
      stockForm={stockForm}
      setStockForm={setStockForm}
      setStock={setStock}
      handleAddCart={handleAddCart}
      showPopup={showPopup}
      PopupModel={PopupModel}
    />
  );
};

export default ProductContainer;
