/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCartDetails, deleteCartItem } from '../../services/cartApi';
import './Cart.css';
import Button from '../../components/Buttons/Button';
import withErrorHandling from '../../hoc/withErrorHandling';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../redux/slices/cartSlice';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

interface CartListProps {
  cartItems: any[];
  message: string;
  deleteCartItems: ({ productID, veriantID }: any) => void;
  placeOrders: (value: number) => void;
  PopupModel: () => void;
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
  setSelectedItem: ({ productId, variantId }: any) => void;
  loading: boolean;
}

const CartDataList = ({
  cartItems,
  message,
  deleteCartItems,
  placeOrders,
  PopupModel,
  showPopup,
  setShowPopup,
  setSelectedItem,
  loading,
}: CartListProps) => {
  const totalPrice = useMemo(() => {
    return (
      cartItems?.[0]?.reduce((total: number, item: any) => {
        const discountedPrice =
          Number(item.price) * (1 - Number(item.discount_percentage) / 100);
        return (
          total + Number((discountedPrice * Number(item.quantity)).toFixed(2))
        );
      }, 0) || 0
    );
  }, [cartItems]);

  return (
    <>
      <Navbar />
      <div className="container">
        <Breadcrumbs />

        {loading ? (
          <div className="carts-loading">
            <div className="dual-ring"></div>
          </div>
        ) : (
          <>
            {!message && (
              <>
                <h1 className="cart-heading">My Cart</h1>
                <div className="carts">
                  {cartItems[0]?.map((item: any) => (
                    <div
                      className="cart"
                      key={`${item.product_id}-${item.variant_id}`}
                    >
                      <div className="product_img">
                        <img src={item.image_url} alt="product" />
                      </div>
                      <h2>{item.product_name}</h2>
                      <p>Price: ₹{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                      <p className="uppercase">
                        description: {item.description}
                      </p>
                      <p>
                        Discount percentage:{' '}
                        {item.discount_percentage ? item.discount_percentage : 0}
                        %
                      </p>
                      <div className="Edit-Delete-btn">
                        <Button
                          text="Delete"
                          onClick={() => {
                            setShowPopup(true);
                            setSelectedItem({
                              productID: item.product_id,
                              variantID: item.variant_id,
                            });
                          }}
                        ></Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="palce-order-btn">
                  <h2 className="cart-totalPrice">₹ {totalPrice}</h2>
                  <Button
                    text="PLACE ORDER"
                    onClick={() => placeOrders(totalPrice)}
                  ></Button>
                </div>
              </>
            )}

            {message && (
              <div className="empty-cart-div">
                <h3>{message}</h3>
              </div>
            )}
          </>
        )}

        {showPopup && (
          <div className="model-overlay">
            <div className="modal-container">
              {!message && (
                <>
                  <h4>Are you sure you want to delete this item?</h4>
                  <div className="userConformationBtn">
                    <Button text="Ok" onClick={deleteCartItems}></Button>
                    <Button text="cancel" onClick={PopupModel}></Button>
                  </div>
                </>
              )}

              {message && (
                <>
                  <h4>{message}</h4>
                  <Button text="Ok" onClick={PopupModel}></Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const EnhancedCartList = withErrorHandling(CartDataList);

const CartDataContainer = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  interface SelectedItem {
    productID: number;
    variantID: number;
  }

  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.cartItem);
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const data = await fetchCartDetails();
      dispatch(setCart(data));
      setMessage(data.message);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const deleteCartItems = useCallback(async () => {
    try {
      setLoading(true);
      if (!selectedItem) {
        return;
      }
      const data = await deleteCartItem(selectedItem);
      setShowPopup(true);
      setMessage(data.message);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }, [selectedItem]);

  const placeOrders = useCallback(
    (totalPrice: number) => {
      navigate('/orders', {
        state: {
          showPaymentMethodChoice: true,
          total_price: totalPrice,
        },
      });
    },
    [navigate]
  );

  const PopupModel = useCallback(() => {
    setShowPopup(false);
    fetchCartItems();
  }, []);

  return (
    <EnhancedCartList
      loading={loading}
      serverError={serverError}
      cartItems={cartItems}
      message={message}
      deleteCartItems={deleteCartItems}
      placeOrders={placeOrders}
      PopupModel={PopupModel}
      showPopup={showPopup}
      setShowPopup={setShowPopup}
      setSelectedItem={setSelectedItem}
    />
  );
};

export default CartDataContainer;